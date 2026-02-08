import React from "react";
import IssueCard from "./issueCardComponent/IssueCard";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const IssueGrid = ({ reports }) => {
  return (
    <div className="w-full min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Empty State */}
        {!reports || reports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-400">
            <AlertCircle size={48} className="mb-4 text-gray-400" />
            <p className="text-center text-sm sm:text-base max-w-sm">
              No issues reported yet. Be the first to report one!
            </p>
          </div>
        ) : (
          <AnimatePresence>
            <div
              className="
                grid
                gap-6
                sm:grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                xl:grid-cols-4
              "
            >
              {reports.map((report) => (
                <motion.div
                  key={report._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  <IssueCard report={report} />
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

export default IssueGrid;

