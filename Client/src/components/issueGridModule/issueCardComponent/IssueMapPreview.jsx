// import React from "react";

// const IssueMapPreview = ({ location, mapPreview }) => {
//   if (!location && !mapPreview) return null;

//   return (
//     <div className="mt-4 border-t border-white/10 pt-3">
//       {mapPreview && (
//         <div className="rounded-lg overflow-hidden border border-white/20 mb-3">
//           <iframe
//             title="Map"
//             src={mapPreview}
//             width="100%"
//             height="200"
//             loading="lazy"
//             className="w-full"
//           ></iframe>
//         </div>
//       )}
//       {location && (
//         <p className="text-gray-400 text-sm">
//           Latitude: {location.lat.toFixed(4)} | Longitude:{" "}
//           {location.lng.toFixed(4)}
//         </p>
//       )}
//     </div>
//   );
// };

// export default IssueMapPreview;
import React from "react";

const IssueMapPreview = ({ location }) => {
  if (!location?.coordinates) return null;

  const [lng, lat] = location.coordinates;

  const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div className="mt-4 border-t border-white/10 pt-3">
      {/* 🌍 Google Maps Embed */}
      <div className="rounded-lg overflow-hidden border border-white/20 mb-3">
        <iframe
          title="Map"
          src={`https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`}
          width="100%"
          height="200"
          loading="lazy"
          className="w-full"
        ></iframe>
      </div>

      {/* 📍 Coordinates */}
      <p className="text-gray-400 text-sm">
        Latitude: {lat.toFixed(4)} | Longitude: {lng.toFixed(4)}
      </p>

      {/* 🔗 External Link */}
      <a
        href={googleMapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 text-blue-500 hover:text-purple-500 text-sm font-medium"
      >
        View in Google Maps
      </a>
    </div>
  );
};

export default IssueMapPreview;
