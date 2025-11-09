// src/components/heatmapModule/SelectedIssueModal.jsx
import React from "react";
import IssueCard from "../../issueGridModule/issueCardComponent/IssueCard";

const SelectedIssueModal = ({ issue, onClose }) => (
  <div
    className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40 animate-fadeIn p-4"
    onClick={onClose}
  >
    <div
      className="w-full max-w-[90%] sm:max-w-md md:max-w-lg lg:max-w-xl overflow-y-auto max-h-[90%]"
      onClick={(e) => e.stopPropagation()}
    >
      <IssueCard report={issue} />
    </div>
  </div>
);

export default SelectedIssueModal;
