import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../../app.js";
import Notification from "../../../models/notificationModel.js";
import {
    connectTestDB,
    disconnectTestDB,
    clearTestDB
} from "../../setup/mongoMemory.js";
import {
    setupTestEnv,
    createTestCitizen
} from "../../helpers/testHelpers.js";

describe("Suite I: Notifications System (IT-NOTIF-01, IT-NOTIF-02)", () => {
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

    // IT-NOTIF-01: Notification Feed Retrieval
    test("IT-NOTIF-01: GET /api/notifications returns user notifications sorted newest first", async () => {
        const { citizen, token: citizenToken } = await createTestCitizen();

        await Notification.create([
            {
                userId: citizen._id,
                userType: "User",
                type: "Report Created",
                message: "First notification",
                createdAt: new Date(Date.now() - 5000)
            },
            {
                userId: citizen._id,
                userType: "User",
                type: "Bid Approved",
                message: "Second notification",
                createdAt: new Date()
            }
        ]);

        const res = await request(app)
            .get("/api/notifications")
            .set("Authorization", `Bearer ${citizenToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.notifications.length).toBe(2);
        expect(res.body.notifications[0].message).toBe("Second notification");
    });

    // IT-NOTIF-02: Mark Notification as Read
    test("IT-NOTIF-02: PUT /api/notifications/read/:id updates notification isRead to true", async () => {
        const { citizen, token: citizenToken } = await createTestCitizen();

        const notif = await Notification.create({
            userId: citizen._id,
            userType: "User",
            type: "Work Started",
            message: "A worker has started work",
            isRead: false
        });

        const res = await request(app)
            .put(`/api/notifications/read/${notif._id}`)
            .set("Authorization", `Bearer ${citizenToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toMatch(/marked as read/i);

        const updated = await Notification.findById(notif._id);
        expect(updated.isRead).toBe(true);
    });
});
