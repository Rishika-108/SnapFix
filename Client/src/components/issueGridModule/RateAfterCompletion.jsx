import React, { useState } from "react";
import { toast } from "react-hot-toast";

const RateAfterCompletion = ({ issueImage, resolvedImage, onVerify }) => {
  const [verified, setVerified] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");

  const handleSubmitReview = () => {
    if (verified === null) {
      toast.error("Please verify the task first");
      return;
    }

    onVerify?.(verified, rating, review);
  };

  return (
    <div className="w-full">
      {/* Title */}
      <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Verify & Rate Completed Issue
      </h2>

      {/* Images */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 mb-2">
            Reported Issue
          </p>
          <img
            src={issueImage}
            alt="Reported Issue"
            className="w-full h-40 object-cover rounded-lg border"
          />
        </div>

        <div className="text-center">
          <p className="text-sm font-medium text-gray-600 mb-2">
            Resolved Issue
          </p>
          <img
            src={resolvedImage}
            alt="Resolved Issue"
            className="w-full h-40 object-cover rounded-lg border"
          />
        </div>
      </div>

      {/* Verification */}
      <div className="text-center mb-6">
        <p className="font-medium text-gray-700 mb-3">
          Has this issue been resolved?
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setVerified(true)}
            className={`px-5 py-2 rounded-lg border transition ${
              verified === true
                ? "bg-green-500 text-white border-green-500"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Yes
          </button>

          <button
            onClick={() => setVerified(false)}
            className={`px-5 py-2 rounded-lg border transition ${
              verified === false
                ? "bg-red-500 text-white border-red-500"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            No
          </button>
        </div>
      </div>

      {/* Rating & Review */}
      {verified !== null && (
        <div className="space-y-4">
          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rate the resolution quality
            </label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={0}>Select rating</option>
              <option value={1}>⭐ 1</option>
              <option value={2}>⭐⭐ 2</option>
              <option value={3}>⭐⭐⭐ 3</option>
              <option value={4}>⭐⭐⭐⭐ 4</option>
              <option value={5}>⭐⭐⭐⭐⭐ 5</option>
            </select>
          </div>

          {/* Review */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Optional Review
            </label>
            <textarea
              rows={3}
              placeholder="Write your feedback..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmitReview}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg transition"
          >
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
};

export default RateAfterCompletion;

