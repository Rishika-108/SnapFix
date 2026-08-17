import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../app.js";
import Report from "../../models/reportModel.js";
import Bid from "../../models/bidModel.js";
import Task from "../../models/taskAssignmentModel.js";
import Worker from "../../models/gigWorkerModel.js";
import Payment from "../../models/paymentModel.js";
import User from "../../models/userModel.js";
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

describe("Section 4: End-to-End (E2E) Full Lifecycle System Workflow Test", () => {
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

    test("E2E-01: Complete Multi-Actor Civic Issue Lifecycle (Citizen -> AI -> Worker -> Admin -> Worker -> Citizen -> Admin)", async () => {
        const sampleImage = getSampleImagePath();

        // Configure Spies
        jest.spyOn(cloudinary.uploader, "upload_stream").mockImplementation((options, callback) => {
            const cb = typeof options === 'function' ? options : callback;
            const writable = new Writable({ write(c, e, n) { n(); } });
            process.nextTick(() => {
                if (cb) cb(null, { secure_url: "https://res.cloudinary.com/test/civic_issue.jpg" });
            });
            return writable;
        });

        jest.spyOn(cloudinary.uploader, "upload").mockResolvedValue({
            secure_url: "https://res.cloudinary.com/test/proof_completed.jpg"
        });

        jest.spyOn(axios, "post").mockResolvedValue({
            data: {
                is_valid: true,
                confidence: 0.94,
                embedding: Array(512).fill(0.15)
            }
        });

        // -------------------------------------------------------------
        // STEP 0: Create Actor Accounts & Authentication Tokens
        // -------------------------------------------------------------
        const { citizen, token: citizenToken } = await createTestCitizen();
        const { worker, token: workerToken } = await createTestWorker({
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            walletBalance: 0
        });
        const { admin, token: adminToken } = await createTestAdmin();

        // -------------------------------------------------------------
        // STEP 1: Citizen Submits Civic Report -> AI Validation & Deduplication
        // -------------------------------------------------------------
        const step1Res = await request(app)
            .post("/api/report/create-report")
            .set("Authorization", `Bearer ${citizenToken}`)
            .attach("image", sampleImage)
            .field("title", "Severe Road Collapse")
            .field("description", "Large crater on main intersection")
            .field("category", "Road")
            .field("latitude", 19.0760)
            .field("longitude", 72.8777);

        expect(step1Res.status).toBe(201);
        expect(step1Res.body.success).toBe(true);
        const reportId = step1Res.body.report.id;
        expect(reportId).toBeDefined();

        // -------------------------------------------------------------
        // STEP 2: Gig Worker Discovers Nearby Reports (within 5km)
        // -------------------------------------------------------------
        const step2Res = await request(app)
            .get("/api/worker/location")
            .set("Authorization", `Bearer ${workerToken}`);

        expect(step2Res.status).toBe(200);
        expect(step2Res.body.success).toBe(true);
        const nearbyIds = step2Res.body.reports.map(r => r._id.toString());
        expect(nearbyIds).toContain(reportId.toString());

        // -------------------------------------------------------------
        // STEP 3: Gig Worker Submits Bidding Offer ($150)
        // -------------------------------------------------------------
        const step3Res = await request(app)
            .post(`/api/bid/create-bid/${reportId}`)
            .set("Authorization", `Bearer ${workerToken}`)
            .send({
                bidAmount: 150,
                resourceNote: "Heavy concrete patch & barrier setup",
                duration: "2 days"
            });

        expect(step3Res.status).toBe(201);
        expect(step3Res.body.success).toBe(true);
        const bidId = step3Res.body.bid.id;
        expect(bidId).toBeDefined();

        // -------------------------------------------------------------
        // STEP 4: Admin Approves Bid & Assigns Task
        // -------------------------------------------------------------
        const step4Res = await request(app)
            .put(`/api/admin/approve-bid/${bidId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(step4Res.status).toBe(201);
        expect(step4Res.body.success).toBe(true);
        const taskId = step4Res.body.task._id;
        expect(taskId).toBeDefined();

        // Verify intermediate DB state: Report status = "In Progress", Bid status = "Approved"
        const reportAfterStep4 = await Report.findById(reportId);
        expect(reportAfterStep4.status).toBe("In Progress");
        expect(reportAfterStep4.assignedGigWorker.toString()).toBe(worker._id.toString());

        // -------------------------------------------------------------
        // STEP 5: Worker Completes Work & Uploads Completion Proof
        // -------------------------------------------------------------
        const step5Res = await request(app)
            .post(`/api/task/proof-upload/${taskId}`)
            .set("Authorization", `Bearer ${workerToken}`)
            .attach("image", sampleImage)
            .field("remarks", "Repaired hole with quick-drying asphalt")
            .field("latitude", 19.0760)
            .field("longitude", 72.8777);

        expect(step5Res.status).toBe(200);
        expect(step5Res.body.success).toBe(true);
        expect(step5Res.body.task.status).toBe("Proof Submitted");

        // -------------------------------------------------------------
        // STEP 6: Citizen Verifies and Accepts Completed Task
        // -------------------------------------------------------------
        const step6Res = await request(app)
            .post(`/api/task/verify/${taskId}`)
            .set("Authorization", `Bearer ${citizenToken}`)
            .send({
                isSatisfied: true
            });

        expect(step6Res.status).toBe(200);
        expect(step6Res.body.success).toBe(true);
        expect(step6Res.body.task.status).toBe("Completed");
        expect(step6Res.body.task.verifiedByCitizen).toBe(true);

        // Verify Report status updated to "Resolved"
        const reportAfterStep6 = await Report.findById(reportId);
        expect(reportAfterStep6.status).toBe("Resolved");

        // -------------------------------------------------------------
        // STEP 7: Admin Releases Financial Payout ($150)
        // -------------------------------------------------------------
        const step7Res = await request(app)
            .put(`/api/admin/release-payment/${taskId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(step7Res.status).toBe(200);
        expect(step7Res.body.success).toBe(true);
        expect(step7Res.body.newWalletBalance).toBe(150);
        expect(step7Res.body.transactionId).toMatch(/^TXN-/);

        // -------------------------------------------------------------
        // FINAL AUDIT VERIFICATION
        // -------------------------------------------------------------
        const finalWorker = await Worker.findById(worker._id);
        expect(finalWorker.walletBalance).toBe(150);

        const paymentRecord = await Payment.findOne({ taskId });
        expect(paymentRecord).not.toBeNull();
        expect(paymentRecord.amount).toBe(150);
        expect(paymentRecord.status).toBe("Released");

        const finalTask = await Task.findById(taskId);
        expect(finalTask.paymentStatus).toBe("Released");
    });
});
