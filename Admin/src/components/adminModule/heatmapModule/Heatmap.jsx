import React, { useRef, useState } from "react";
import HeatmapHeader from "./HeatmapHeader";
import HeatmapMapView from "./HeatmapMapView";
import HeatmapLegend from "./HeatmapLegend";
import SelectedIssueModal from "./SelectedIssueModal";
import NearbyIssuesModal from "./NearbyIssuesModal";

const Heatmap = () => {
  const mapRef = useRef(null);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [nearbyIssues, setNearbyIssues] = useState([]);

  // 🟢 Default filter corresponds to report status
  const [filter, setFilter] = useState("all");

  return (
    <div className="relative bg-[#0E2439]/80 backdrop-blur-md rounded-xl shadow-lg border border-white/10 overflow-hidden h-[60vh] flex flex-col">
      {/* 🔹 Header manages status filter selection */}
      <HeatmapHeader filter={filter} setFilter={setFilter} />

      {/* 🔥 Pass status filter + handlers into the map view */}
      <HeatmapMapView
        mapRef={mapRef}
        setSelectedIssue={setSelectedIssue}
        setNearbyIssues={setNearbyIssues}
        filter={filter.toLowerCase()} // ensure consistency with handleReports.js
      />

      {/* 🧭 Legend for map intensity */}
      <HeatmapLegend />

      {/* 🪧 Modal: When user clicks a pin */}
      {selectedIssue && (
        <SelectedIssueModal
          issue={selectedIssue}
          onClose={() => setSelectedIssue(null)}
        />
      )}

      {/* 📍 Modal: When nearby issues are found */}
      {nearbyIssues.length > 0 && (
        <NearbyIssuesModal
          nearbyIssues={nearbyIssues}
          onClose={() => setNearbyIssues([])}
        />
      )}
    </div>
  );
};

export default Heatmap;
