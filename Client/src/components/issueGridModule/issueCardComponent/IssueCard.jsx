// import React, { useState } from "react";
// import IssueHeader from "./IssueHeader";
// import IssueImage from "./IssueImage";
// import IssueFooter from "./IssueFooter";
// import IssueMapPreview from "./IssueMapPreview";
// import RateAfterCompletion from "../RateAfterCompletion";

// const IssueCard = ({ report }) => {
//   if (!report) return null;

//   const {
//     title,
//     description,
//     image,
//     imageUrl,
//     mapPreview,
//     location,
//     date,
//     category,
//     status = "Pending",
//   } = report;

//   const [expanded, setExpanded] = useState(false);
//   const displayImage = image || imageUrl;

//   return (
//     <div
//       className="
//         bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50
//         rounded-2xl
//         border border-gray-200
//         overflow-hidden
//         shadow-lg
//         mx-auto
//         mb-8
//         transition-all
//         hover:shadow-xl
//         w-full
//         max-w-[95%]
//         sm:max-w-sm
//         md:max-w-md
//         lg:max-w-lg
//       "
//     >
//       <IssueHeader
//         title={title}
//         date={new Date(date).toLocaleDateString()}
//         expanded={expanded}
//         setExpanded={setExpanded}
//       />

//       <IssueImage
//         title={title}
//         image={displayImage}
//         location={location}
//         status={status}
//         category={category}
//       />

//       <div className="px-4 pt-3 pb-2 text-gray-800 text-sm sm:text-base">
//         <p className="leading-relaxed break-words">
//           {description || "No description provided."}
//         </p>
//       </div>

//       <div className="px-4 pb-4">
//         <IssueFooter report={report} />
//       </div>

//       {expanded && (
//         <div className="px-4 pb-4">
//           <IssueMapPreview location={location} mapPreview={mapPreview} />
//         </div>
//       )}
//       {/* ✅ Show RateAfterCompletion only if issue is completed */}
//       {status === "Proof Submitted" && report.task && !report.task.verifiedByCitizen && (
//         <div className="px-4 pb-4">
//           <RateAfterCompletion
//             issueImage={report.imageUrl}
//             resolvedImage={report.task?.proof?.imageUrl}
//             onVerify={async (isSolved, rating, review) => {
//               try {
//                 await CitizenAPI.verifyTask(report.task._id, {
//                   isSatisfied: isSolved,
//                   rating,
//                   review,
//                 });

//                 alert("✅ Verification submitted successfully");
//               } catch (err) {
//                 console.error("Verification error:", err);
//                 alert("❌ Verification failed");
//               }
//             }}
//           />

//         </div>
//       )}
//     </div>
//   );
// };

// export default IssueCard;
import React, { useState } from "react";
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
  const [taskVerified, setTaskVerified] = useState(report.task?.verifiedByCitizen || false);

  const displayImage = image || imageUrl;

  const handleVerify = async (isSolved, rating, review) => {
    try {
      await CitizenAPI.verifyTask(report.task._id, {
        isSatisfied: isSolved,
        rating,
        review,
      });

      alert("✅ Verification submitted successfully");
      setTaskVerified(true); // hide modal
      setModalOpen(false);
    } catch (err) {
      console.error("Verification error:", err);
      alert("❌ Verification failed");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl border border-gray-200 overflow-hidden shadow-lg mx-auto mb-8 transition-all hover:shadow-xl w-full max-w-[95%] sm:max-w-sm md:max-w-md lg:max-w-lg relative">
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

      {/* ✅ Button to open RateAfterCompletion modal */}
      {report.task && report.task.status === "Proof Submitted" && !taskVerified && (
        <div className="px-4 pb-4 text-center">
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 bg-pink-300 text-white rounded hover:bg-purple-400 transition"
          >
            Verify Task
          </button>
        </div>
      )}

      {/* ✅ Overlay modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-30 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-lg p-6 relative max-w-md w-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900 font-bold text-xl"
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
      )}
    </div>
  );
};

export default IssueCard;
