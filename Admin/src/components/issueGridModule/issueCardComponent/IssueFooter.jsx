import { useState } from "react";
import { Heart, ExternalLink } from "lucide-react";
// import { CitizenAPI } from "../../../api/api"; // ✅ Integration with API.js
import BidSection from "../../biddingModule/BidSection";

const IssueFooter = ({ report, user }) => {
  console.log("📦 IssueFooter:", { report, user });
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(report.upvotes || 0);

  // ✅ Handle Like/Unlike using CitizenAPI
  const handleLike = async () => {
    try {
      if (!user) {
        alert("Please log in to upvote reports.");
        return;
      }

      // Optimistic update
      setLiked(!liked);
      setLikes((prev) => (liked ? prev - 1 : prev + 1));

      // Backend update
      const response = await CitizenAPI.upvoteReport(report._id);
      const { data } = response;

      if (!data.success) {
        throw new Error(data.message);
      }

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
    <div
      className="flex justify-between items-center mt-3 pt-3 border-t border-white/10 
                 text-sm sm:text-base text-gray-300"
    >
      {/* ❤️ Like Button */}
      <button
        onClick={handleLike}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-200 
                    ${
                      liked
                        ? "text-pink-400 bg-pink-500/10 hover:bg-pink-500/20"
                        : "text-gray-400 hover:text-pink-400 hover:bg-white/5"
                    }`}
      >
        <Heart
          size={20}
          className={`transition-transform ${
            liked
              ? "fill-pink-500 text-pink-400 scale-110"
              : "text-gray-400 scale-100"
          }`}
        />
        <span className="font-medium">{likes}</span>
      </button>

      {/* Bid Section */}
      <div className="flex items-center">
        <BidSection
  report={{ _id: report._id, title: report.title, bids: report.bids }}
  user={user || { role: "government" }}
  token={"demo-token-123"}
/>


      </div>
    </div>
  );
};

export default IssueFooter;
