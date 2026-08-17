import Report from "../../../models/reportModel.js";

describe("Report schema", () => {
    test("UT-SCH-01", async () => {
        const report = new Report({
            title: "Test",
            description: "Test description",
            category: "Road",
            imageUrl: "test.jpg",
            location: {
                type: "Point",
                coordinates: [181, 91]
            }
        });

        await expect(
            report.validate()
        ).rejects.toThrow();
    });
});