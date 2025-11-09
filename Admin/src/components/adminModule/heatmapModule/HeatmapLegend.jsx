// src/components/heatmapModule/HeatmapLegend.jsx
import React from "react";

const HeatmapLegend = () => (
  <div className="absolute bottom-4 left-4 bg-[#142E4D]/90 text-gray-300 text-xs px-3 py-2 rounded-md border border-white/10 z-20">
    <p className="font-semibold text-sm mb-1">Heat Intensity</p>
    <div className="flex gap-2 items-center">
      <span className="block w-4 h-2 bg-blue-500 rounded-sm"></span>
      <span className="block w-4 h-2 bg-orange-400 rounded-sm"></span>
      <span className="block w-4 h-2 bg-red-500 rounded-sm"></span>
    </div>
  </div>
);

export default HeatmapLegend;
