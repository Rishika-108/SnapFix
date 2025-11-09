import React from "react";
import IssueCard from "./issueCardComponent/IssueCard";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const IssueGrid = ({ reports }) => {
  return (
    <div
      className="relative w-full min-h-screen flex flex-col 
                 bg-linear-to-b from-[#0B1725]/60 via-[#0E2439]/80 to-[#142E4D]/90 
                 backdrop-blur-xl text-gray-100 transition-all duration-500"
    >
      {/* Decorative Overlay */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.06)_1px,transparent_1px)]
                   bg-size-[24px_24px] opacity-10 pointer-events-none"
      />

      {/* Empty State */}
      {(!reports || reports.length === 0) ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 z-10">
          <AlertCircle size={48} className="mb-4 text-[#3EA8FF]" />
          <h2 className="text-lg font-semibold text-gray-200 mb-1">
            No Reports Found
          </h2>
          <p className="text-center text-sm text-gray-400 max-w-sm">
            There are currently no issues reported. Once reports are submitted,
            they will appear here for review and management.
          </p>
        </div>
      ) : (
        <div
          className="
            relative z-10 flex-1
            grid 
            gap-8
            p-8
            sm:grid-cols-1 
            md:grid-cols-1
            lg:grid-cols-2 
            xl:grid-cols-3
            2xl:grid-cols-4
            auto-rows-[minmax(400px,auto)]
            justify-items-stretch
            items-stretch
            transition-all duration-500
          "
        >
          <AnimatePresence>
            {reports.map((report) => (
              <motion.div
                key={report.id || report._id}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex w-full h-full"
              >
                <IssueCard report={report} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default IssueGrid;
