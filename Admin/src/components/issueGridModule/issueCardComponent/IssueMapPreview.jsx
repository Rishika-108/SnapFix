import React from "react";

const IssueMapPreview = ({ location, mapPreview }) => {
  if (!location && !mapPreview) return null;

  return (
    <div className="mt-4 border-t border-white/10 pt-3">
      {mapPreview && (
        <div className="rounded-lg overflow-hidden border border-white/20 mb-3">
          <iframe
            title="Map"
            src={mapPreview}
            width="100%"
            height="200"
            loading="lazy"
            className="w-full"
          ></iframe>
        </div>
      )}
      {location && (
        <p className="text-gray-400 text-sm">
          Latitude: {location.lat.toFixed(4)} | Longitude:{" "}
          {location.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
};

export default IssueMapPreview;
