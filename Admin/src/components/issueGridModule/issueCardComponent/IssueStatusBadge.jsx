import React from "react";

const IssueStatusBadge = ({ status }) => {
  const statusStyles = {
    Pending: {
      bg: "from-yellow-400/80 to-amber-500/90 text-amber-100 shadow-[0_0_10px_rgba(255,200,50,0.25)]",
    },
    "In Progress": {
      bg: "from-[#3EA8FF]/80 to-[#2B7AC7]/90 text-blue-100 shadow-[0_0_10px_rgba(62,168,255,0.25)]",
    },
    Resolved: {
      bg: "from-emerald-400/80 to-teal-500/90 text-emerald-100 shadow-[0_0_10px_rgba(52,211,153,0.25)]",
    },
    Default: {
      bg: "from-gray-500/70 to-gray-600/80 text-gray-100 shadow-[0_0_8px_rgba(255,255,255,0.1)]",
    },
  };

  const { bg } = statusStyles[status] || statusStyles.Default;

  return (
    <span
      className={`
        text-[0.7rem] sm:text-xs 
        font-medium tracking-wide
        px-3 py-1.5 
        rounded-full
        bg-linear-to-r ${bg}
        backdrop-blur-md
        border border-white/10
        transition-all duration-300
        shadow-md
      `}
    >
      {status}
    </span>
  );
};

export default IssueStatusBadge;
