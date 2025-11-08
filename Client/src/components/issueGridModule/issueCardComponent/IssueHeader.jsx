import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const IssueHeader = ({ title, date, expanded, setExpanded }) => {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-800 bg-[#181818] flex-wrap gap-1">
      <div className="truncate max-w-[75%] sm:max-w-none">
        <h2 className="text-white font-semibold text-sm sm:text-base">{title}</h2>
        <p className="text-gray-500 text-xs">{date}</p>
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-gray-400 hover:text-white transition-colors"
      >
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
    </div>
  );
};

export default IssueHeader;
