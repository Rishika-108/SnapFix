import User from "../../../models/userModel.js";

describe("User schema (UT-SCH-04)", () => {
    test("UT-SCH-04: User Schema Required Fields & Defaults", async () => {
        // Missing required email and password should fail validation
        const invalidUser = new User({
            name: "John Citizen"
        });

        await expect(invalidUser.validate()).rejects.toThrow();

        // Valid user sets default role to citizen
        const validUser = new User({
            name: "John Citizen",
            email: "john@example.com",
            password: "hashedPassword123"
        });

        const validationError = validUser.validateSync();
        expect(validationError).toBeUndefined();
        expect(validUser.role).toBe("citizen");
    });
});
