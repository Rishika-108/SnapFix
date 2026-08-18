import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../../app.js";
import Report from "../../../models/reportModel.js";
import Bid from "../../../models/bidModel.js";
import Task from "../../../models/taskAssignmentModel.js";
import Worker from "../../../models/gigWorkerModel.js";
import Payment from "../../../models/paymentModel.js";
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

describe("Suite D: Financial Payout Settlement (IT-PAY-01 & IT-PAY-02)", () => {
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

    test("IT-PAY-01: Financial Payout Settlement", async () => {
        const { citizen } = await createTestCitizen();
        const { worker } = await createTestWorker({ walletBalance: 50 });
        const { admin, token: adminToken } = await createTestAdmin();

        const report = await Report.create({
            title: "Pothole Fixed Test",
            description: "Fixed pothole",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/pothole.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            status: "Resolved"
        });

        const bid = await Bid.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            bidAmount: 250,
            status: "Approved"
        });

        const task = await Task.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            assignedBy: admin._id,
            status: "Completed",
            verifiedByCitizen: true,
            verifiedAt: new Date(),
            paymentStatus: "Pending"
        });

        const res = await request(app)
            .put(`/api/admin/release-payment/${task._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toContain("successfully released");
        expect(res.body.transactionId).toMatch(/^TXN-/);
        expect(res.body.newWalletBalance).toBe(300); // 50 initial + 250 bidAmount

        // 1. Verify Worker wallet balance updated in DB
        const updatedWorker = await Worker.findById(worker._id);
        expect(updatedWorker.walletBalance).toBe(300);

        // 2. Verify Payment audit record created
        const paymentRecord = await Payment.findOne({ taskId: task._id });
        expect(paymentRecord).not.toBeNull();
        expect(paymentRecord.amount).toBe(250);
        expect(paymentRecord.status).toBe("Released");
        expect(paymentRecord.transactionId).toBe(res.body.transactionId);
        expect(paymentRecord.releasedBy.toString()).toBe(admin._id.toString());

        // 3. Verify Task paymentStatus updated
        const updatedTask = await Task.findById(task._id);
        expect(updatedTask.paymentStatus).toBe("Released");
    });

    test("IT-PAY-02: Unverified Payout Block", async () => {
        const { citizen } = await createTestCitizen();
        const { worker } = await createTestWorker();
        const { admin, token: adminToken } = await createTestAdmin();

        const report = await Report.create({
            title: "Unverified Task Report",
            description: "Work done but not verified",
            category: "Electricity",
            imageUrl: "https://res.cloudinary.com/test/unverified.jpg",
            createdBy: citizen._id,
            location: { type: "Point", coordinates: [72.8777, 19.0760] },
            status: "In Progress"
        });

        await Bid.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            bidAmount: 180,
            status: "Approved"
        });

        const unverifiedTask = await Task.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            assignedBy: admin._id,
            status: "Proof Submitted",
            verifiedByCitizen: false, // NOT VERIFIED
            paymentStatus: "Pending"
        });

        const res = await request(app)
            .put(`/api/admin/release-payment/${unverifiedTask._id}`)
            .set("Authorization", `Bearer ${adminToken}`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain("Payment cannot be released until the task is verified");

        // Verify worker wallet remained unchanged
        const checkWorker = await Worker.findById(worker._id);
        expect(checkWorker.walletBalance).toBe(0);
    });
});
