import jwt from "jsonwebtoken";

describe("JWT utilities", () => {
    beforeAll(() => {
        process.env.JWT_SECRET = "test-secret";
    });

    test("UT-AUTH-01: should sign and verify a JWT token", () => {
        const payload = {
            id: "123",
            role: "citizen"
        };

        const token = jwt.sign(
            payload,
            process.env.JWT_SECRET
        );

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        expect(decoded.id).toBe("123");

        expect(decoded.role).toBe("citizen");
    });
});