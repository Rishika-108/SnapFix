import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../../app.js";
import Report from "../../../models/reportModel.js";
import User from "../../../models/userModel.js";
import Notification from "../../../models/notificationModel.js";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import {
    connectTestDB,
    disconnectTestDB,
    clearTestDB
} from "../../setup/mongoMemory.js";
import {
    setupTestEnv,
    createTestCitizen,
    getSampleImagePath
} from "../../helpers/testHelpers.js";
import { Writable } from "stream";

describe("Suite B: Feed Querying & Async Operations (IT-REP-04 & IT-REP-05)", () => {
    beforeAll(async () => {
        setupTestEnv();
        await connectTestDB();
        await Report.init();
    }, 30000);

    afterEach(async () => {
        await clearTestDB();
        jest.restoreAllMocks();
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    test("IT-REP-04: Geospatial Feed Querying", async () => {
        const { citizen, token } = await createTestCitizen();

        // Seed a report created by this citizen (so user has location reference)
        const userReport = await Report.create({
            title: "User's Reference Issue",
            description: "Reference point report",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/ref.jpg",
            createdBy: citizen._id,
            location: {
                type: "Point",
                coordinates: [72.8777, 19.0760] // Mumbai coordinates
            }
        });

        // Seed nearby report (within ~2km)
        const nearbyReport = await Report.create({
            title: "Nearby Pothole",
            description: "2km away issue",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/nearby.jpg",
            location: {
                type: "Point",
                coordinates: [72.8800, 19.0800]
            }
        });

        // Seed distant report (>50km away)
        const distantReport = await Report.create({
            title: "Distant Issue",
            description: "Far away issue",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/distant.jpg",
            location: {
                type: "Point",
                coordinates: [73.8567, 18.5204] // Pune coordinates (~120km away)
            }
        });

        const res = await request(app)
            .get("/api/report/location")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.reports).toBeDefined();

        const reportIds = res.body.reports.map(r => r._id.toString());
        expect(reportIds).toContain(nearbyReport._id.toString());
        expect(reportIds).not.toContain(distantReport._id.toString());
    });

    test("IT-REP-05: Post-Response Async Operations", async () => {
        const { citizen, token } = await createTestCitizen();
        const sampleImage = getSampleImagePath();

        jest.spyOn(cloudinary.uploader, "upload_stream").mockImplementation((options, callback) => {
            const cb = typeof options === 'function' ? options : callback;
            const writable = new Writable({ write(c, e, n) { n(); } });
            process.nextTick(() => {
                if (cb) cb(null, { secure_url: "https://res.cloudinary.com/test/async.jpg" });
            });
            return writable;
        });

        jest.spyOn(axios, "post").mockResolvedValueOnce({
            data: {
                is_valid: true,
                confidence: 0.88,
                embedding: Array(512).fill(0.2)
            }
        });

        const res = await request(app)
            .post("/api/report/create-report")
            .set("Authorization", `Bearer ${token}`)
            .attach("image", sampleImage)
            .field("title", "Broken Garbage Bin")
            .field("description", "Garbage bin damaged")
            .field("category", "Garbage")
            .field("latitude", 19.0760)
            .field("longitude", 72.8777);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);

        const reportId = res.body.report.id;

        // Allow async background work (User update & Notification creation) to complete
        await new Promise(resolve => setTimeout(resolve, 300));

        // 1. Verify User reports array updated
        const updatedUser = await User.findById(citizen._id);
        expect(updatedUser.reports.map(r => r.toString())).toContain(reportId.toString());

        // 2. Verify Notification created
        const notifications = await Notification.find({ userId: citizen._id });
        expect(notifications.length).toBeGreaterThan(0);
        expect(notifications[0].type).toBe("Report Created");
    });
});
