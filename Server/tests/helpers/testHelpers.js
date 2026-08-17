import jwt from "jsonwebtoken";
import User from "../../models/userModel.js";
import Worker from "../../models/gigWorkerModel.js";
import Admin from "../../models/adminModel.js";
import path from "path";
import fs from "fs";

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
    const tempPath = path.join(dirPath, "sample_test_image.jpg");
    if (!fs.existsSync(tempPath)) {
        // Minimal 1x1 JPEG
        const minimalJpeg = Buffer.from(
            "ffd8ffe000104a46494600010101006000600000ffdb004300080606070605080707070909080a0c140d0c0b0b0c1912130f141d1a1f1e1d1a1c1c20242e2720222c231c1c2837292c30313434341f27393d38323c2e333432ffc0000b080001000101011100ffc4001f0000010501010101010100000000000000000102030405060708090a0bffc400b51000020103030204030505040400010d01020304051106122131411322328107234291a1b1c1d1e1f2425262728292a333435363738393a434445464748494a52535455565758595a62636465666768696a72737475767778797a82838485868788898aa2a3a4a5a6a7a8a9aa5b6b7b8b9babbc4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae2e3e4e5e6e7e8e9eaf2f3f4f5f6f7f8f9fa00ffda000c03010002110311003f00bf00ffd9",
            "hex"
        );
        fs.writeFileSync(tempPath, minimalJpeg);
    }
    return tempPath;
};
