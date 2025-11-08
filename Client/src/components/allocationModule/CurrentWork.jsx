import React, { useEffect, useState } from "react";
import { CitizenAPI } from "../../api/api"; // ✅ Integrated hybrid API
import IssueGrid from "../issueGridModule/IssueGrid";
import CitizenNavbar from "../generalComponents/Navbars/CitizenNavbar"

const CurrentWork = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch reports from API (dummy or live)
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await CitizenAPI.getNearbyReports();
        const { data } = response;
        if (data.success && data.reports) {
          setReports(data.reports);
        } else {
          console.warn("⚠️ Failed to fetch reports:", data.message);
          setReports([]);
        }
      } catch (error) {
        console.error("❌ Error fetching reports:", error);
        setReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <>
      <CitizenNavbar/>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 px-4 md:px-8 transition-all">
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
            <div className="flex flex-col items-center justify-center mt-20 text-gray-600 dark:text-gray-300 transition-all">
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
    </>
  );
};

export default CurrentWork;
