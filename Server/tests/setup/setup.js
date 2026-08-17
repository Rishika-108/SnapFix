import {
    connectTestDB,
    disconnectTestDB,
    clearTestDB
} from "./mongoMemory.js";

jest.setTimeout(30000);

beforeAll(async () => {
    await connectTestDB();
});

afterEach(async () => {
    await clearTestDB();
});

afterAll(async () => {
    await disconnectTestDB();
});