import React, { useEffect, useState } from "react";
import { getAllReports, getReports } from "../../api/handleReports"; // ✅ Integrated API functions
import IssueGrid from "../issueGridModule/IssueGrid";

/**
 * ReportFeed Component
 * Displays a list of reports based on the user type/status.
 *
 * Props:
 * - user: "pending" | "active" | "completed" | "all"
 */
const ReportFeed = ({ user = "all" }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true; // ✅ Prevent state updates after unmount

    const fetchReports = async () => {
      setLoading(true);
      try {
        let fetchedReports = [];
        const userType = user?.toLowerCase?.() || "all";

        switch (userType) {
          case "pending":
            fetchedReports = await getReports("pending");
            break;

          case "active":
            fetchedReports = await getReports("inprogress");
            break;

          case "completed":
            fetchedReports = await getReports("completed");
            break;

          case "all":
            fetchedReports = await getReports("all");
            break;

          default:
            console.warn(`⚠️ Unknown user type: ${user}. Fetching all reports.`);
            fetchedReports = await getAllReports();
            break;
        }

        // ✅ Safely update state only if component is still mounted
        if (isMounted) {
          if (Array.isArray(fetchedReports) && fetchedReports.length > 0) {
            setReports(fetchedReports);
          } else {
            console.warn("⚠️ No reports found for this user type.");
            setReports([]);
          }
        }
      } catch (error) {
        console.error("❌ Error fetching reports:", error.message);
        if (isMounted) setReports([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchReports();

    // ✅ Cleanup to avoid memory leaks
    return () => {
      isMounted = false;
    };
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4 md:px-8 transition-all duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">
          Reports Feed
        </h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-600 dark:text-gray-300">
            <p className="text-lg font-medium">Loading reports...</p>
          </div>
        ) : reports.length > 0 ? (
          <IssueGrid reports={reports} />
        ) : (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-600 dark:text-gray-300 transition-all duration-300">
            <img
              src="https://cdn-icons-png.flaticon.com/512/4076/4076504.png"
              alt="No Reports"
              className="w-32 h-32 opacity-80 mb-4"
            />
            <p className="text-lg font-medium">No issues reported yet.</p>
            <p className="text-sm text-gray-500">
              Be the first to report a civic issue in your area.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportFeed;
