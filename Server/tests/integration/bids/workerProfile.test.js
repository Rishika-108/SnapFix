import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../../app.js";
import Worker from "../../../models/gigWorkerModel.js";
import {
    connectTestDB,
    disconnectTestDB,
    clearTestDB
} from "../../setup/mongoMemory.js";
import {
    setupTestEnv,
    createTestCitizen,
    createTestWorker
} from "../../helpers/testHelpers.js";

describe("Suite H (Part 1): Worker Profile & Feed Edge Cases (IT-WRK-01, IT-WRK-02)", () => {
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

    // IT-WRK-01: Worker Profile Retrieval
    test("IT-WRK-01: GET /api/worker/profile returns profile for worker and 403 for citizen", async () => {
        const { worker, token: workerToken } = await createTestWorker();
        const { citizen, token: citizenToken } = await createTestCitizen();

        // Worker Access
        const workerRes = await request(app)
            .get("/api/worker/profile")
            .set("Authorization", `Bearer ${workerToken}`);

        expect(workerRes.status).toBe(200);
        expect(workerRes.body.success).toBe(true);
        expect(workerRes.body.worker._id.toString()).toBe(worker._id.toString());

        // Citizen Access Attempt
        const citizenRes = await request(app)
            .get("/api/worker/profile")
            .set("Authorization", `Bearer ${citizenToken}`);

        expect(citizenRes.status).toBe(403);
        expect(citizenRes.body.message).toMatch(/access denied/i);
    });

    // IT-WRK-02: Worker Feed Missing Location Guard
    test("IT-WRK-02: GET /api/worker/location returns HTTP 400 if worker has no coordinates", async () => {
        const { worker, token: workerToken } = await createTestWorker();

        // Remove worker location
        await Worker.findByIdAndUpdate(worker._id, { $unset: { location: 1 } });

        const res = await request(app)
            .get("/api/worker/location")
            .set("Authorization", `Bearer ${workerToken}`);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/worker location not set/i);
    });
});
