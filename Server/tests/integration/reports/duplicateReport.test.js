import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../../app.js";
import Report from "../../../models/reportModel.js";
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

describe("Suite B: Duplicate Suppression & Fallback (IT-REP-02 & IT-REP-03)", () => {
    beforeAll(async () => {
        setupTestEnv();
        await connectTestDB();
        await Report.init(); // Ensure 2dsphere index for $near queries
    }, 30000);

    afterEach(async () => {
        await clearTestDB();
        jest.restoreAllMocks();
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    test("IT-REP-02: Spatial + Vector Duplicate Suppression", async () => {
        const { citizen: creator } = await createTestCitizen();
        const { citizen: newReporter, token: newReporterToken } = await createTestCitizen();
        const sampleImage = getSampleImagePath();

        // Seed existing open report within 50m
        const mockVec = [0.6, 0.8];
        const existingReport = await Report.create({
            title: "Original Pothole",
            description: "Deep pothole on 5th avenue",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/pothole.jpg",
            createdBy: creator._id,
            location: {
                type: "Point",
                coordinates: [72.8777, 19.0760] // [long, lat]
            },
            status: "Pending",
            upvotes: 0,
            upvotedUsers: [],
            embedding: mockVec
        });

        jest.spyOn(cloudinary.uploader, "upload_stream").mockImplementation((options, callback) => {
            const cb = typeof options === 'function' ? options : callback;
            const writable = new Writable({ write(c, e, n) { n(); } });
            process.nextTick(() => {
                if (cb) cb(null, { secure_url: "https://res.cloudinary.com/test/new.jpg" });
            });
            return writable;
        });

        // AI returns identical vector -> Cosine similarity = 1.0 > 0.90
        jest.spyOn(axios, "post").mockResolvedValueOnce({
            data: {
                is_valid: true,
                confidence: 0.92,
                embedding: mockVec
            }
        });

        // Submit new report at coordinates within 10 meters (72.8777, 19.0760)
        const res = await request(app)
            .post("/api/report/create-report")
            .set("Authorization", `Bearer ${newReporterToken}`)
            .attach("image", sampleImage)
            .field("title", "Duplicate Pothole Report")
            .field("description", "Same pothole spotted")
            .field("category", "Road")
            .field("latitude", 19.0760)
            .field("longitude", 72.8777);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.isDuplicate).toBe(true);
        expect(res.body.message).toContain("A similar issue is already reported");

        // Verify upvotes incremented on original report
        const updatedReport = await Report.findById(existingReport._id);
        expect(updatedReport.upvotes).toBe(1);
        expect(updatedReport.upvotedUsers.map(u => u.toString())).toContain(newReporter._id.toString());
    });

    test("IT-REP-03: Fault Tolerant AI Fallback", async () => {
        const { citizen: creator } = await createTestCitizen();
        const { citizen: newReporter, token: newReporterToken } = await createTestCitizen();
        const sampleImage = getSampleImagePath();

        // Seed existing open report
        const existingReport = await Report.create({
            title: "Original Water Leakage",
            description: "Pipe burst near water tower",
            category: "Water",
            imageUrl: "https://res.cloudinary.com/test/water.jpg",
            createdBy: creator._id,
            location: {
                type: "Point",
                coordinates: [72.8777, 19.0760]
            },
            status: "Pending",
            upvotes: 0,
            upvotedUsers: []
        });

        jest.spyOn(cloudinary.uploader, "upload_stream").mockImplementation((options, callback) => {
            const cb = typeof options === 'function' ? options : callback;
            const writable = new Writable({ write(c, e, n) { n(); } });
            process.nextTick(() => {
                if (cb) cb(null, { secure_url: "https://res.cloudinary.com/test/fallback.jpg" });
            });
            return writable;
        });

        // Simulate AI service failure / timeout
        jest.spyOn(axios, "post").mockRejectedValueOnce(new Error("AI service connection timeout"));

        // Submit new report within 50m with matching category "Water"
        const res = await request(app)
            .post("/api/report/create-report")
            .set("Authorization", `Bearer ${newReporterToken}`)
            .attach("image", sampleImage)
            .field("title", "Water Overflowing")
            .field("description", "Same water leak")
            .field("category", "Water")
            .field("latitude", 19.0760)
            .field("longitude", 72.8777);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.isDuplicate).toBe(true);

        const updatedReport = await Report.findById(existingReport._id);
        expect(updatedReport.upvotes).toBe(1);
        expect(updatedReport.upvotedUsers.map(u => u.toString())).toContain(newReporter._id.toString());
    });
});
