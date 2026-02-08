import React, { useEffect, useState } from "react";
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

const LocationPicker = ({ location, detectLocation, onLocationSelect }) => {
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([19.7515, 75.7139]); // fallback

  
  useEffect(() => {
    const fetchLocation = async () => {
      if (!detectLocation) return;

      try {
        setLoading(true);

        // 🔑 Expect detectLocation to RETURN coords
        const loc = await detectLocation();

        if (
          loc &&
          typeof loc.latitude === "number" &&
          typeof loc.longitude === "number"
        ) {
          setMapCenter([loc.latitude, loc.longitude]);
        }
      } catch (err) {
        console.warn("Auto location detection failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [detectLocation]);

  /* Map click handler */
  const LocationMarker = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;

        onLocationSelect({
          lat,
          lng,
          name: "Pinned Location",
        });

        setMapCenter([lat, lng]);
      },
    });

    if (
      typeof location?.lat !== "number" ||
      typeof location?.lng !== "number"
    ) {
      return null;
    }

    return (
      <Marker
        position={[location.lat, location.lng]}
        icon={markerIcon}
      />
    );
  };

  return (
    <div className="space-y-2 text-center">
      <label className="block text-gray-700 mb-2">Location</label>

      {loading ? (
        <p className="text-gray-400">Detecting your location...</p>
      ) : (
        <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
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

      {typeof location?.lat === "number" &&
        typeof location?.lng === "number" && (
          <p className="text-gray-500 text-sm mt-1">
            Lat: {location.lat.toFixed(4)} | Lon:{" "}
            {location.lng.toFixed(4)}
          </p>
        )}

      <p className="text-xs text-gray-500">
        Tip: Tap anywhere on the map to pin your issue location.
      </p>
    </div>
  );
};

export default LocationPicker;
