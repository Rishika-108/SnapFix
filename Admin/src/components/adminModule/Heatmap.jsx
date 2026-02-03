import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import IssueCard from "../issueGridModule/issueCardComponent/IssueCard";

const Heatmap = ({ reports: allReports = [] }) => {
  const mapRef = useRef(null);
  const mapRefInstance = useRef(null);
  const heatLayerRef = useRef(null);
  const markerLayerRef = useRef(L.layerGroup());

  const [selectedIssue, setSelectedIssue] = useState(null);
  const [nearbyIssues, setNearbyIssues] = useState([]);
  const [filter, setFilter] = useState("All");

  // ===== Initialize Map =====
  useEffect(() => {
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
    }).setView([22.8209779, 75.9428545], 12);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    markerLayerRef.current.addTo(map);
    mapRefInstance.current = map;

    setTimeout(() => map.invalidateSize(), 300);
    return () => map.remove();
  }, []);

  // ===== Render Heatmap =====
  useEffect(() => {
    const map = mapRefInstance.current;
    if (!map || !allReports.length) return;

    heatLayerRef.current?.remove();
    markerLayerRef.current.clearLayers();

    const validReports = allReports.filter(
      (r) => typeof r.lat === "number" && typeof r.lng === "number"
    );

    if (!validReports.length) return;

    // ✅ TRUE heatmap intensity (VISIBLE)
    const heatData = validReports.map((r) => [
      r.lat,
      r.lng,
      Math.max(0.5, (r.votes || 1) * 0.3),
    ]);

    heatLayerRef.current = L.heatLayer(heatData, {
      radius: 40,
      blur: 30,
      maxZoom: 17,
      gradient: {
        0.2: "#1e90ff",
        0.5: "#ffa500",
        0.8: "#ff4500",
      },
    }).addTo(map);

    // 📍 Markers (still required for interaction)
    validReports.forEach((r) => {
      const circle = L.circleMarker([r.lat, r.lng], {
        radius: 7,
        color: "#fff",
        fillColor: "#1e90ff",
        fillOpacity: 0.9,
        weight: 1,
      });

      circle.bindTooltip(`${r.title} (${r.votes || 0} votes)`);
      circle.on("click", () => setSelectedIssue(r));
      markerLayerRef.current.addLayer(circle);
    });

    // 🧭 Nearby detection (fixed)
    map.off("click");
    map.on("click", (e) => {
      const nearby = validReports.filter(
        (r) => map.distance(e.latlng, [r.lat, r.lng]) < 2000
      );
      if (nearby.length) setNearbyIssues(nearby);
    });

    // ✅ Auto-fit to data
    const bounds = L.latLngBounds(validReports.map((r) => [r.lat, r.lng]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [allReports, filter]);

  return (
    <div className="relative bg-[#0E2439]/80 backdrop-blur-md rounded-xl border border-white/10 h-[60vh] flex flex-col">
      {/* Header */}
      <div className="flex justify-between px-5 py-3 border-b border-white/10">
        <h2 className="text-gray-100 font-semibold">Issue Density Overview</h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#142E4D] text-gray-300 px-3 py-1.5 rounded-md border border-white/10"
        >
          <option>All</option>
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      <div ref={mapRef} className="flex-1 w-full" />

      {/* Selected Issue */}
      {selectedIssue && (
        <div
          className="absolute inset-0 bg-black/60 flex items-center justify-center z-40"
          onClick={() => setSelectedIssue(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <IssueCard report={selectedIssue} />
          </div>
        </div>
      )}

      {/* Nearby Issues */}
      {nearbyIssues.length > 0 && (
        <div
          className="absolute inset-0 bg-black/60 flex items-center justify-center z-40"
          onClick={() => setNearbyIssues([])}
        >
          <div className="bg-[#0E2439] p-4 rounded-xl max-w-2xl w-full">
            <h4 className="mb-3 font-semibold">
              Nearby Issues ({nearbyIssues.length})
            </h4>
            {nearbyIssues.map((r) => (
              <IssueCard key={r.id} report={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Heatmap;
