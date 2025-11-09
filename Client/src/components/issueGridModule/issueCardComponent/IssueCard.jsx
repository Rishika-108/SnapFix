import React, { useState } from "react";
import IssueHeader from "./IssueHeader";
import IssueImage from "./IssueImage";
import IssueFooter from "./IssueFooter";
import IssueMapPreview from "./IssueMapPreview";

const IssueCard = ({ report }) => {
  if (!report) return null;

  const {
    title,
    description,
    image,
    imageUrl,
    mapPreview,
    location,
    date,
    category,
    status = "Pending",
  } = report;

  const [expanded, setExpanded] = useState(false);
  const displayImage = image || imageUrl;

  return (
    <div
      className="
        bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50
        rounded-2xl
        border border-gray-200
        overflow-hidden
        shadow-lg
        mx-auto
        mb-8
        transition-all
        hover:shadow-xl
        w-full
        max-w-[95%]
        sm:max-w-sm
        md:max-w-md
        lg:max-w-lg
      "
    >
      <IssueHeader
        title={title}
        date={new Date(date).toLocaleDateString()}
        expanded={expanded}
        setExpanded={setExpanded}
      />

      <IssueImage
        title={title}
        image={displayImage}
        location={location}
        status={status}
        category={category}
      />

      <div className="px-4 pt-3 pb-2 text-gray-800 text-sm sm:text-base">
        <p className="leading-relaxed break-words">
          {description || "No description provided."}
        </p>
      </div>

      <div className="px-4 pb-4">
        <IssueFooter report={report} />
      </div>

      {expanded && (
        <div className="px-4 pb-4">
          <IssueMapPreview location={location} mapPreview={mapPreview} />
        </div>
      )}
    </div>
  );
};

export default IssueCard;
