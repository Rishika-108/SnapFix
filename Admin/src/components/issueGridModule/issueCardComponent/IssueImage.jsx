import React, { useState } from "react";
import { MapPin, Tag } from "lucide-react";
import IssueStatusBadge from "./IssueStatusBadge";

const IssueImage = ({ title, image, location, status, category }) => {
  const [showImage, setShowImage] = useState(false);
  const imageURL =
    typeof image === "string" ? image : image ? URL.createObjectURL(image) : null;

  return (
    <div className="relative w-full bg-[#0E2439]/80 overflow-hidden rounded-b-none">
      {/* Image */}
      {imageURL ? (
        <img
          src={imageURL}
          alt={title}
          onClick={() => setShowImage(true)}
          className="
            w-full 
            h-44 sm:h-52 md:h-60 lg:h-64 
            object-cover 
            cursor-pointer 
            transition-transform duration-500 
            hover:scale-[1.03]
            brightness-[0.95] hover:brightness-100
          "
        />
      ) : (
        <div className="h-44 sm:h-52 md:h-60 lg:h-64 flex items-center justify-center text-gray-400 text-sm">
          No Image
        </div>
      )}

      {/* Soft Overlay for readability */}
      <div className="absolute inset-0 bg-linear-to-t from-[#0E2439]/60 via-transparent to-transparent pointer-events-none" />

      {/* Status Badge (Top Right) */}
      <div className="absolute top-3 right-3">
        <IssueStatusBadge status={status} />
      </div>

      {/* Location & Category (Bottom Left) */}
      <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
        {location && (
          <div
            className="bg-[#0E2439]/80 backdrop-blur-md px-3 py-1.5 rounded-full 
                       text-gray-100 text-xs sm:text-sm flex items-center gap-1 
                       shadow-[0_0_8px_rgba(62,168,255,0.2)]"
          >
            <MapPin size={14} className="text-[#3EA8FF]" />
            <span className="truncate max-w-[120px] sm:max-w-[180px]">
              {location.city || location.name || "Unknown Location"}
            </span>
          </div>
        )}

        {category && (
          <div
            className="bg-[#0E2439]/80 backdrop-blur-md px-3 py-1.5 rounded-full 
                       text-gray-100 text-xs sm:text-sm flex items-center gap-1 
                       shadow-[0_0_8px_rgba(62,168,255,0.2)]"
          >
            <Tag size={14} className="text-[#3EA8FF]" />
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
            className="max-w-full max-h-[90vh] rounded-lg shadow-[0_0_30px_rgba(0,0,0,0.6)] object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default IssueImage;
