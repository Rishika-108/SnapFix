import { calculateCosineSimilarity } from '../../../controllers/ReportController.js';

describe('calculateCosineSimilarity', () => {
    it('should return 1.0 for identical vectors', () => {
        const vec1 = [0.6, 0.8];
        const vec2 = [0.6, 0.8];
        expect(calculateCosineSimilarity(vec1, vec2)).toBe(1.0);
    });
    it('should return 0.0 for orthogonal vectors', () => {
        const vec1 = [1.0, 0.0];
        const vec2 = [0.0, 1.0];
        expect(calculateCosineSimilarity(vec1, vec2)).toBe(0.0);
    });
    it('should return 0.0 for mismatched dimensions', () => {
        const vec1 = [0.5, 0.5];
        const vec2 = [0.5, 0.5, 0.5];
        expect(calculateCosineSimilarity(vec1, vec2)).toBe(0.0);
    });
    it('should return 0.0 for null/empty vectors', () => {
        const vec1 = null;
        const vec2 = [];
        expect(calculateCosineSimilarity(vec1, vec2)).toBe(0.0);
    });
});