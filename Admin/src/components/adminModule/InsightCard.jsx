import React, { useState } from "react";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

const InsightCard = ({
  title = "Issues Reported",
  value = 2318,
  change = 6.08,
  filterOptions = ["Today", "Yesterday", "This Week", "This Month"],
}) => {
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0]);
  const isPositive = change >= 0;

  return (
    <div
      className={`relative overflow-hidden group
                  bg-[#0E2439]/80 backdrop-blur-xl
                  border border-white/10 
                  rounded-2xl 
                  shadow-[0_0_15px_rgba(0,0,0,0.25)]
                  hover:shadow-[0_0_20px_rgba(62,168,255,0.25)]
                  hover:border-[#3EA8FF]/50
                  hover:scale-[1.02]
                  transition-all duration-300 ease-out
                  p-5 w-full max-w-sm`}
    >
      {/* Subtle glow pattern */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(62,168,255,0.05), transparent 70%)",
        }}
      ></div>

      {/* Header + Filter */}
      <div className="relative flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-300 tracking-wide">
          {title}
        </h2>

        {/* Future Filter Toggle (Kept commented for now) */}
        {/* 
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="text-xs font-medium px-2 py-1 bg-[#142E4D]/60 text-gray-200 
                     border border-white/10 rounded-md focus:outline-none 
                     focus:ring-1 focus:ring-[#3EA8FF]/60 cursor-pointer"
        >
          {filterOptions.map((option) => (
            <option key={option} className="bg-[#0E2439] text-gray-200">
              {option}
            </option>
          ))}
        </select> 
        */}
      </div>

      {/* Main Value */}
      <div className="relative flex items-end justify-between mt-1">
        <p className="text-4xl font-semibold text-gray-100 tracking-tight">
          {value.toLocaleString()}
        </p>

        {/* Change Indicator */}
        <div
          className={`flex items-center text-sm font-semibold ${
            isPositive ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {isPositive ? (
            <FiArrowUpRight className="w-4 h-4 mr-1" />
          ) : (
            <FiArrowDownRight className="w-4 h-4 mr-1" />
          )}
          {Math.abs(change).toFixed(2)}%
        </div>
      </div>

      {/* Divider Line */}
      <div className="mt-3 mb-2 border-t border-white/10"></div>

      {/* Animated Progress Indicator */}
      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/5 rounded-b-2xl overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ease-out ${
            isPositive
              ? `bg-linear-to-r from-[#3EA8FF] via-[#2AB4E6] to-emerald-400`
              : `bg-linear-to-r from-rose-400 via-rose-500 to-rose-600`
          }`}
          style={{
            width: `${Math.min(Math.abs(change) * 5, 100)}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default InsightCard;
