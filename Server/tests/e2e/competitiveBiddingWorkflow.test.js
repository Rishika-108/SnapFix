import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../app.js";
import Report from "../../models/reportModel.js";
import Bid from "../../models/bidModel.js";
import Task from "../../models/taskAssignmentModel.js";
import Worker from "../../models/gigWorkerModel.js";
import Payment from "../../models/paymentModel.js";
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

describe("Section 5 (Workflow 3): Multi-Worker Competitive Bidding & Payout Lifecycle (E2E-WF-03)", () => {
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

    test("E2E-WF-03: Multi-worker bids -> Admin selects best bid -> Cascading rejection -> Completion -> Wallet settlement", async () => {
        const sampleImage = getSampleImagePath();

        // 1. Spies
        jest.spyOn(cloudinary.uploader, "upload_stream").mockImplementation((options, callback) => {
            const cb = typeof options === "function" ? options : callback;
            const writable = new Writable({ write(c, e, n) { n(); } });
            process.nextTick(() => {
                if (cb) cb(null, { secure_url: "https://res.cloudinary.com/test/park_cleanup.jpg" });
            });
            return writable;
        });

        jest.spyOn(cloudinary.uploader, "upload").mockResolvedValue({
            secure_url: "https://res.cloudinary.com/test/cleaned_park_proof.jpg"
        });

        jest.spyOn(axios, "post").mockResolvedValue({
            data: {
                is_valid: true,
                confidence: 0.98,
                embedding: new Array(512).fill(0.2)
            }
        });

        const { citizen, token: citizenToken } = await createTestCitizen();
        const { worker: workerA, token: workerAToken } = await createTestWorker({ name: "Worker Alpha" });
        const { worker: workerB, token: workerBToken } = await createTestWorker({ name: "Worker Beta" });
        const { admin, token: adminToken } = await createTestAdmin();

        // STEP 1: Citizen creates report
        const reportRes = await request(app)
            .post("/api/report/create-report")
            .set("Authorization", `Bearer ${citizenToken}`)
            .field("title", "Litter in Central Park")
            .field("description", "Heavy litter near gazebo")
            .field("category", "Sanitation")
            .field("latitude", 19.0760)
            .field("longitude", 72.8777)
            .attach("image", sampleImage);

        expect(reportRes.status).toBe(201);
        const reportId = reportRes.body.report.id;

        // STEP 2: Worker A bids $250
        const bidARes = await request(app)
            .post(`/api/bid/create-bid/${reportId}`)
            .set("Authorization", `Bearer ${workerAToken}`)
            .send({
                bidAmount: 250,
                resourceNote: "Will bring 2 assistants",
                duration: "2 days"
            });

        expect(bidARes.status).toBe(201);
        const bidAId = bidARes.body.bid.id;

        // STEP 3: Worker B bids $180 (more competitive)
        const bidBRes = await request(app)
            .post(`/api/bid/create-bid/${reportId}`)
            .set("Authorization", `Bearer ${workerBToken}`)
            .send({
                bidAmount: 180,
                resourceNote: "Specialized trash collection vehicle",
                duration: "1 day"
            });

        expect(bidBRes.status).toBe(201);
        const bidBId = bidBRes.body.bid.id;

        // STEP 4: Admin views competing bids
        const viewBidsRes = await request(app)
            .get(`/api/admin/bids/${reportId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(viewBidsRes.status).toBe(200);
        expect(viewBidsRes.body.getBids.length).toBe(2);

        // STEP 5: Admin selects Worker B's bid
        const approveRes = await request(app)
            .put(`/api/admin/approve-bid/${bidBId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(approveRes.status).toBe(201);
        const taskId = approveRes.body.task._id;

        // Verify cascading rejection on Bid A
        const rejectedBidA = await Bid.findById(bidAId);
        expect(rejectedBidA.status).toBe("Rejected");

        const approvedBidB = await Bid.findById(bidBId);
        expect(approvedBidB.status).toBe("Approved");

        // STEP 6: Worker B uploads work proof
        const proofRes = await request(app)
            .post(`/api/task/proof-upload/${taskId}`)
            .set("Authorization", `Bearer ${workerBToken}`)
            .field("remarks", "Park completely cleaned and disinfected")
            .field("latitude", "19.0760")
            .field("longitude", "72.8777")
            .attach("image", sampleImage);

        expect(proofRes.status).toBe(200);
        expect(proofRes.body.task.status).toBe("Proof Submitted");

        // STEP 7: Citizen verifies and accepts the work
        const verifyRes = await request(app)
            .post(`/api/task/verify/${taskId}`)
            .set("Authorization", `Bearer ${citizenToken}`)
            .send({ isSatisfied: true });

        expect(verifyRes.status).toBe(200);
        expect(verifyRes.body.task.status).toBe("Completed");

        // STEP 8: Admin checks completed tasks pending payout
        const completedRes = await request(app)
            .get("/api/admin/completed-tasks")
            .set("Authorization", `Bearer ${adminToken}`);

        expect(completedRes.status).toBe(200);
        expect(completedRes.body.tasks.length).toBe(1);
        expect(completedRes.body.tasks[0]._id.toString()).toBe(taskId.toString());
        expect(completedRes.body.tasks[0].bidAmount).toBe(180);

        // STEP 9: Admin releases payment
        const initialBalance = workerB.walletBalance || 0;
        const payoutRes = await request(app)
            .put(`/api/admin/release-payment/${taskId}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(payoutRes.status).toBe(200);
        expect(payoutRes.body.success).toBe(true);
        expect(payoutRes.body.newWalletBalance).toBe(initialBalance + 180);

        // Verify DB payment and task state
        const paymentRecord = await Payment.findOne({ taskId });
        expect(paymentRecord).not.toBeNull();
        expect(paymentRecord.amount).toBe(180);
        expect(paymentRecord.status).toBe("Released");

        const completedTask = await Task.findById(taskId);
        expect(completedTask.paymentStatus).toBe("Released");

        const updatedWorkerB = await Worker.findById(workerB._id);
        expect(updatedWorkerB.walletBalance).toBe(initialBalance + 180);
    });
});
