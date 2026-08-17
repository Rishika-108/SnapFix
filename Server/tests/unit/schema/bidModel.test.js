import Bid from "../../../models/bidModel.js";

describe("Bid schema", () => {
    test("UT-SCH-02: bidAmount cannot be negative", async () => {
        const bid = new Bid({
            bidAmount: -50
        });

        try {
            await bid.validate();
        } catch (error) {
            expect(error.errors.bidAmount).toBeDefined();

            expect(
                error.errors.bidAmount.kind
            ).toBe("min");

            return;
        }

        throw new Error("Validation should have failed.");
    });
});