import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const IssueHeader = ({ title, date, expanded, setExpanded }) => {
  return (
    <div
      className="
        flex justify-between items-center flex-wrap gap-1
        px-5 py-3
        bg-[#0E2439]/80 
        backdrop-blur-lg
        border-b border-white/10 
        rounded-t-2xl
        transition-all duration-300
      "
    >
      {/* Title + Date */}
      <div className="truncate max-w-[80%] sm:max-w-none">
        <h2
          className="
            text-gray-100 font-semibold 
            text-sm sm:text-base 
            tracking-tight leading-snug
          "
        >
          {title}
        </h2>
        <p className="text-gray-400 text-xs mt-0.5">{date}</p>
      </div>

      {/* Expand Button (if used later) */}
      <button
        onClick={() => setExpanded && setExpanded(!expanded)}
        className="
          hidden sm:flex items-center justify-center
          text-gray-400 hover:text-[#3EA8FF]
          transition-all duration-200
          rounded-md p-1.5
          hover:bg-white/5
        "
      >
        {expanded ? (
          <ChevronUp size={18} className="transition-transform" />
        ) : (
          <ChevronDown size={18} className="transition-transform" />
        )}
      </button>
    </div>
  );
};

export default IssueHeader;
