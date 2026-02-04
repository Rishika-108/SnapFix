import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const statusColors = {
  Pending: "bg-yellow-400",
  Resolved: "bg-green-500",
  Urgent: "bg-red-500",
};

const IssueHeader = ({ title, date, expanded, setExpanded, status = "Pending" }) => {
  return (
    <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-blue-50 rounded-t-2xl">
      
      {/* Left side: status + title + date */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        {/* Status Dot */}
        <span
          className={`inline-block w-2 h-2 rounded-full flex-shrink-0 ${statusColors[status]}`}
          title={status}
        />
        
        {/* Title + Date */}
        <div className="flex flex-col min-w-0">
          <h2 className="text-gray-900 font-semibold text-sm sm:text-base truncate">
            {title}
          </h2>
          <p className="text-gray-500 text-xs truncate">{date}</p>
        </div>
      </div>

      {/* Right side: expand/collapse button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="ml-3 text-gray-500 hover:text-gray-700 transition-colors flex-shrink-0"
        aria-label={expanded ? "Collapse details" : "Expand details"}
      >
        {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>
    </div>
  );
};

export default IssueHeader;
