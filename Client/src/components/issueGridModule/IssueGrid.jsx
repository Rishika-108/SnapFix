import React from "react";
import IssueCard from "./issueCardComponent/IssueCard";
import { AlertCircle, SearchX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import SkeletonCard from "../generalComponents/SkeletonCard";

const IssueGrid = ({ reports, loading }) => {
  return (
    <div className="w-full min-h-screen bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Grid Container */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          
          {/* Loading State */}
          {loading ? (
            Array.from({ length: 8 }).map((_, idx) => (
              <SkeletonCard key={idx} />
            ))
          ) : !reports || reports.length === 0 ? (
            /* Empty State */
            <div className="col-span-full flex flex-col items-center justify-center py-32 text-gray-400 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="bg-gray-100 p-4 rounded-full mb-4">
                <SearchX size={48} className="text-gray-300" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700">No issues found</h3>
              <p className="text-center text-sm sm:text-base max-w-sm mt-1">
                It looks like there aren't any reports here yet. 
                Be a hero and report an issue in your area!
              </p>
            </div>
          ) : (
            /* Content State */
            <AnimatePresence>
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
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueGrid;

