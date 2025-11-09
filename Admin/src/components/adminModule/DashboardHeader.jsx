import React, { useState } from "react";
import { FiCalendar, FiDownloadCloud } from "react-icons/fi";

const DashboardHeader = ({
  title = "Government Dashboard",
  subtitle = "Civic Issue Reporting Overview",
  showDateFilter = true,
  showExport = true,
}) => {
  const [selectedRange, setSelectedRange] = useState("Today");
  const dateRanges = ["Today", "This Week", "This Month", "This Year"];

  return (
    <div
      className="
        flex flex-col sm:flex-row items-start sm:items-center justify-between
        bg-[#0E2439]/90 backdrop-blur-xl
        border border-white/10 rounded-2xl shadow-[0_0_20px_rgba(62,168,255,0.15)]
        p-5 transition-all duration-300 hover:shadow-[0_0_25px_rgba(62,168,255,0.25)]
      "
    >
      {/* ===== Left Section: Title & Subtitle ===== */}
      <div>
        <h1 className="text-2xl font-semibold text-white tracking-tight drop-shadow-sm">
          {title}
        </h1>
        <p className="text-sm text-gray-300 mt-1">{subtitle}</p>
      </div>

      {/* ===== Right Section: Filters & Actions ===== */}
      <div className="flex items-center gap-3 mt-4 sm:mt-0">
        {/* Date Filter */}
        {showDateFilter && (
          <div className="relative">
            <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="
                appearance-none pl-9 pr-6 py-2
                text-sm font-medium text-gray-200 bg-[#132F4A]/80
                border border-white/10 rounded-md
                hover:bg-[#17385A]/90 focus:outline-none focus:ring-2 focus:ring-[#3EA8FF]/40
                transition-all duration-200 cursor-pointer
              "
            >
              {dateRanges.map((range) => (
                <option key={range} className="bg-[#0E2439] text-gray-100">
                  {range}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Export Button */}
        {showExport && (
          <button
            className="
              flex items-center gap-2 px-3 py-2 text-sm font-medium
              text-white bg-linear-to-r from-[#3EA8FF] to-[#2B7AC7]
              rounded-md border border-white/10 shadow-[0_0_10px_rgba(62,168,255,0.25)]
              hover:scale-[1.03] hover:shadow-[0_0_15px_rgba(62,168,255,0.4)]
              active:scale-[0.98] transition-all duration-200
            "
          >
            <FiDownloadCloud className="w-4 h-4" />
            Export Data
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardHeader;
