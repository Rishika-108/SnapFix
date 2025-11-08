import React from "react";

const IssueStatusBadge = ({ status }) => {
  const statusColors = {
    Pending: "bg-yellow-500",
    "In Progress": "bg-blue-500",
    Resolved: "bg-green-500",
  };

  return (
    <span
      className={`absolute top-3 right-3 text-xs px-3 py-1 rounded-full text-white font-semibold ${
        statusColors[status] || "bg-gray-500"
      }`}
    >
      {status}
    </span>
  );
};

export default IssueStatusBadge;
