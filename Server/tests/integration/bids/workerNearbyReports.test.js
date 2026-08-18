import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../../app.js";
import Report from "../../../models/reportModel.js";
import Bid from "../../../models/bidModel.js";
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

describe("Suite C: IT-BID-03 Worker Nearby Job Query Integration", () => {
    beforeAll(async () => {
        setupTestEnv();
        await connectTestDB();
        await Report.init();
        await Worker.init();
    }, 30000);

    afterEach(async () => {
        await clearTestDB();
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    test("IT-BID-03: Worker Nearby Job Query", async () => {
        const { citizen } = await createTestCitizen();
        
        // Create worker with location [72.8777, 19.0760]
        const { worker, token: workerToken } = await createTestWorker({
            location: {
                type: "Point",
                coordinates: [72.8777, 19.0760]
            }
        });

        // Report 1: Nearby (within 500m)
        const nearbyReport = await Report.create({
            title: "Pothole nearby worker",
            description: "Close to worker home base",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/pothole_near.jpg",
            createdBy: citizen._id,
            location: {
                type: "Point",
                coordinates: [72.8780, 19.0765]
            }
        });

        // Report 2: Far away (>100km)
        const farReport = await Report.create({
            title: "Faraway issue",
            description: "Out of radius",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/far.jpg",
            createdBy: citizen._id,
            location: {
                type: "Point",
                coordinates: [73.8567, 18.5204] // Pune
            }
        });

        // Worker bids on nearbyReport
        await Bid.create({
            reportId: nearbyReport._id,
            gigWorkerId: worker._id,
            bidAmount: 200,
            resourceNote: "Will fix tomorrow",
            duration: "1 day",
            status: "Pending"
        });

        const res = await request(app)
            .get("/api/worker/location")
            .set("Authorization", `Bearer ${workerToken}`);

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.reports).toBeDefined();
        expect(res.body.myBidReportIds).toBeDefined();

        const reportIds = res.body.reports.map(r => r._id.toString());
        expect(reportIds).toContain(nearbyReport._id.toString());
        expect(reportIds).not.toContain(farReport._id.toString());

        // Verify myBidReportIds contains nearbyReport ID
        expect(res.body.myBidReportIds).toContain(nearbyReport._id.toString());
    });
});
