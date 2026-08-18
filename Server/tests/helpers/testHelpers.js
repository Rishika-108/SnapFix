import { jest } from "@jest/globals";
import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";
import Worker from "../../models/gigWorkerModel.js";
import Admin from "../../models/adminModel.js";
import path from "path";
import fs from "fs";
import { Writable } from "stream";

export const TEST_JWT_SECRET = "snapfix-test-secret-key-12345";

export const setupTestEnv = () => {
    process.env.JWT_SECRET = TEST_JWT_SECRET;
    process.env.AI_SERVER_URL = "http://localhost:8000";
};

export const generateTestToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || TEST_JWT_SECRET);
};

export const createTestCitizen = async (overrides = {}) => {
    const citizen = await User.create({
        name: "John Citizen",
        email: `citizen_${Date.now()}_${Math.random()}@example.com`,
        password: "password123",
        role: "citizen",
        ...overrides,
    });
    const token = generateTestToken(citizen._id.toString(), "citizen");
    return { citizen, token };
};

export const createTestWorker = async (overrides = {}) => {
    const worker = await Worker.create({
        name: "Bob Worker",
        email: `worker_${Date.now()}_${Math.random()}@example.com`,
        password: "password123",
        phone: "9876543210",
        skills: ["Pothole Repair", "Road Maintenance"],
        location: {
            type: "Point",
            coordinates: [72.8777, 19.0760],
        },
        approvedStatus: "Verified",
        role: "gigworker",
        ...overrides,
    });
    const token = generateTestToken(worker._id.toString(), "gigworker");
    return { worker, token };
};

export const createTestAdmin = async (overrides = {}) => {
    const admin = await Admin.create({
        email: `admin_${Date.now()}_${Math.random()}@example.com`,
        password: "password123",
        role: "Local",
        ...overrides,
    });
    const token = generateTestToken(admin._id.toString(), admin.role);
    return { admin, token };
};

export const getSampleImagePath = () => {
    const dirPath = path.join(process.cwd(), "tests", "setup");
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    const uniqueId = Date.now() + "_" + Math.random().toString(36).substring(2, 8);
    const tempPath = path.join(dirPath, `sample_test_image_${uniqueId}.png`);

    // Guaranteed valid 1x1 PNG image base64 buffer readable by Sharp
    const validPngBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==";

    fs.writeFileSync(tempPath, Buffer.from(validPngBase64, "base64"));
    return tempPath;
};

export const mockCloudinaryUpload = (cloudinary) => {
    cloudinary.uploader.upload_stream = jest.fn((options, callback) => {
        const cb = typeof options === "function" ? options : callback;
        const writable = new Writable({
            write(chunk, encoding, next) {
                next();
            }
        });
        process.nextTick(() => {
            if (cb) cb(null, { secure_url: "https://res.cloudinary.com/test.jpg" });
        });
        return writable;
    });
};