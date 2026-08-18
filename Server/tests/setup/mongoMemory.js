import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";

let mongoServer;

export const connectTestDB = async () => {
    if (mongoose.connection.readyState === 0) {
        mongoServer = await MongoMemoryServer.create({
            instance: {
                dbName: "snapfix_test",
                launchTimeout: 60000
            }
        });
        const uri = mongoServer.getUri();
        await mongoose.connect(uri);
    }
};

export const disconnectTestDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        try {
            await mongoose.connection.dropDatabase();
            await mongoose.connection.close();
        } catch (e) {
            // Ignore connection teardown errors during shutdown
        }
    }
    if (mongoServer) {
        try {
            await mongoServer.stop(true);
        } catch (e) {
            // Ignore server stop errors during shutdown
        }
        mongoServer = null;
    }
};

export const clearTestDB = async () => {
    if (mongoose.connection.readyState !== 0) {
        const collections = mongoose.connection.collections;
        for (const key in collections) {
            await collections[key].deleteMany({});
        }
    }
};