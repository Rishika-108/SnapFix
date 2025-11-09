import React, { useEffect, useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { FaMapMarkerAlt, FaFire } from "react-icons/fa";
import { api } from "../../api/api";
import IssueCard from "../issueGridModule/issueCardComponent/IssueCard";

const Heatmap = () => {
  const mapRef = useRef(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [reports, setReports] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [nearbyIssues, setNearbyIssues] = useState([]);
  const [filter, setFilter] = useState("Today");

  // ✅ Initialize Leaflet map
  useEffect(() => {
    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true,
      zoomSnap: 0.5,
    }).setView([22.7196, 75.8577], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    setMapInstance(map);
    setTimeout(() => map.invalidateSize(), 300);

    return () => map.remove();
  }, []);

  // ✅ Load reports and render heatmap
  useEffect(() => {
    if (!mapInstance) return;

    const loadReports = async () => {
      try {
        const data = await api.getHeatmapReports(filter);
        setReports(data);

        if (!Array.isArray(data) || data.length === 0) return;

        // Clear layers except base map
        mapInstance.eachLayer((layer) => {
          if (!layer._url) mapInstance.removeLayer(layer);
        });

        // 🟠 Add heat layer
        const heatData = data.map((r) => [
          r.lat,
          r.lng,
          Math.pow((r.votes || 1) / 100, 1.5),
        ]);
        L.heatLayer(heatData, {
          radius: 25,
          blur: 20,
          gradient: { 0.3: "#1e90ff", 0.6: "#ffa500", 0.9: "#ff4500" },
          maxZoom: 16,
        }).addTo(mapInstance);

        // 📍 Add pinpoint circle markers for each report
        data.forEach((r) => {
          if (!r.lat || !r.lng) return;
          const intensity = (r.votes || 0) / 500;
          const color =
            intensity > 0.5 ? "#FF4500" : intensity > 0.2 ? "#FFA500" : "#1E90FF";

          const circle = L.circleMarker([r.lat, r.lng], {
            radius: 6 + (intensity * 10),
            color,
            fillColor: color,
            fillOpacity: 0.8,
            weight: 1,
          }).addTo(mapInstance);

          circle.bindTooltip(`${r.title} (${r.votes || 0} votes)`, {
            direction: "top",
            offset: [0, -10],
          });

          circle.on("click", () => setSelectedIssue(r));
        });

        // 🧭 Click map to show nearby issues
        mapInstance.on("click", (e) => {
          const { lat, lng } = e.latlng;
          const nearby = data.filter((r) => {
            const d = Math.sqrt((r.lat - lat) ** 2 + (r.lng - lng) ** 2);
            return d < 0.015;
          });
          if (nearby.length > 0) setNearbyIssues(nearby);
        });
      } catch (err) {
        console.error("❌ Heatmap Load Error:", err);
      }
    };

    loadReports();
  }, [mapInstance, filter]);

  return (
    <div className="relative bg-[#0E2439]/80 backdrop-blur-md rounded-xl shadow-lg border border-white/10 overflow-hidden h-[60vh] flex flex-col">
      {/* ===== Header ===== */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 z-30">
        <h2 className="text-gray-100 text-lg font-semibold tracking-wide">
          Issue Density Overview
        </h2>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="bg-[#142E4D] text-gray-300 text-sm px-3 py-1.5 rounded-md border border-white/10 outline-none cursor-pointer hover:border-blue-400 transition"
        >
          <option>Today</option>
          <option>Yesterday</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      {/* ===== Map Container ===== */}
      <div ref={mapRef} className="flex-1 w-full h-full relative z-10 rounded-b-xl overflow-hidden" />

      {/* ===== Legend ===== */}
      <div className="absolute bottom-4 left-4 bg-[#142E4D]/90 text-gray-300 text-xs px-3 py-2 rounded-md border border-white/10 z-20">
        <p className="font-semibold text-sm mb-1">Heat Intensity</p>
        <div className="flex gap-2 items-center">
          <span className="block w-4 h-2 bg-blue-500 rounded-sm"></span>
          <span className="block w-4 h-2 bg-orange-400 rounded-sm"></span>
          <span className="block w-4 h-2 bg-red-500 rounded-sm"></span>
        </div>
      </div>

      {/* ===== Selected Issue Modal ===== */}
      {selectedIssue && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40 animate-fadeIn p-4"
          onClick={() => setSelectedIssue(null)}
        >
          <div
            className="w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto max-h-[90%]"
            onClick={(e) => e.stopPropagation()}
          >
            <IssueCard report={selectedIssue} />
          </div>
        </div>
      )}

      {/* ===== Nearby Issues Modal (with IssueCards) ===== */}
      {nearbyIssues.length > 0 && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40 animate-fadeIn p-4"
          onClick={() => setNearbyIssues([])}
        >
          <div
            className="bg-[#0E2439]/95 text-gray-200 rounded-xl p-4 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[85%]"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">
              Nearby Issues ({nearbyIssues.length})
            </h4>
            <div className="space-y-4">
              {nearbyIssues.map((r) => (
                <IssueCard key={r.id} report={r} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===== Styles ===== */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease; }

        /* Ensure map layers stay below modals */
        .leaflet-container { z-index: 10 !important; }
        .leaflet-top, .leaflet-bottom { z-index: 10 !important; }
        .leaflet-marker-pane, .leaflet-tooltip-pane { z-index: 15 !important; }
      `}</style>
    </div>
  );
};

export default Heatmap;
