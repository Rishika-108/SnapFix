import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationMarker = ({ location, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      onLocationSelect({ lat, lng, name: "" });
    },
  });

  return location?.lat && location?.lng ? (
    <Marker position={[location.lat, location.lng]} icon={markerIcon} />
  ) : null;
};

const LocationPicker = ({ location, detectLocation, onLocationSelect }) => {
  const [loading, setLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([19.7515, 75.7139]);
  const mapRef = useRef(null);

  const hasCoords = location?.lat && location?.lng;

  useEffect(() => {
    let isMounted = true;

    const fetchLocation = async () => {
      try {
        setLoading(true);

        // detectLocation may call setReport asynchronously
        await detectLocation?.();

        if (location?.lat && location?.lng && isMounted) {
          setMapCenter([location.lat, location.lng]);
        }
      } catch (err) {
        console.warn("Location detection failed:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLocation();
    return () => { isMounted = false; };
  }, []); // run only once

  useEffect(() => {
    if (mapRef.current && hasCoords) {
      mapRef.current.setView([location.lat, location.lng], 13);
    }
  }, [location, hasCoords]);

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
            whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            <LocationMarker location={location} onLocationSelect={onLocationSelect} />
          </MapContainer>
        </div>
      )}

      {hasCoords ? (
        <p className="text-gray-400 text-sm mt-1">
          Lat: {location.lat.toFixed(4)} | Lon: {location.lng.toFixed(4)}
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
