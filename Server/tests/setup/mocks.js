import { jest } from "@jest/globals";
import { Writable } from "stream";

export const mockAI = axios => {
    axios.post.mockResolvedValue({
        data: {
            is_valid: true,
            confidence: 0.95,
            embedding: Array(512).fill(0.1)
        }
    });
};

export const mockCloudinary = cloudinary => {
    cloudinary.uploader.upload_stream = jest.fn(
        (options, callback) => {
            const writable = new Writable({
                write(chunk, encoding, next) {
                    next();
                }
            });

            process.nextTick(() => {
                callback(null, {
                    secure_url:
                        "https://res.cloudinary.com/test.jpg"
                });
            });

            return writable;
        }
    );
};