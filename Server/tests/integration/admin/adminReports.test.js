import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../../app.js";
import Report from "../../../models/reportModel.js";
import Bid from "../../../models/bidModel.js";
import Task from "../../../models/taskAssignmentModel.js";
import {
    connectTestDB,
    disconnectTestDB,
    clearTestDB
} from "../../setup/mongoMemory.js";
import {
    setupTestEnv,
    createTestCitizen,
    createTestWorker,
    createTestAdmin
} from "../../helpers/testHelpers.js";

describe("Suite H (Part 2): Admin Reporting & Payout Guards (IT-ADM-04 to IT-ADM-07)", () => {
    beforeAll(async () => {
        setupTestEnv();
        await connectTestDB();
    }, 30000);

    afterEach(async () => {
        await clearTestDB();
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    // IT-ADM-04: Admin View All Reports
    test("IT-ADM-04: GET /api/admin/all-reports returns 200 for admin and 403 for citizen", async () => {
        const { citizen, token: citizenToken } = await createTestCitizen();
        const { admin, token: adminToken } = await createTestAdmin();

        await Report.create({
            title: "Road Issue",
            description: "Deep pothole",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/road.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] }
        });

        // Admin Access
        const adminRes = await request(app)
            .get("/api/admin/all-reports")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(adminRes.status).toBe(200);
        expect(adminRes.body.success).toBe(true);
        expect(adminRes.body.reports.length).toBe(1);

        // Citizen Access Blocked
        const citizenRes = await request(app)
            .get("/api/admin/all-reports")
            .set("Authorization", `Bearer ${citizenToken}`);

        expect(citizenRes.status).toBe(403);
        expect(citizenRes.body.message).toMatch(/access denied/i);
    });

    // IT-ADM-05: Admin View Report With Bids
    test("IT-ADM-05: GET /api/admin/bids/:id returns report with bids or 404 when no bids", async () => {
        const { citizen } = await createTestCitizen();
        const { worker } = await createTestWorker();
        const { admin, token: adminToken } = await createTestAdmin();

        const report = await Report.create({
            title: "Pothole",
            description: "Deep hole",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/pothole.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] }
        });

        // No bids placed yet -> 404
        const noBidsRes = await request(app)
            .get(`/api/admin/bids/${report._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(noBidsRes.status).toBe(404);
        expect(noBidsRes.body.message).toMatch(/no bids on this particular report/i);

        // Place a bid
        await Bid.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            bidAmount: 150,
            resourceNote: "Tools ready",
            duration: "1 day",
            status: "Pending"
        });

        const withBidsRes = await request(app)
            .get(`/api/admin/bids/${report._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(withBidsRes.status).toBe(200);
        expect(withBidsRes.body.getBids.length).toBe(1);
        expect(withBidsRes.body.getBids[0].bidAmount).toBe(150);
    });

    // IT-ADM-06: Admin Completed Tasks Pending Payout
    test("IT-ADM-06: GET /api/admin/completed-tasks aggregates completed verified tasks with approved bid amounts", async () => {
        const { citizen } = await createTestCitizen();
        const { worker } = await createTestWorker();
        const { admin, token: adminToken } = await createTestAdmin();

        const report = await Report.create({
            title: "Water Problem",
            description: "Leaking pipe",
            category: "Water",
            imageUrl: "https://res.cloudinary.com/test/water.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            status: "Resolved"
        });

        await Bid.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            bidAmount: 400,
            duration: "3 days",
            status: "Approved"
        });

        await Task.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            assignedBy: admin._id,
            status: "Completed",
            verifiedByCitizen: true,
            paymentStatus: "Pending"
        });

        const res = await request(app)
            .get("/api/admin/completed-tasks")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.tasks.length).toBe(1);
        expect(res.body.tasks[0].bidAmount).toBe(400);
        expect(res.body.tasks[0].duration).toBe("3 days");
    });

    // IT-ADM-07: Payment Release Duplicate Guard
    test("IT-ADM-07: Releasing payment on already released task returns HTTP 400", async () => {
        const { citizen } = await createTestCitizen();
        const { worker } = await createTestWorker();
        const { admin, token: adminToken } = await createTestAdmin();

        const report = await Report.create({
            title: "Light Fix",
            description: "Bulb replacement",
            category: "Lighting",
            imageUrl: "https://res.cloudinary.com/test/light.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] }
        });

        await Bid.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            bidAmount: 100,
            status: "Approved"
        });

        const task = await Task.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            assignedBy: admin._id,
            status: "Completed",
            verifiedByCitizen: true,
            paymentStatus: "Released" // already released
        });

        const res = await request(app)
            .put(`/api/admin/release-payment/${task._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/payment has already been released/i);
    });
});
