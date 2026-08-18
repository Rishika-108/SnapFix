import Worker from "../../../models/gigWorkerModel.js";

describe("GigWorker schema (UT-SCH-05)", () => {
    test("UT-SCH-05: Gig Worker Approval Status Enum", async () => {
        // Invalid approvedStatus value
        const invalidWorker = new Worker({
            name: "Bob Builder",
            email: "bob@example.com",
            password: "password123",
            phone: "9876543210",
            skills: ["Masonry"],
            approvedStatus: "RandomStatus"
        });

        await expect(invalidWorker.validate()).rejects.toThrow();

        // Valid approvedStatus values: Pending, Verified, Rejected
        const validWorker = new Worker({
            name: "Bob Builder",
            email: "bob@example.com",
            password: "password123",
            phone: "9876543210",
            skills: ["Masonry"],
            approvedStatus: "Pending"
        });

        const validationError = validWorker.validateSync();
        expect(validationError).toBeUndefined();
        expect(validWorker.role).toBe("gigworker");
    });
});
