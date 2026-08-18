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

describe("Suite D: Admin Bid Approval & Cascading Operations (IT-ADM-01, 02, 03)", () => {
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

    test("IT-ADM-01: Bid Approval & Task Assignment", async () => {
        const { citizen } = await createTestCitizen();
        const { worker } = await createTestWorker();
        const { admin, token: adminToken } = await createTestAdmin();

        const report = await Report.create({
            title: "Road Hole",
            description: "Deep hole",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/hole.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            status: "Pending"
        });

        const bid = await Bid.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            bidAmount: 300,
            resourceNote: "Concrete fix",
            duration: "2 days",
            status: "Pending"
        });

        const res = await request(app)
            .put(`/api/admin/approve-bid/${bid._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("Bid approved and task assigned successfully");
        expect(res.body.task).toBeDefined();

        // 1. Verify bid status updated to Approved
        const updatedBid = await Bid.findById(bid._id);
        expect(updatedBid.status).toBe("Approved");

        // 2. Verify Task created with status Assigned
        const createdTask = await Task.findOne({ reportId: report._id });
        expect(createdTask).not.toBeNull();
        expect(createdTask.status).toBe("Assigned");
        expect(createdTask.gigWorkerId.toString()).toBe(worker._id.toString());
        expect(createdTask.assignedBy.toString()).toBe(admin._id.toString());

        // 3. Verify Report status updated to In Progress
        const updatedReport = await Report.findById(report._id);
        expect(updatedReport.status).toBe("In Progress");
        expect(updatedReport.adminApprovalStatus).toBe("Approved");
        expect(updatedReport.assignedGigWorker.toString()).toBe(worker._id.toString());
    });

    test("IT-ADM-02: Competing Bids Cascading Rejection", async () => {
        const { citizen } = await createTestCitizen();
        const { worker: workerA } = await createTestWorker({ email: "workerA@test.com" });
        const { worker: workerB } = await createTestWorker({ email: "workerB@test.com" });
        const { worker: workerC } = await createTestWorker({ email: "workerC@test.com" });
        const { admin, token: adminToken } = await createTestAdmin();

        const report = await Report.create({
            title: "Broken Streetlight",
            description: "No light at night",
            category: "Electricity",
            imageUrl: "https://res.cloudinary.com/test/light.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            status: "Pending"
        });

        const bidA = await Bid.create({
            reportId: report._id,
            gigWorkerId: workerA._id,
            bidAmount: 100,
            status: "Pending"
        });

        const bidB = await Bid.create({
            reportId: report._id,
            gigWorkerId: workerB._id,
            bidAmount: 120,
            status: "Pending"
        });

        const bidC = await Bid.create({
            reportId: report._id,
            gigWorkerId: workerC._id,
            bidAmount: 150,
            status: "Pending"
        });

        // Admin approves Bid A
        const res = await request(app)
            .put(`/api/admin/approve-bid/${bidA._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);

        // Verify Bid A is Approved, while Bid B and Bid C are Rejected
        const updatedBidA = await Bid.findById(bidA._id);
        const updatedBidB = await Bid.findById(bidB._id);
        const updatedBidC = await Bid.findById(bidC._id);

        expect(updatedBidA.status).toBe("Approved");
        expect(updatedBidB.status).toBe("Rejected");
        expect(updatedBidC.status).toBe("Rejected");
    });

    test("IT-ADM-03: Double Task Assignment Guard", async () => {
        const { citizen } = await createTestCitizen();
        const { worker: workerA } = await createTestWorker({ email: "workerA_guard@test.com" });
        const { worker: workerB } = await createTestWorker({ email: "workerB_guard@test.com" });
        const { admin, token: adminToken } = await createTestAdmin();

        const report = await Report.create({
            title: "Water Leakage",
            description: "Pipe burst",
            category: "Water",
            imageUrl: "https://res.cloudinary.com/test/pipe.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            status: "In Progress"
        });

        const bidA = await Bid.create({
            reportId: report._id,
            gigWorkerId: workerA._id,
            bidAmount: 200,
            status: "Approved"
        });

        const bidB = await Bid.create({
            reportId: report._id,
            gigWorkerId: workerB._id,
            bidAmount: 250,
            status: "Pending"
        });

        // Task already exists for this report
        await Task.create({
            reportId: report._id,
            gigWorkerId: workerA._id,
            assignedBy: admin._id,
            status: "Assigned",
            paymentStatus: "Pending"
        });

        // Admin attempts to approve Bid B after Task already created
        const res = await request(app)
            .put(`/api/admin/approve-bid/${bidB._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain("Task already assigned for this report");
    });
});
