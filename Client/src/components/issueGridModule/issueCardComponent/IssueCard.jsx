import React, { useEffect, useState } from "react";
import IssueHeader from "./IssueHeader";
import IssueImage from "./IssueImage";
import IssueFooter from "./IssueFooter";
import IssueMapPreview from "./IssueMapPreview";
import RateAfterCompletion from "../RateAfterCompletion";
import { CitizenAPI } from "../../../api/api";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [taskVerified, setTaskVerified] = useState(
    report.task?.verifiedByCitizen || false
  );
  useEffect(() => {
  if (modalOpen) {
    document.documentElement.style.overflow = "hidden"; // <html>
    document.body.style.overflow = "hidden";
  } else {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  return () => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  };
}, [modalOpen]);


  const displayImage = image || imageUrl;

  const handleVerify = async (isSolved, rating, review) => {
    try {
      await CitizenAPI.verifyTask(report.task._id, {
        isSatisfied: isSolved,
        rating,
        review,
      });

      alert("✅ Verification submitted successfully");
      setTaskVerified(true);
      setModalOpen(false);
    } catch (err) {
      alert("❌ Verification failed");
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300 w-full max-w-md mx-auto mb-6 overflow-hidden relative">
      
      {/* Header */}
      <IssueHeader
        title={title}
        date={new Date(report.createdAt).toLocaleDateString("en-GB")}
        expanded={expanded}
        setExpanded={setExpanded}
      />

      {/* Image */}
      <IssueImage
        title={title}
        image={displayImage}
        location={location}
        status={status}
        category={category}
      />

      {/* Description */}
      <div className="px-4 py-3 text-gray-700 text-sm sm:text-base">
        <p className="leading-relaxed break-words">
          {description?.length > 150 && !expanded
            ? `${description.substring(0, 150)}...`
            : description || "No description provided."}
        </p>
        {description?.length > 150 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-indigo-500 text-xs font-semibold mt-1 hover:text-indigo-700"
          >
            {expanded ? "Read Less" : "Read More"}
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 pb-3">
        <IssueFooter report={report} />
      </div>

      {/* Map Preview */}
      {expanded && (
        <div className="px-4 pb-4">
          <IssueMapPreview location={location} mapPreview={mapPreview} />
        </div>
      )}

      {/* Verify Button */}
      {report.task &&
        report.task.status === "Proof Submitted" &&
        !taskVerified && (
          <div className="px-4 pb-4 text-center">
            <button
              onClick={() => setModalOpen(true)}
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-indigo-500 text-white font-medium hover:bg-indigo-600 transition"
            >
              Verify Task
            </button>
          </div>
        )}

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm overflow-y-auto">
          <div className= "min-h-screen flex justify-center items-start px-3 py-6">
             <div className="bg-white rounded-xl shadow-xl p-4 sm:p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
            
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl leading-none"
            >
              &times;
            </button>

            <RateAfterCompletion
              issueImage={report.imageUrl}
              resolvedImage={report.task?.proof?.imageUrl}
              onVerify={handleVerify}
            />
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default IssueCard;
