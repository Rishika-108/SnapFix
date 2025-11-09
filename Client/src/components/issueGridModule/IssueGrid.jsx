import React from "react";
import IssueCard from "./issueCardComponent/IssueCard";
import { AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const IssueGrid = ({ reports }) => {
  return (
    <div className="w-full py-10 min-h-screen">
      {/* Empty State */}
      {(!reports || reports.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400 w-full">
          <AlertCircle size={42} className="mb-3 text-gray-500" />
          <p className="text-center text-sm">
            No issues reported yet. Be the first to report one!
          </p>
        </div>
      ) : (
        <div
          className="
            grid 
            gap-6
            px-4
            sm:grid-cols-1
            md:grid-cols-1
            lg:grid-cols-2
            xl:grid-cols-3
            2xl:grid-cols-4
            w-full
          "
        >
          <AnimatePresence>
            {reports.map((report) => (
              <motion.div
                key={report.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <IssueCard report={report} className="w-full" />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default IssueGrid;
