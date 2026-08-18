import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../../app.js";
import Report from "../../../models/reportModel.js";
import Task from "../../../models/taskAssignmentModel.js";
import { v2 as cloudinary } from "cloudinary";
import {
    connectTestDB,
    disconnectTestDB,
    clearTestDB
} from "../../setup/mongoMemory.js";
import {
    setupTestEnv,
    createTestCitizen,
    createTestWorker,
    createTestAdmin,
    getSampleImagePath
} from "../../helpers/testHelpers.js";

describe("Suite F: Task Execution, Proofs & Citizen Verification (IT-TSK-01 to IT-TSK-09)", () => {
    beforeAll(async () => {
        setupTestEnv();
        await connectTestDB();
    }, 30000);

    beforeEach(() => {
        // Mock Cloudinary upload
        cloudinary.uploader.upload = jest.fn().mockResolvedValue({
            secure_url: "https://res.cloudinary.com/snapfix/proof_123.jpg"
        });
    });

    afterEach(async () => {
        await clearTestDB();
        jest.restoreAllMocks();
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    // IT-TSK-01: Worker Work Proof Upload
    test("IT-TSK-01: Worker Proof Upload updates task status to 'Proof Submitted' and notifies citizen", async () => {
        const { citizen } = await createTestCitizen();
        const { worker, token: workerToken } = await createTestWorker();
        const { admin } = await createTestAdmin();

        const report = await Report.create({
            title: "Broken Bench",
            description: "Park bench broken",
            category: "Public Property",
            imageUrl: "https://res.cloudinary.com/test/bench.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            status: "In Progress"
        });

        const task = await Task.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            assignedBy: admin._id,
            status: "Assigned"
        });

        const sampleImage = getSampleImagePath();

        const res = await request(app)
            .post(`/api/task/proof-upload/${task._id}`)
            .set("Authorization", `Bearer ${workerToken}`)
            .field("remarks", "Bench fixed with new wooden planks")
            .field("latitude", "19.0760")
            .field("longitude", "72.8777")
            .attach("image", sampleImage);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.task.status).toBe("Proof Submitted");
        expect(res.body.task.proof.imageUrl).toBe("https://res.cloudinary.com/snapfix/proof_123.jpg");
    });

    // IT-TSK-02: Proof Upload Role & Ownership Guards
    test("IT-TSK-02: Proof upload by unassigned worker or non-worker returns HTTP 403", async () => {
        const { citizen, token: citizenToken } = await createTestCitizen();
        const { worker: assignedWorker } = await createTestWorker();
        const { worker: otherWorker, token: otherWorkerToken } = await createTestWorker();
        const { admin } = await createTestAdmin();

        const report = await Report.create({
            title: "Pothole",
            description: "Large pothole",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/pothole.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            status: "In Progress"
        });

        const task = await Task.create({
            reportId: report._id,
            gigWorkerId: assignedWorker._id,
            assignedBy: admin._id,
            status: "Assigned"
        });

        const sampleImage = getSampleImagePath();

        // Non-worker attempt
        const nonWorkerRes = await request(app)
            .post(`/api/task/proof-upload/${task._id}`)
            .set("Authorization", `Bearer ${citizenToken}`)
            .field("latitude", "19.0760")
            .field("longitude", "72.8777")
            .attach("image", sampleImage);

        expect(nonWorkerRes.status).toBe(403);

        // Unassigned worker attempt
        const unassignedWorkerRes = await request(app)
            .post(`/api/task/proof-upload/${task._id}`)
            .set("Authorization", `Bearer ${otherWorkerToken}`)
            .field("latitude", "19.0760")
            .field("longitude", "72.8777")
            .attach("image", sampleImage);

        expect(unassignedWorkerRes.status).toBe(403);
        expect(unassignedWorkerRes.body.message).toMatch(/not assigned to this task/i);
    });

    // IT-TSK-03: Proof Upload Missing Image / Coordinates
    test("IT-TSK-03: Proof upload without image or location returns HTTP 400 Bad Request", async () => {
        const { citizen } = await createTestCitizen();
        const { worker, token: workerToken } = await createTestWorker();
        const { admin } = await createTestAdmin();

        const report = await Report.create({
            title: "Pothole",
            description: "Large pothole",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/pothole.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            status: "In Progress"
        });

        const task = await Task.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            assignedBy: admin._id,
            status: "Assigned"
        });

        // Missing image
        const missingImageRes = await request(app)
            .post(`/api/task/proof-upload/${task._id}`)
            .set("Authorization", `Bearer ${workerToken}`)
            .field("latitude", "19.0760")
            .field("longitude", "72.8777");

        expect(missingImageRes.status).toBe(400);
        expect(missingImageRes.body.message).toMatch(/image is required/i);

        // Missing location
        const sampleImage = getSampleImagePath();
        const missingLocationRes = await request(app)
            .post(`/api/task/proof-upload/${task._id}`)
            .set("Authorization", `Bearer ${workerToken}`)
            .attach("image", sampleImage);

        expect(missingLocationRes.status).toBe(400);
        expect(missingLocationRes.body.message).toMatch(/location is missing/i);
    });

    // IT-TSK-04: Double Proof Submission Guard
    test("IT-TSK-04: Re-submitting proof for already submitted task returns HTTP 400", async () => {
        const { citizen } = await createTestCitizen();
        const { worker, token: workerToken } = await createTestWorker();
        const { admin } = await createTestAdmin();

        const report = await Report.create({
            title: "Pothole",
            description: "Large pothole",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/pothole.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            status: "In Progress"
        });

        const task = await Task.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            assignedBy: admin._id,
            status: "Proof Submitted",
            proof: {
                imageUrl: "https://res.cloudinary.com/snapfix/proof_123.jpg",
                uploadedAt: new Date()
            }
        });

        const sampleImage = getSampleImagePath();

        const res = await request(app)
            .post(`/api/task/proof-upload/${task._id}`)
            .set("Authorization", `Bearer ${workerToken}`)
            .field("latitude", "19.0760")
            .field("longitude", "72.8777")
            .attach("image", sampleImage);

        expect(res.status).toBe(400);
        expect(res.body.message).toMatch(/proof already submitted/i);
    });

    // IT-TSK-05: Citizen Task Acceptance
    test("IT-TSK-05: Citizen acceptance marks task 'Completed' and report 'Resolved'", async () => {
        const { citizen, token: citizenToken } = await createTestCitizen();
        const { worker } = await createTestWorker();
        const { admin } = await createTestAdmin();

        const report = await Report.create({
            title: "Pothole",
            description: "Large pothole",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/pothole.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            status: "In Progress"
        });

        const task = await Task.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            assignedBy: admin._id,
            status: "Proof Submitted"
        });

        const res = await request(app)
            .post(`/api/task/verify/${task._id}`)
            .set("Authorization", `Bearer ${citizenToken}`)
            .send({ isSatisfied: true });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.task.status).toBe("Completed");
        expect(res.body.task.verifiedByCitizen).toBe(true);

        const updatedReport = await Report.findById(report._id);
        expect(updatedReport.status).toBe("Resolved");
    });

    // IT-TSK-06: Citizen Task Rejection (Rework Trigger)
    test("IT-TSK-06: Citizen rejection marks task 'Rejected' and report 'Rejected'", async () => {
        const { citizen, token: citizenToken } = await createTestCitizen();
        const { worker } = await createTestWorker();
        const { admin } = await createTestAdmin();

        const report = await Report.create({
            title: "Streetlight",
            description: "Dark street",
            category: "Lighting",
            imageUrl: "https://res.cloudinary.com/test/light.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            status: "In Progress"
        });

        const task = await Task.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            assignedBy: admin._id,
            status: "Proof Submitted"
        });

        const res = await request(app)
            .post(`/api/task/verify/${task._id}`)
            .set("Authorization", `Bearer ${citizenToken}`)
            .send({ isSatisfied: false });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.task.status).toBe("Rejected");
        expect(res.body.task.verifiedByCitizen).toBe(false);

        const updatedReport = await Report.findById(report._id);
        expect(updatedReport.status).toBe("Rejected");
    });

    // IT-TSK-07: Citizen Verification Ownership Guard
    test("IT-TSK-07: Non-creator attempting to verify task returns HTTP 403 Forbidden", async () => {
        const { citizen: originalCitizen } = await createTestCitizen();
        const { citizen: otherCitizen, token: otherCitizenToken } = await createTestCitizen();
        const { worker } = await createTestWorker();
        const { admin } = await createTestAdmin();

        const report = await Report.create({
            title: "Pothole",
            description: "Large pothole",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/pothole.jpg",
            createdBy: originalCitizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            status: "In Progress"
        });

        const task = await Task.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            assignedBy: admin._id,
            status: "Proof Submitted"
        });

        const res = await request(app)
            .post(`/api/task/verify/${task._id}`)
            .set("Authorization", `Bearer ${otherCitizenToken}`)
            .send({ isSatisfied: true });

        expect(res.status).toBe(403);
        expect(res.body.message).toMatch(/not authorised to verify the task/i);
    });

    // IT-TSK-08: Worker Assigned Tasks Query
    test("IT-TSK-08: Worker queries assigned tasks via GET /api/task/my-tasks", async () => {
        const { citizen } = await createTestCitizen();
        const { worker, token: workerToken } = await createTestWorker();
        const { admin } = await createTestAdmin();

        const report = await Report.create({
            title: "Park Cleanliness",
            description: "Trash on grass",
            category: "Sanitation",
            imageUrl: "https://res.cloudinary.com/test/trash.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] }
        });

        await Task.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            assignedBy: admin._id,
            status: "Assigned"
        });

        const res = await request(app)
            .get("/api/task/my-tasks")
            .set("Authorization", `Bearer ${workerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.tasks.length).toBe(1);
        expect(res.body.tasks[0].reportId.title).toBe("Park Cleanliness");
    });

    // IT-TSK-09: Task Detail Access Control
    test("IT-TSK-09: Task detail is accessible by assigned worker and admin, blocked for random citizen", async () => {
        const { citizen: otherCitizen, token: otherCitizenToken } = await createTestCitizen();
        const { worker, token: workerToken } = await createTestWorker();
        const { admin, token: adminToken } = await createTestAdmin();

        const report = await Report.create({
            title: "Pothole",
            description: "Road issue",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/pothole.jpg",
            createdBy: otherCitizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] }
        });

        const task = await Task.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            assignedBy: admin._id,
            status: "Assigned"
        });

        // Worker Access
        const workerRes = await request(app)
            .get(`/api/task/${task._id}`)
            .set("Authorization", `Bearer ${workerToken}`);

        expect(workerRes.status).toBe(200);
        expect(workerRes.body.task._id.toString()).toBe(task._id.toString());

        // Admin Access
        const adminRes = await request(app)
            .get(`/api/task/${task._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(adminRes.status).toBe(200);

        // Unauthorized Citizen Access
        const citizenRes = await request(app)
            .get(`/api/task/${task._id}`)
            .set("Authorization", `Bearer ${otherCitizenToken}`);

        expect(citizenRes.status).toBe(403);
    });
});
