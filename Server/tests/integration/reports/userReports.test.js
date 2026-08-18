import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../../app.js";
import Report from "../../../models/reportModel.js";
import Task from "../../../models/taskAssignmentModel.js";
import User from "../../../models/userModel.js";
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

describe("Suite G: User Profile & Community Reports (IT-USR-01 to IT-USR-07)", () => {
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

    // IT-USR-01: User Reports & Associated Tasks Retrieval
    test("IT-USR-01: GET /api/user/my-reports returns populated reports with task details and upvoted reports", async () => {
        const { citizen, token: citizenToken } = await createTestCitizen();
        const { worker } = await createTestWorker();
        const { admin } = await createTestAdmin();

        const report = await Report.create({
            title: "Overflowing Garbage",
            description: "Bin overflowing",
            category: "Sanitation",
            imageUrl: "https://res.cloudinary.com/test/garbage.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            status: "In Progress"
        });

        // Add report to user's reports array
        await User.findByIdAndUpdate(citizen._id, { $push: { reports: report._id } });

        const task = await Task.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            assignedBy: admin._id,
            status: "Assigned"
        });

        const res = await request(app)
            .get("/api/user/my-reports")
            .set("Authorization", `Bearer ${citizenToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.reports.length).toBe(1);
        expect(res.body.reports[0]._id.toString()).toBe(report._id.toString());
        expect(res.body.reports[0].task).not.toBeNull();
        expect(res.body.reports[0].task.status).toBe("Assigned");
    });

    // IT-USR-02: User Reports Empty State
    test("IT-USR-02: GET /api/user/my-reports with no reports returns 200 with empty arrays", async () => {
        const { token: citizenToken } = await createTestCitizen();

        const res = await request(app)
            .get("/api/user/my-reports")
            .set("Authorization", `Bearer ${citizenToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.reports).toEqual([]);
        expect(res.body.upvotedReports).toEqual([]);
    });

    // IT-USR-03: Report Upvote Toggle (Add Upvote)
    test("IT-USR-03: Upvote endpoint increments count and stores user in upvotedUsers", async () => {
        const { citizen: author } = await createTestCitizen();
        const { citizen: voter, token: voterToken } = await createTestCitizen();

        const report = await Report.create({
            title: "Broken Footpath",
            description: "Damaged tiles",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/footpath.jpg",
            createdBy: author._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            upvotes: 0,
            upvotedUsers: []
        });

        const res = await request(app)
            .post(`/api/report/upvote/${report._id}`)
            .set("Authorization", `Bearer ${voterToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.upvotes).toBe(1);
        expect(res.body.message).toMatch(/issue upvoted/i);

        const updatedReport = await Report.findById(report._id);
        expect(updatedReport.upvotes).toBe(1);
        expect(updatedReport.upvotedUsers.map(id => id.toString())).toContain(voter._id.toString());
    });

    // IT-USR-04: Report Upvote Toggle (Remove Upvote)
    test("IT-USR-04: Second upvote call toggles off upvote and decrements count", async () => {
        const { citizen: author } = await createTestCitizen();
        const { citizen: voter, token: voterToken } = await createTestCitizen();

        const report = await Report.create({
            title: "Broken Footpath",
            description: "Damaged tiles",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/footpath.jpg",
            createdBy: author._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            upvotes: 1,
            upvotedUsers: [voter._id]
        });

        const res = await request(app)
            .post(`/api/report/upvote/${report._id}`)
            .set("Authorization", `Bearer ${voterToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.upvotes).toBe(0);
        expect(res.body.message).toMatch(/upvote removed/i);

        const updatedReport = await Report.findById(report._id);
        expect(updatedReport.upvotes).toBe(0);
        expect(updatedReport.upvotedUsers.length).toBe(0);
    });

    // IT-USR-05: Single Report Detail Query
    test("IT-USR-05: GET /api/report/get-report/:id returns report details or error if missing", async () => {
        const { citizen } = await createTestCitizen();

        const report = await Report.create({
            title: "Water Leakage",
            description: "Pipeline burst",
            category: "Water",
            imageUrl: "https://res.cloudinary.com/test/water.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] }
        });

        const validRes = await request(app)
            .get(`/api/report/get-report/${report._id}`);

        expect(validRes.status).toBe(200);
        expect(validRes.body.report.title).toBe("Water Leakage");

        const nonExistentId = new User()._id;
        const invalidRes = await request(app)
            .get(`/api/report/get-report/${nonExistentId}`);

        expect(invalidRes.status).toBe(400);
        expect(invalidRes.body.message).toMatch(/could not find report/i);
    });

    // IT-USR-06: Report Creation Missing Inputs
    test("IT-USR-06: Report creation missing image or coordinates returns HTTP 400", async () => {
        const { token: citizenToken } = await createTestCitizen();

        // Missing location coordinates
        const missingLocRes = await request(app)
            .post("/api/report/create-report")
            .set("Authorization", `Bearer ${citizenToken}`)
            .field("title", "Broken Road")
            .field("category", "Road");

        expect(missingLocRes.status).toBe(400);
        expect(missingLocRes.body.message).toMatch(/location is missing/i);

        // Missing image
        const missingImgRes = await request(app)
            .post("/api/report/create-report")
            .set("Authorization", `Bearer ${citizenToken}`)
            .field("title", "Broken Road")
            .field("category", "Road")
            .field("latitude", "19.0760")
            .field("longitude", "72.8777");

        expect(missingImgRes.status).toBe(400);
        expect(missingImgRes.body.message).toMatch(/image is required/i);
    });

    // IT-USR-07: Location Feed for Zero-Report User
    test("IT-USR-07: GET /api/report/location with no user reports returns 200 with empty array", async () => {
        const { token: citizenToken } = await createTestCitizen();

        const res = await request(app)
            .get("/api/report/location")
            .set("Authorization", `Bearer ${citizenToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.reports).toEqual([]);
        expect(res.body.message).toMatch(/no previous reports found/i);
    });
});
