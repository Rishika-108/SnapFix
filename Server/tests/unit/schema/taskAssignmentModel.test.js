import Task from "../../../models/taskAssignmentModel.js";

describe("Task Assignment schema", () => {
    test("UT-SCH-03: rating must not exceed 5", async () => {
        const task = new Task({
            rating: 6
        });

        try {
            await task.validate();
        } catch (error) {
            expect(error.errors.rating).toBeDefined();

            expect(
                error.errors.rating.kind
            ).toBe("max");

            return;
        }

        throw new Error("Validation should have failed.");
    });
});