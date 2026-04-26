import React, { memo, useEffect, useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/* Leaflet marker fix */
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationPicker = memo(({ location, detectLocation, onLocationSelect }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([19.7515, 75.7139]);

  const fetchLocation = useCallback(async () => {
    if (!detectLocation) return;
    try {
      setLoading(true);
      setError(null);
      const loc = await detectLocation();
      if (loc && typeof loc.latitude === "number" && typeof loc.longitude === "number") {
        setMapCenter([loc.latitude, loc.longitude]);
        onLocationSelect({
          lat: loc.latitude,
          lng: loc.longitude,
          name: "Current Location",
        });
      }
    } catch (err) {
      console.warn("Location detection failed:", err);
      setError(typeof err === "string" ? err : "Failed to detect location.");
    } finally {
      setLoading(false);
    }
  }, [detectLocation, onLocationSelect]);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  // Update map center when location prop changes from outside
  useEffect(() => {
    if (location?.lat && location?.lng) {
      setMapCenter([location.lat, location.lng]);
    }
  }, [location?.lat, location?.lng]);

  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        onLocationSelect({ lat, lng, name: "Pinned Location" });
        setMapCenter([lat, lng]);
      },
    });

    if (typeof location?.lat !== "number" || typeof location?.lng !== "number") {
      return null;
    }
    return <Marker position={[location.lat, location.lng]} icon={markerIcon} />;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700">Location</label>
        <button
          type="button"
          onClick={fetchLocation}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {loading ? "Detecting..." : "Locate Me"}
        </button>
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mt-0.5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <p className="text-xs text-red-600 leading-tight">{error}</p>
        </div>
      )}

      <div className="h-64 rounded-2xl overflow-hidden border border-gray-200 shadow-inner relative group">
        <MapContainer
          center={mapCenter}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <LocationMarker />
        </MapContainer>

        {loading && (
          <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] z-[1000] flex items-center justify-center">
            <div className="bg-white px-4 py-2 rounded-full shadow-lg border border-gray-100 flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-gray-700">Finding you...</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        {typeof location?.lat === "number" && typeof location?.lng === "number" && (
          <p className="text-[11px] font-mono text-gray-400 text-center">
            {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
          </p>
        )}
        <p className="text-[11px] text-gray-400 text-center italic">
          Tip: Tap anywhere on the map to pin a specific location.
        </p>
      </div>
    </div>
  );
});

export default LocationPicker;
