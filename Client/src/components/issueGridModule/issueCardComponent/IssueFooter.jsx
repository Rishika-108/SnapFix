import { useState } from "react";
import { Heart, ExternalLink } from "lucide-react";
import { CitizenAPI } from "../../../api/api"; // ✅ Integration with API.js

const IssueFooter = ({ report, user }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(report.upvotes || 0);
  const googleMapsLink = report.mapPreview;

  // ✅ Handle Like/Unlike using CitizenAPI
  const handleLike = async () => {
    try {
 
      // Toggle like visually first (optimistic update)
      setLiked(!liked);
      setLikes((prev) => (liked ? prev - 1 : prev + 1));

      // ✅ Call backend or dummy API to register upvote
      const response = await CitizenAPI.upvoteReport(report._id);
      const { data } = response;

      if (!data.success) {
        throw new Error(data.message);
      }

      // Optionally log for debugging
      console.log("✅ Upvote Response:", data.message);
    } catch (err) {
      console.error("❌ Error upvoting:", err.message);
      alert(err.message || "Something went wrong while upvoting.");
      // Rollback UI if API fails
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  return (
    <div className="flex justify-between items-center pt-2 text-sm sm:text-base">
      {/* ❤️ Like Button */}
      <button
        onClick={handleLike}
        className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-all"
      >
        <Heart
          size={22}
          className={`transition-transform ${
            liked ? "fill-pink-500 text-pink-500 scale-110" : "scale-100"
          }`}
        />
        <span>{likes}</span>
      </button>

      {/* 💼 (Future Bid Section Placeholder) */}
      {/* <BidSection report={report} user={user} /> */}

      {/* 🌍 Google Maps Link */}
      {googleMapsLink && (
        <a
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300 flex items-center gap-1"
        >
          <ExternalLink size={14} />
          <span className="hidden sm:inline">View in Maps</span>
        </a>
      )}
    </div>
  );
};
 
export default IssueFooter;
