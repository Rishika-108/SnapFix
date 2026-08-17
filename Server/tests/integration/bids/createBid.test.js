import request from "supertest";
import app from "../../../app.js";
import Report from "../../../models/reportModel.js";
import Bid from "../../../models/bidModel.js";
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

describe("Suite C: IT-BID-01 & IT-BID-02 Bidding Integration", () => {
    beforeAll(async () => {
        setupTestEnv();
        await connectTestDB();
        await Bid.init(); // Ensure compound unique index on { reportId, gigWorkerId }
    }, 30000);

    afterEach(async () => {
        await clearTestDB();
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    test("IT-BID-01: Worker Bid Creation", async () => {
        const { citizen } = await createTestCitizen();
        const { worker, token: workerToken } = await createTestWorker();

        const report = await Report.create({
            title: "Pothole on Main St",
            description: "Large pothole causing traffic",
            category: "Road",
            imageUrl: "https://res.cloudinary.com/test/pothole.jpg",
            createdBy: citizen._id,
            location: {
                type: "Point",
                coordinates: [72.8777, 19.0760]
            }
        });

        const res = await request(app)
            .post(`/api/bid/create-bid/${report._id}`)
            .set("Authorization", `Bearer ${workerToken}`)
            .send({
                bidAmount: 150,
                resourceNote: "Will require cold asphalt and asphalt roller",
                duration: "1 day"
            });

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.message).toBe("Bid Applied Successfully");
        expect(res.body.bid).toBeDefined();
        expect(res.body.bid.bidAmount).toBe(150);
        expect(res.body.bid.status).toBe("Pending");

        const savedBid = await Bid.findById(res.body.bid.id);
        expect(savedBid).not.toBeNull();
        expect(savedBid.gigWorkerId.toString()).toBe(worker._id.toString());
        expect(savedBid.reportId.toString()).toBe(report._id.toString());
    });

    test("IT-BID-02: Duplicate Bid Constraint Enforcement", async () => {
        const { citizen } = await createTestCitizen();
        const { worker, token: workerToken } = await createTestWorker();

        const report = await Report.create({
            title: "Broken Bench in Park",
            description: "Wooden bench broken",
            category: "Parks",
            imageUrl: "https://res.cloudinary.com/test/bench.jpg",
            createdBy: citizen._id,
            location: {
                type: "Point",
                coordinates: [72.8777, 19.0760]
            }
        });

        // First bid
        await Bid.create({
            reportId: report._id,
            gigWorkerId: worker._id,
            bidAmount: 100,
            resourceNote: "Carpentry tools",
            duration: "3 hours",
            status: "Pending"
        });

        // Attempting second bid for the same report by the same worker
        const res = await request(app)
            .post(`/api/bid/create-bid/${report._id}`)
            .set("Authorization", `Bearer ${workerToken}`)
            .send({
                bidAmount: 120,
                resourceNote: "Updated tools",
                duration: "2 hours"
            });

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toContain("You have already placed a bid on this report");
    });
});
