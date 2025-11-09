import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const IssueHeader = ({ title, date, expanded, setExpanded }) => {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-300 via-purple-400 to-pink-500 flex-wrap gap-1 rounded-t-2xl">
      <div className="truncate max-w-[75%] sm:max-w-none">
        <h2 className="text-gray-900 font-semibold text-sm sm:text-white">
          {title}
        </h2>
        <p className="text-gray-1000 text-xs">{date}</p>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-white hover:text-gray-800 transition-colors"
      >
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
    </div>
  );
};

export default IssueHeader;
