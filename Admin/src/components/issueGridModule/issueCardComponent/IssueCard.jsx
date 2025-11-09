// import React, { useState } from "react";
// import IssueHeader from "./IssueHeader";
// import IssueImage from "./IssueImage";

// const IssueCard = ({ report }) => {
//   if (!report) return null;

//   const {
//     title,
//     description,
//     image,
//     imageUrl,
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
//         relative
//         bg-[#0E2439]/80 
//         backdrop-blur-xl
//         rounded-2xl 
//         border border-white/10
//         shadow-[0_0_15px_rgba(0,0,0,0.25)]
//         hover:shadow-[0_0_20px_rgba(62,168,255,0.25)]
//         hover:border-[#3EA8FF]/40
//         transition-all duration-300 ease-out 
//         overflow-hidden 
//         mx-auto 
//         mb-8 
//         w-full
//         max-w-[95%] 
//         sm:max-w-sm 
//         md:max-w-md 
//         lg:max-w-lg
//         group
//       "
//     >
//       {/* Decorative pattern overlay on hover */}
//       <div
//         className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700"
//         style={{
//           background:
//             "radial-gradient(circle at 20% 30%, rgba(62,168,255,0.05), transparent 70%)",
//         }}
//       />

//       {/* Header */}
//       <IssueHeader
//         title={title}
//         date={new Date(date).toLocaleDateString()}
//         expanded={expanded}
//         setExpanded={setExpanded}
//       />

//       {/* Image */}
//       <div className="overflow-hidden h-48 sm:h-52 md:h-56 lg:h-60">
//         <IssueImage
//           title={title}
//           image={displayImage}
//           location={location}
//           status={status}
//           category={category}
//         />
//       </div>

//       {/* Description */}
//       <div className="relative px-5 pt-3 pb-4 text-gray-200 text-sm sm:text-base z-10">
//         <p className="leading-relaxed break-words">
//           {description || "No description provided."}
//         </p>
//       </div>

//       {/* Bottom Accent Line */}
//       <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/5">
//         <div
//           className={`h-full transition-all duration-700 ease-out ${
//             status === "Resolved"
//               ? "bg-linear-to-r from-emerald-400 to-teal-400"
//               : status === "In Progress"
//               ? "bg-linear-to-r from-[#3EA8FF] to-[#2B7AC7]"
//               : "bg-linear-to-r from-yellow-400 to-amber-500"
//           }`}
//         ></div>
//       </div>
//     </div>
//   );
// };

// export default IssueCard;



import React, { useState } from "react";
import IssueHeader from "./IssueHeader";
import IssueImage from "./IssueImage";
import IssueFooter from "./IssueFooter"; // ✅ Import the footer

const IssueCard = ({ report, user, token }) => {
  if (!report) return null;

  const {
    title,
    description,
    image,
    imageUrl,
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
        relative
        bg-[#0E2439]/80 
        backdrop-blur-xl
        rounded-2xl 
        border border-white/10
        shadow-[0_0_15px_rgba(0,0,0,0.25)]
        hover:shadow-[0_0_20px_rgba(62,168,255,0.25)]
        hover:border-[#3EA8FF]/40
        transition-all duration-300 ease-out 
        overflow-hidden 
        mx-auto 
        mb-8 
        w-full
        max-w-[95%] 
        sm:max-w-sm 
        md:max-w-md 
        lg:max-w-lg
        group
      "
    >
      {/* Decorative pattern overlay on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-700"
        style={{
          background:
            "radial-gradient(circle at 20% 30%, rgba(62,168,255,0.05), transparent 70%)",
        }}
      />

      {/* Header */}
      <IssueHeader
        title={title}
        date={new Date(date).toLocaleDateString()}
        expanded={expanded}
        setExpanded={setExpanded}
      />

      {/* Image */}
      <div className="overflow-hidden h-48 sm:h-52 md:h-56 lg:h-60">
        <IssueImage
          title={title}
          image={displayImage}
          location={location}
          status={status}
          category={category}
        />
      </div>

      {/* Description */}
      <div className="relative px-5 pt-3 pb-4 text-gray-200 text-sm sm:text-base z-10">
        <p className="leading-relaxed wrap-break-word">
          {description || "No description provided."}
        </p>
      </div>

      {/* ✅ Add Footer (Like + Bids Section) */}
      <div className="relative z-20 px-5 pb-4">
        <IssueFooter report={report} user={user || { role: "government" }} token={"demo-token-123"} />
      </div>

      {/* Bottom Accent Line */}
      <div className="absolute bottom-0 left-0 h-[3px] w-full bg-white/5">
        <div
          className={`h-full transition-all duration-700 ease-out ${
            status === "Resolved"
              ? "bg-linear-to-r from-emerald-400 to-teal-400"
              : status === "In Progress"
              ? "bg-linear-to-r from-[#3EA8FF] to-[#2B7AC7]"
              : "bg-linear-to-r from-yellow-400 to-amber-500"
          }`}
        ></div>
      </div>
    </div>
  );
};

export default IssueCard;
