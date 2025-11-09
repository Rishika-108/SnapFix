import { useState } from "react";
import { Heart, ExternalLink } from "lucide-react";
import { CitizenAPI } from "../../../api/api";

const IssueFooter = ({ report, user }) => {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(report.upvotes || 0);
  const googleMapsLink = report.mapPreview;

  const handleLike = async () => {
    try {
      setLiked(!liked);
      setLikes((prev) => (liked ? prev - 1 : prev + 1));

      const response = await CitizenAPI.upvoteReport(report._id);
      const { data } = response;

      if (!data.success) throw new Error(data.message);
      console.log("✅ Upvote Response:", data.message);
    } catch (err) {
      console.error("❌ Error upvoting:", err.message);
      alert(err.message || "Something went wrong while upvoting.");
      setLiked((prev) => !prev);
      setLikes((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  return (
    <div className="flex justify-between items-center pt-3 text-sm sm:text-base">
      {/* ❤️ Like Button */}
      <button
        onClick={handleLike}
        className="flex items-center gap-2 text-gray-600 hover:text-pink-500 transition-all"
      >
        <Heart
          size={22}
          className={`transition-transform ${
            liked
              ? "fill-pink-400 text-pink-500 scale-110 drop-shadow-md"
              : "scale-100 text-gray-400"
          }`}
        />
        <span className="text-gray-700 font-medium">{likes}</span>
      </button>

      {/* 🌍 Google Maps Link */}
      {googleMapsLink && (
        <a
          href={googleMapsLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-500 hover:text-purple-500 font-medium transition-all"
        >
          <ExternalLink size={15} />
          <span className="hidden sm:inline">View in Maps</span>
        </a>
      )}
    </div>
  );
};

export default IssueFooter;
