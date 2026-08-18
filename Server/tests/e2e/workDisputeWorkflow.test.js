import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../app.js";
import Report from "../../models/reportModel.js";
import Bid from "../../models/bidModel.js";
import Task from "../../models/taskAssignmentModel.js";
import Worker from "../../models/gigWorkerModel.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import {
    connectTestDB,
    disconnectTestDB,
    clearTestDB
} from "../setup/mongoMemory.js";
import {
    setupTestEnv,
    createTestCitizen,
    createTestWorker,
    createTestAdmin,
    getSampleImagePath
} from "../helpers/testHelpers.js";
import { Writable } from "stream";

describe("Section 5 (Workflow 2): Work Quality Dispute & Citizen Rejection Lifecycle (E2E-WF-02)", () => {
    beforeAll(async () => {
        setupTestEnv();
        await connectTestDB();
        await Report.init();
        await Worker.init();
        await Bid.init();
    }, 30000);

    afterEach(async () => {
        await clearTestDB();
        jest.restoreAllMocks();
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    test("E2E-WF-02: Work rejection marks task and report 'Rejected' and locks payment release", async () => {
        const sampleImage = getSampleImagePath();

        // 1. Spies
        jest.spyOn(cloudinary.uploader, "upload_stream").mockImplementation((options, callback) => {
            const cb = typeof options === "function" ? options : callback;
            const writable = new Writable({ write(c, e, n) { n(); } });
            process.nextTick(() => {
                if (cb) cb(null, { secure_url: "https://res.cloudinary.com/test/broken_lamp.jpg" });
            });
            return writable;
        });

        jest.spyOn(cloudinary.uploader, "upload").mockResolvedValue({
            secure_url: "https://res.cloudinary.com/test/poor_proof.jpg"
        });

        jest.spyOn(axios, "post").mockResolvedValue({
            data: {
                is_valid: true,
                confidence: 0.95,
                embedding: new Array(512).fill(0.1)
            }
        });

        const { citizen, token: citizenToken } = await createTestCitizen();
        const { worker, token: workerToken } = await createTestWorker();
        const { admin, token: adminToken } = await createTestAdmin();

        // STEP 1: Citizen creates report
        const reportRes = await request(app)
            .post("/api/report/create-report")
            .set("Authorization", `Bearer ${citizenToken}`)
            .field("title", "Flickering Street Lamp")
            .field("description", "Lamp fixture flickering intermittently")
            .field("category", "Lighting")
            .field("latitude", 19.0760)
            .field("longitude", 72.8777)
            .attach("image", sampleImage);

        expect(reportRes.status).toBe(201);
        const reportId = reportRes.body.report.id;

        // STEP 2: Worker places bid
        const bidRes = await request(app)
            .post(`/api/bid/create-bid/${reportId}`)
            .set("Authorization", `Bearer ${workerToken}`)
            .send({
                bidAmount: 180,
                resourceNote: "Will inspect wiring",
                duration: "1 day"
            });

        expect(bidRes.status).toBe(201);
        const bidId = bidRes.body.bid.id;

        // STEP 3: Admin approves bid
        const approveRes = await request(app)
            .put(`/api/admin/approve-bid/${bidId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(approveRes.status).toBe(201);
        const taskId = approveRes.body.task._id;

        // STEP 4: Worker submits sub-par proof
        const proofRes = await request(app)
            .post(`/api/task/proof-upload/${taskId}`)
            .set("Authorization", `Bearer ${workerToken}`)
            .field("remarks", "Tapped the wire with tape")
            .field("latitude", "19.0760")
            .field("longitude", "72.8777")
            .attach("image", sampleImage);

        expect(proofRes.status).toBe(200);
        expect(proofRes.body.task.status).toBe("Proof Submitted");

        // STEP 5: Citizen rejects the work (isSatisfied: false)
        const verifyRes = await request(app)
            .post(`/api/task/verify/${taskId}`)
            .set("Authorization", `Bearer ${citizenToken}`)
            .send({ isSatisfied: false });

        expect(verifyRes.status).toBe(200);
        expect(verifyRes.body.task.status).toBe("Rejected");
        expect(verifyRes.body.task.verifiedByCitizen).toBe(false);

        // STEP 6: Verify Report state and attempt payment release (must be blocked)
        const updatedReport = await Report.findById(reportId);
        expect(updatedReport.status).toBe("Rejected");

        const payoutRes = await request(app)
            .put(`/api/admin/release-payment/${taskId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(payoutRes.status).toBe(400);
        expect(payoutRes.body.message).toMatch(/cannot be released until the task is verified/i);
    });
});
