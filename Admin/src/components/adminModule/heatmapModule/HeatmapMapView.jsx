import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { FaMapMarkerAlt } from "react-icons/fa";
import ReactDOMServer from "react-dom/server";

const DEFAULT_CENTER = [22.7196, 75.8577];

const HeatmapMapView = ({
  mapRef,
  setSelectedIssue,
  setNearbyIssues,
  filter,
  allReports = [],
}) => {
  const [mapInstance, setMapInstance] = useState(null);

  const heatLayerRef = useRef(null);
  const markerLayerRef = useRef(L.layerGroup());

  /* ===============================
     🗺️ MAP INIT
  ================================ */
  useEffect(() => {
    if (!mapRef.current) return;

    const map = L.map(mapRef.current, {
      zoomControl: true,
      scrollWheelZoom: true,
      dragging: true,
    }).setView(DEFAULT_CENTER, 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    markerLayerRef.current.addTo(map);
    setMapInstance(map);

    setTimeout(() => map.invalidateSize(), 300);

    return () => map.remove();
  }, []);

  /* ===============================
     🔥 HEATMAP + MARKERS
  ================================ */
  useEffect(() => {
    if (!mapInstance || !allReports.length) return;

    // cleanup
    if (heatLayerRef.current) {
      mapInstance.removeLayer(heatLayerRef.current);
      heatLayerRef.current = null;
    }
    markerLayerRef.current.clearLayers();

    /* ===============================
       🔥 HEATMAP (VISIBILITY FIX)
    ================================ */
    const heatData = allReports
      .filter(r => r?.location?.coordinates)
      .map(r => {
        const [lng, lat] = r.location.coordinates;
        const votes = r.upvotes ?? 0;

        // 🔑 Always visible intensity
        const intensity = Math.min(
          1,
          Math.max(
            0.35,                  // baseline glow
            Math.log(votes + 1) / 2 // logarithmic boost
          )
        );

        return [lat, lng, intensity];
      });

    heatLayerRef.current = L.heatLayer(heatData, {
      radius: 35,        // larger spread
      blur: 15,          // sharper glow
      minOpacity: 0.4,   // ALWAYS visible
      maxZoom: 17,
      gradient: {
        0.35: "#4da3ff",
        0.6: "#ffae42",
        1.0: "#ff3b3b",
      },
    }).addTo(mapInstance);

    /* ===============================
       📍 MARKERS
    ================================ */
    allReports.forEach((r, index) => {
      if (!r?.location?.coordinates) return;

      const [lng, lat] = r.location.coordinates;
      const votes = r.upvotes ?? 0;

      const size = 18 + Math.min(12, votes * 2);
      const color =
        votes >= 3 ? "#ff3b3b" :
        votes >= 1 ? "#ffae42" :
        "#4da3ff";

      const iconHtml = ReactDOMServer.renderToString(
        <FaMapMarkerAlt
          style={{
            color,
            fontSize: `${size}px`,
            filter: "drop-shadow(0 0 2px rgba(0,0,0,0.3))",
          }}
        />
      );

      const icon = L.divIcon({
        html: iconHtml,
        className: "custom-map-icon",
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
      });

      const marker = L.marker([lat, lng], { icon });

      marker.bindTooltip(
        `${r.title || "Issue"} (${votes} votes)`
      );

      marker.on("click", () => setSelectedIssue(r));
      markerLayerRef.current.addLayer(marker);
    });

    /* ===============================
       🧭 MAP CLICK → NEARBY
    ================================ */
    mapInstance.off("click");
    mapInstance.on("click", (e) => {
      const { lat, lng } = e.latlng;

      const nearby = allReports.filter((r) => {
        if (!r?.location?.coordinates) return false;
        const [rLng, rLat] = r.location.coordinates;
        return Math.hypot(rLat - lat, rLng - lng) < 0.015;
      });

      if (nearby.length) setNearbyIssues(nearby);
    });

  }, [mapInstance, allReports, filter]);

  return (
    <div
      ref={mapRef}
      className="flex-1 w-full h-full relative z-10 rounded-b-xl overflow-hidden"
    />
  );
};

export default HeatmapMapView;
