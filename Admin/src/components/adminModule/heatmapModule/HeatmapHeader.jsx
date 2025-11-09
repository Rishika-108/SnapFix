import React from "react";

const HeatmapHeader = ({ filter, setFilter }) => (
  <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 z-30 bg-[#0E2439]/90 backdrop-blur-sm">
    <h2 className="text-gray-100 text-lg font-semibold tracking-wide">
      Issue Density Overview
    </h2>

    {/* 🔽 Updated: Status filter dropdown (fully synced with handleReports.js) */}
    <select
      value={filter.toLowerCase()}
      onChange={(e) => setFilter(e.target.value.toLowerCase())}
      className="bg-[#142E4D] text-gray-300 text-sm px-3 py-1.5 rounded-md border border-white/10 outline-none cursor-pointer hover:border-blue-400 transition"
    >
      <option value="all">All</option>
      <option value="pending">Pending</option>
      <option value="inprogress">In Progress</option>
      <option value="resolved">Resolved</option>
    </select>
  </div>
);

export default HeatmapHeader;
