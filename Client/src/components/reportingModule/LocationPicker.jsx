import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CitizenAPI } from "../../api/api"; // ✅ integrated API (optional for future location fetching)

// Fix Leaflet marker icon path
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationPicker = ({ location, detectLocation, onLocationSelect }) => {
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([19.7515, 75.7139]); // Default Maharashtra

  // ✅ Try auto-detecting location or fallback
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        setLoading(true);

        // Try browser-based detection first
        const loc = await detectLocation?.();
        if (loc?.latitude && loc?.longitude) {
          setMapCenter([loc.latitude, loc.longitude]);
          return;
        }

        // (Optional) Fallback: get from backend (CitizenAPI)
        const { data } = await CitizenAPI.getNearbyReports();
        if (data?.reports?.length > 0) {
          const first = data.reports[0];
          if (first.location?.lat && first.location?.lng)
            setMapCenter([first.location.lat, first.location.lng]);
        }
      } catch (err) {
        console.warn("Auto location detection failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLocation();
  }, [detectLocation]);

  // ✅ Map click handler for manual location selection
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onLocationSelect({ latitude: lat, longitude: lng });
      },
    });

    return location && location.latitude && location.longitude ? (
      <Marker
        position={[location.latitude, location.longitude]}
        icon={markerIcon}
      />
    ) : null;
  }

  // ✅ Helper for safe coordinate rendering
  const hasCoords =
    location &&
    typeof location.latitude === "number" &&
    typeof location.longitude === "number";

  return (
    <div className="space-y-2 text-center">
      <label className="block text-gray-300 mb-2">Location</label>

      {loading ? (
        <p className="text-gray-400">Detecting your location...</p>
      ) : (
        <div className="h-64 rounded-lg overflow-hidden border border-white/20">
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker />
          </MapContainer>
        </div>
      )}

      {hasCoords ? (
        <p className="text-gray-400 text-sm mt-1">
          Lat: {location.latitude.toFixed(4)} | Lon:{" "}
          {location.longitude.toFixed(4)}
        </p>
      ) : (
        <p className="text-gray-400 text-sm mt-1">📍 No location selected</p>
      )}

      <p className="text-xs text-gray-500">
        Tip: Tap anywhere on the map to pin your issue location.
      </p>
    </div>
  );
};

export default LocationPicker;
