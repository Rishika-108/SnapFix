import bcrypt from "bcrypt";

describe("Password hashing", () => {
    test("UT-AUTH-02: should compare passwords correctly", async () => {
        const password = "secret123";

        const hashedPassword = await bcrypt.hash(
            password,
            8
        );

        expect(
            await bcrypt.compare(
                password,
                hashedPassword
            )
        ).toBe(true);

        expect(
            await bcrypt.compare(
                "wrongpassword",
                hashedPassword
            )
        ).toBe(false);
    });
});