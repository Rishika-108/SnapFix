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

describe("Suite B: IT-REP-01 Report Intake & Ingestion", () => {
    beforeAll(async () => {
        setupTestEnv();
        await connectTestDB();
        await Report.init(); // Ensure 2dsphere index is built
    }, 30000);

    afterEach(async () => {
        await clearTestDB();
        jest.restoreAllMocks();
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    test("IT-REP-01: Report Ingestion + Parallel I/O", async () => {
        const { citizen, token } = await createTestCitizen();
        const sampleImage = getSampleImagePath();

        // Spy on Cloudinary upload_stream
        jest.spyOn(cloudinary.uploader, "upload_stream").mockImplementation((options, callback) => {
            const cb = typeof options === 'function' ? options : callback;
            const writable = new Writable({
                write(chunk, encoding, next) {
                    next();
                }
            });
            process.nextTick(() => {
                if (cb) {
                    cb(null, {
                        secure_url: "https://res.cloudinary.com/snapfix/image/upload/v123456/reports_uploads/sample.jpg"
                    });
                }
            });
            return writable;
        });

        // Spy on AI FastAPI /get_embedding response
        const mockEmbedding = Array(512).fill(0.1);
        jest.spyOn(axios, "post").mockResolvedValueOnce({
            data: {
                is_valid: true,
                confidence: 0.95,
                embedding: mockEmbedding
            }
        });

        const res = await request(app)
            .post("/api/report/create-report")
            .set("Authorization", `Bearer ${token}`)
            .attach("image", sampleImage)
            .field("title", "Broken Street Light")
            .field("description", "Street light at Main St is flickering and dangerous")
            .field("category", "Electricity")
            .field("latitude", 19.0760)
            .field("longitude", 72.8777);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Report raised successfully");
        expect(res.body.report).toBeDefined();
        expect(res.body.report.title).toBe("Broken Street Light");
        expect(res.body.report.imageUrl).toContain("cloudinary.com");

        // Verify DB state
        const savedReport = await Report.findById(res.body.report.id);
        expect(savedReport).not.toBeNull();
        expect(savedReport.category).toBe("Electricity");
        expect(savedReport.aiConfidence).toBe(0.95);
        expect(savedReport.embedding).toHaveLength(512);
        expect(savedReport.createdBy.toString()).toBe(citizen._id.toString());
    });
});