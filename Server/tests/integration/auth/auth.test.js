import { jest } from "@jest/globals";
import request from "supertest";
import app from "../../../app.js";
import User from "../../../models/userModel.js";
import Worker from "../../../models/gigWorkerModel.js";
import Admin from "../../../models/adminModel.js";
import {
    connectTestDB,
    disconnectTestDB,
    clearTestDB
} from "../../setup/mongoMemory.js";
import {
    setupTestEnv,
    generateTestToken
} from "../../helpers/testHelpers.js";
import mongoose from "mongoose";

describe("Suite E: Authentication, Registration & Session Management (IT-AUTH-01 to IT-AUTH-10)", () => {
    beforeAll(async () => {
        setupTestEnv();
        process.env.ADMIN_EMAIL = "admin@snapfix.gov";
        process.env.ADMIN_PASSWORD = "adminsecretpassword123";
        await connectTestDB();
    }, 30000);

    afterEach(async () => {
        await clearTestDB();
    });

    afterAll(async () => {
        await disconnectTestDB();
    });

    // IT-AUTH-01: Citizen Registration
    test("IT-AUTH-01: Citizen Registration creates user with hashed password", async () => {
        const payload = {
            name: "Alice Citizen",
            email: "alice@example.com",
            password: "password123"
        };

        const res = await request(app)
            .post("/api/auth/register-citizen")
            .send(payload);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.user.email).toBe("alice@example.com");
        expect(res.body.user.role).toBe("citizen");

        const dbUser = await User.findOne({ email: "alice@example.com" });
        expect(dbUser).not.toBeNull();
        expect(dbUser.password).not.toBe("password123"); // Password must be hashed
    });

    // IT-AUTH-02: Duplicate Citizen Email Conflict
    test("IT-AUTH-02: Duplicate Citizen Registration returns HTTP 409 Conflict", async () => {
        const payload = {
            name: "Alice Citizen",
            email: "alice_dup@example.com",
            password: "password123"
        };

        // First registration
        await request(app).post("/api/auth/register-citizen").send(payload);

        // Second registration with duplicate email
        const res = await request(app)
            .post("/api/auth/register-citizen")
            .send(payload);

        expect(res.status).toBe(409);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/already registered/i);
    });

    // IT-AUTH-03: Citizen Login (Valid vs Invalid Credentials)
    test("IT-AUTH-03: Citizen Login dispatches token on valid password and blocks invalid", async () => {
        await request(app)
            .post("/api/auth/register-citizen")
            .send({
                name: "Bob Citizen",
                email: "bob@example.com",
                password: "correctpassword"
            });

        // Invalid Password
        const invalidRes = await request(app)
            .post("/api/auth/login-citizen")
            .send({
                email: "bob@example.com",
                password: "wrongpassword"
            });

        expect(invalidRes.status).toBe(400);
        expect(invalidRes.body.success).toBe(false);

        // Valid Password
        const validRes = await request(app)
            .post("/api/auth/login-citizen")
            .send({
                email: "bob@example.com",
                password: "correctpassword"
            });

        expect(validRes.status).toBe(200);
        expect(validRes.body.success).toBe(true);
        expect(validRes.body.token).toBeDefined();
        expect(validRes.body.user.email).toBe("bob@example.com");
    });

    // IT-AUTH-04: Gig Worker Registration with Geospatial Point & Skills Array
    test("IT-AUTH-04: Gig Worker Registration parses skills and saves GeoJSON Point", async () => {
        const workerPayload = {
            name: "Dave Builder",
            email: "dave@example.com",
            password: "workerpass123",
            phone: "9876543210",
            skills: "Road Repair, Pothole Fixing",
            latitude: 19.0760,
            longitude: 72.8777
        };

        const res = await request(app)
            .post("/api/auth/register-worker")
            .send(workerPayload);

        expect(res.status).toBe(201);
        expect(res.body.success).toBe(true);
        expect(res.body.worker.skills).toEqual(["Road Repair", "Pothole Fixing"]);
        expect(res.body.worker.location.coordinates).toEqual([72.8777, 19.0760]);
    });

    // IT-AUTH-05: Gig Worker Registration Missing Location
    test("IT-AUTH-05: Gig Worker Registration without coordinates returns HTTP 400 Bad Request", async () => {
        const workerPayload = {
            name: "Dave Builder",
            email: "dave_nolocation@example.com",
            password: "workerpass123",
            phone: "9876543210",
            skills: ["Road Repair"]
        };

        const res = await request(app)
            .post("/api/auth/register-worker")
            .send(workerPayload);

        expect(res.status).toBe(400);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/location is missing/i);
    });

    // IT-AUTH-06: Gig Worker Login
    test("IT-AUTH-06: Gig Worker Login returns valid JWT with gigworker role", async () => {
        await request(app)
            .post("/api/auth/register-worker")
            .send({
                name: "Eve Worker",
                email: "eve@example.com",
                password: "evepassword",
                phone: "9876543211",
                skills: ["Plumbing"],
                latitude: 19.0760,
                longitude: 72.8777
            });

        const res = await request(app)
            .post("/api/auth/login-worker")
            .send({
                email: "eve@example.com",
                password: "evepassword"
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        expect(res.body.worker.role).toBe("gigworker");
    });

    // IT-AUTH-07: Admin Login & Auto-Bootstrap
    test("IT-AUTH-07: Admin Login bootstraps admin account on first run and returns token", async () => {
        const res = await request(app)
            .post("/api/auth/login-admin")
            .send({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD
            });

        expect(res.status).toBe(200);
        expect(res.body.success).toBe(true);
        expect(res.body.token).toBeDefined();
        expect(res.body.role).toBe("Local");

        const adminInDb = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
        expect(adminInDb).not.toBeNull();
    });

    // IT-AUTH-08: JWT Auth Middleware Header Validation
    test("IT-AUTH-08: Protected route without Bearer token returns HTTP 401", async () => {
        const res = await request(app)
            .get("/api/user/my-reports");

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/token not provided/i);
    });

    // IT-AUTH-09: JWT Auth Middleware Expired/Invalid Token
    test("IT-AUTH-09: Protected route with malformed token returns HTTP 401", async () => {
        const res = await request(app)
            .get("/api/user/my-reports")
            .set("Authorization", "Bearer invalid.jwt.token.string");

        expect(res.status).toBe(401);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/invalid or expired token/i);
    });

    // IT-AUTH-10: Auth Middleware Account Role Resolution / Session Expired
    test("IT-AUTH-10: Auth Middleware returns HTTP 404 if token references deleted account", async () => {
        const nonExistentId = new mongoose.Types.ObjectId().toString();
        const token = generateTestToken(nonExistentId, "citizen");

        const res = await request(app)
            .get("/api/user/my-reports")
            .set("Authorization", `Bearer ${token}`);

        expect(res.status).toBe(404);
        expect(res.body.success).toBe(false);
        expect(res.body.message).toMatch(/session expired/i);
    });
});
