import Payment from "../../../models/paymentModel.js";

describe("Payment schema (UT-SCH-06)", () => {
    test("UT-SCH-06: Payment Schema Non-Negative Amount & Defaults", async () => {
        // Negative amount should fail validation
        const invalidPayment = new Payment({
            amount: -100
        });

        await expect(invalidPayment.validate()).rejects.toThrow();

        // Valid payment schema defaults
        const validPayment = new Payment({
            amount: 250,
            transactionId: "TXN-12345"
        });

        const validationError = validPayment.validateSync();
        expect(validationError).toBeUndefined();
        expect(validPayment.status).toBe("Pending");
        expect(validPayment.amount).toBe(250);
    });
});
