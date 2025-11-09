// src/components/heatmapModule/NearbyIssuesModal.jsx
import React from "react";
import IssueCard from "../../issueGridModule/issueCardComponent/IssueCard";

const NearbyIssuesModal = ({ nearbyIssues, onClose }) => (
  <div
    className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-40 animate-fadeIn p-4"
    onClick={onClose}
  >
    <div
      className="bg-[#0E2439]/95 text-gray-200 rounded-xl p-4 w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[85%]"
      onClick={(e) => e.stopPropagation()}
    >
      <h4 className="text-lg font-semibold mb-4 border-b border-white/10 pb-2">
        Nearby Issues ({nearbyIssues.length})
      </h4>
      <div className="space-y-4">
        {nearbyIssues.map((r) => (
          <IssueCard key={r.id} report={r} />
        ))}
      </div>
    </div>
  </div>
);

export default NearbyIssuesModal;
