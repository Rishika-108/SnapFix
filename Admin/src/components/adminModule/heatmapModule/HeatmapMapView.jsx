import React, { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";
import { getReports } from "../../../api/handleReports"; // ✅ import from handleReports.js

const HeatmapMapView = ({ mapRef, setSelectedIssue, setNearbyIssues, filter }) => {
  const [mapInstance, setMapInstance] = useState(null);

  // 🗺️ Initialize Leaflet map once
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

  // 🔥 Load reports and render heatmap
  useEffect(() => {
    if (!mapInstance) return;

    const loadReports = async () => {
      try {
        // ✅ Fetch reports from handleReports.js instead of api
        const data = await getReports(filter);

        // 🧹 Clear all non-tile layers
        mapInstance.eachLayer((layer) => {
          if (!layer._url) mapInstance.removeLayer(layer);
        });

        if (!data?.length) return;

        // 🟢 Add heatmap layer
        const heatData = data
          .filter((r) => r.location?.coordinates)
          .map((r) => [
            r.location.coordinates[1], // latitude
            r.location.coordinates[0], // longitude
            Math.pow((r.upvotes || 1) / 100, 1.5),
          ]);

        L.heatLayer(heatData, {
          radius: 25,
          blur: 20,
          gradient: { 0.3: "#1e90ff", 0.6: "#ffa500", 0.9: "#ff4500" },
        }).addTo(mapInstance);

        // 📍 Add pin markers using React Icon
        data.forEach((r) => {
          const lat = r.location?.coordinates?.[1];
          const lng = r.location?.coordinates?.[0];
          if (!lat || !lng) return;

          const intensity = (r.upvotes || 0) / 500;
          const color =
            intensity > 0.5 ? "#FF4500" : intensity > 0.2 ? "#FFA500" : "#1E90FF";

          const iconHtml = ReactDOMServer.renderToString(
            <FaMapMarkerAlt
              style={{
                color,
                fontSize: `${18 + intensity * 10}px`,
                filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))",
              }}
            />
          );

          const icon = L.divIcon({
            html: iconHtml,
            className: "custom-map-icon",
            iconSize: [30, 30],
            iconAnchor: [15, 30],
          });

          const marker = L.marker([lat, lng], { icon }).addTo(mapInstance);

          marker.bindTooltip(`${r.title} (${r.upvotes || 0} votes)`);
          marker.on("click", () => setSelectedIssue(r));
        });

        // 🧭 Map click to find nearby issues
        mapInstance.on("click", (e) => {
          const { lat, lng } = e.latlng;
          const nearby = data.filter((r) => {
            const rLat = r.location?.coordinates?.[1];
            const rLng = r.location?.coordinates?.[0];
            return rLat && rLng && Math.sqrt((rLat - lat) ** 2 + (rLng - lng) ** 2) < 0.015;
          });
          if (nearby.length > 0) setNearbyIssues(nearby);
        });

        // 🎯 Focus map on nearest report (to user or default center)
        const focusOnNearestReport = (refLat, refLng) => {
          const validReports = data.filter((r) => r.location?.coordinates);
          if (!validReports.length) return;
          const nearest = validReports.reduce((prev, curr) => {
            const [currLng, currLat] = curr.location.coordinates;
            const [prevLng, prevLat] = prev.location.coordinates;
            const prevDist = Math.hypot(prevLat - refLat, prevLng - refLng);
            const currDist = Math.hypot(currLat - refLat, currLng - refLng);
            return currDist < prevDist ? curr : prev;
          });
          const [nearestLng, nearestLat] = nearest.location.coordinates;
          mapInstance.setView([nearestLat, nearestLng], 15, { animate: true });
        };

        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (pos) => focusOnNearestReport(pos.coords.latitude, pos.coords.longitude),
            () => focusOnNearestReport(22.7196, 75.8577),
            { enableHighAccuracy: true, timeout: 5000 }
          );
        } else {
          focusOnNearestReport(22.7196, 75.8577);
        }
      } catch (err) {
        console.error("❌ Heatmap load failed:", err);
      }
    };

    loadReports();
  }, [mapInstance, filter]);

  return (
    <div
      ref={mapRef}
      className="flex-1 w-full h-full relative z-10 rounded-b-xl overflow-hidden"
    />
  );
};

export default HeatmapMapView;
