import React, { useState } from "react";
import { MapPin, Tag } from "lucide-react";
import IssueStatusBadge from "./IssueStatusBadge";

const IssueImage = ({ title, image, location, status, category }) => {
  const [showImage, setShowImage] = useState(false);
  const imageURL =
    typeof image === "string" ? image : image ? URL.createObjectURL(image) : null;

  return (
    <div className="relative w-full bg-black">
      {/* Image */}
      {imageURL ? (
        <img
          src={imageURL}
          alt={title}
          onClick={() => setShowImage(true)}
          className="
            w-full 
            h-56 
            sm:h-72 
            md:h-80 
            lg:h-96 
            object-cover 
            cursor-pointer 
            transition-transform 
            duration-500 
            hover:scale-[1.02]
          "
        />
      ) : (
        <div className="h-56 sm:h-72 md:h-80 lg:h-96 flex items-center justify-center text-gray-500 text-sm">
          No Image
        </div>
      )}

      {/* Status Badge (Top Right) */}
      <IssueStatusBadge status={status} />

      {/* Location & Category (Bottom Left) */}
      <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
        {location && (
          <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs sm:text-sm flex items-center gap-1">
            <MapPin size={14} className="text-red-400" />
            <span className="truncate max-w-[120px] sm:max-w-[180px]">
              {location.city || location.name || "Unknown Location"}
            </span>
          </div>
        )}

        {category && (
          <div className="bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-xs sm:text-sm flex items-center gap-1">
            <Tag size={14} className="text-blue-400" />
            <span className="truncate max-w-[120px] sm:max-w-[180px]">
              {category}
            </span>
          </div>
        )}
      </div>

      {/* Fullscreen Image View */}
      {showImage && (
        <div
          onClick={() => setShowImage(false)}
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 cursor-pointer p-3"
        >
          <img
            src={imageURL}
            alt={title}
            className="max-w-full max-h-[90vh] rounded-lg shadow-lg object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default IssueImage;
