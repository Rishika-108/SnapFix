import React, { useEffect, useRef } from "react";
import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { FaMapMarkerAlt, FaFire } from "react-icons/fa";


import { fetchReportsForHeatmap } from "../DB/report";
// select("location, status, upvotes, title, description, image");
// { id: 1, title: "Pothole on MG Road", description: "Large pothole causing traffic issues.", category: "road", location: "Pune", lat: 18.5204, lng: 73.8567, status: "in-progress", citizenId: 1, assignedWorkerId: 1, createdAt: "2025-10-01", updatedAt: "2025-10-03" },

const AdminHeatmap = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (!mapRef.current) return;

    const initMap = () => {
      const map = L.map(mapRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
        dragging: true,
        doubleClickZoom: true,
        zoomSnap: 0.5,
      }).setView([22.7196, 75.8577], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(map);

      const loadReports = async () => {
        try {
          const reports = await fetchReportsForHeatmap();
          console.log("✅ Heatmap Reports:", reports);

          if (!Array.isArray(reports) || reports.length === 0) {
            console.warn("⚠️ No reports found in database");
            return;
          }

          // ✅ Heatmap Gradient
          const gradient = { 0.2: "blue", 0.6: "orange", 0.9: "red" };

          // ✅ Prepare heatmap data (lat/lng format)
          const heatData = reports.map((r) => [
            r.lat,
            r.lng,
            Math.pow((r.votes || 1) / 100, 1.5),
          ]);

          // ✅ Add Heatmap Layer
          if (heatData.length > 0) {
            const heatLayer = L.heatLayer(heatData, {
              radius: 30,
              blur: 25,
              maxZoom: 17,
              minOpacity: 0.5,
              gradient,
            });
            heatLayer.addTo(map);
          }

          // ✅ React Icon markers
          const pinpointIcon = L.divIcon({
            html: ReactDOMServer.renderToString(
              <FaMapMarkerAlt color="red" size={26} />
            ),
            className: "",
            iconAnchor: [13, 26],
          });

          const fireIcon = L.divIcon({
            html: ReactDOMServer.renderToString(
              <FaFire color="orange" size={28} />
            ),
            className: "",
            iconAnchor: [14, 28],
          });


// to be update to admin location

          // ✅ Automatically focus map on the first issue
          if (reports.length > 0) {
            map.setView([reports[0].lat, reports[0].lng], 15);
          }

          // ✅ Add markers
          reports.forEach((r) => {
            if (!r.lat || !r.lng) return;

            const marker = L.marker([r.lat, r.lng], {
              icon: (r.votes || 0) >= 275 ? fireIcon : pinpointIcon,
            }).addTo(map);

            marker.bindTooltip(`${r.title || "Issue"} • ${r.area || "Unknown"}`, {
              direction: "top",
            });

            marker.on("click", () => openIssueCard(r));
          });

          // ✅ Overlay and modal logic (unchanged)
          const overlay = document.getElementById("overlay");
          const issueCard = document.getElementById("issueCard");
          const areaModal = document.getElementById("areaModal");


// Issue card to be integrated with the Card Module

          function openIssueCard(issue) {
            issueCard.innerHTML = `
              <img src="${issue.image || ""}" alt="Issue Image" class="w-full h-40 object-cover rounded-lg mb-2"/>
              <h3 class="text-lg font-semibold text-gray-800">${issue.title || "No title"}</h3>
              <p class="text-sm text-gray-600 mt-1"><strong>Area:</strong> ${issue.area || "Unknown"}</p>
              <p class="text-sm text-gray-600"><strong>Votes:</strong> ${issue.votes || 0}</p>
              <p class="text-sm text-gray-700 mt-2">${issue.description || "No description available."}</p>
            `;
            issueCard.style.display = "block";
            overlay.style.display = "block";
            areaModal.style.display = "none";
          }

// ✅ Nearby issue modal
          map.on("click", function (e) {
            const { lat, lng } = e.latlng;
            const nearby = reports.filter((r) => {
              const d = Math.sqrt((r.lat - lat) ** 2 + (r.lng - lng) ** 2);
              return d < 0.015;
            });

            if (nearby.length === 0) return;

            areaModal.innerHTML = `
              <h4 class="text-base font-semibold mb-2">Nearby Issues (${nearby.length})</h4>
              <ul class="max-h-52 overflow-y-auto space-y-1">
                ${nearby
                  .map(
                    (r) =>
                      `<li class="text-sm bg-gray-100 rounded-md px-2 py-1">${r.title || "Issue"} • ${
                        r.area || "Unknown"
                      } (${r.votes || 0} votes)</li>`
                  )
                  .join("")}
              </ul>
            `;
            areaModal.style.display = "block";
            overlay.style.display = "block";
            issueCard.style.display = "none";
          });

          overlay.addEventListener("click", () => {
            overlay.style.display = "none";
            issueCard.style.display = "none";
            areaModal.style.display = "none";
          });
        } catch (error) {
          console.error("❌ Error fetching reports:", error);
        }
      };

      loadReports();

      return () => map.remove();
    };

    const timer = setTimeout(initMap, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-[60vh] w-full rounded-lg overflow-hidden shadow-md">
      <div ref={mapRef} id="map" className="h-full w-full cursor-grab" />

      {/* Issue Card */}
      <div
        id="issueCard"
        className="hidden fixed bottom-20 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-lg rounded-xl p-4 w-80 shadow-xl z-[1001] animate-fadeIn"
      ></div>

      {/* Area Modal */}
      <div
        id="areaModal"
        className="hidden fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-lg p-4 rounded-xl shadow-lg w-72 z-[1002] animate-fadeIn"
      ></div>

      {/* Overlay */}
      <div id="overlay" className="hidden fixed inset-0 bg-black/30 z-[1000]" />

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease;
        }
      `}</style>
    </div>
  );
};

export default AdminHeatmap;
