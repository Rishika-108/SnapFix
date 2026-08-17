import {
    connectTestDB,
    disconnectTestDB,
    clearTestDB
} from "./mongoMemory.js";

beforeAll(async () => {
    await connectTestDB();
});

afterEach(async () => {
    await clearTestDB();
});

afterAll(async () => {
    await disconnectTestDB();
});