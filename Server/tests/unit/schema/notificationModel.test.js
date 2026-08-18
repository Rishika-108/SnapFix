import Notification from "../../../models/notificationModel.js";

describe("Notification schema (UT-SCH-07)", () => {
    test("UT-SCH-07: Notification UserType Enum & Defaults Validation", async () => {
        // Invalid userType enum value
        const invalidNotif = new Notification({
            userType: "SuperUser",
            message: "Test notification message"
        });

        await expect(invalidNotif.validate()).rejects.toThrow();

        // Valid notification
        const validNotif = new Notification({
            userType: "User",
            message: "Report status updated"
        });

        const validationError = validNotif.validateSync();
        expect(validationError).toBeUndefined();
        expect(validNotif.isRead).toBe(false);
    });
});
