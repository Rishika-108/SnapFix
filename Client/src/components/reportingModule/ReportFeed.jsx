import React, { useEffect, useState } from "react";
import { CitizenAPI } from "../../api/api"; // ✅ Integrated hybrid API
import IssueGrid from "../issueGridModule/IssueGrid";
import CitizenNavbar from "../generalComponents/Navbars/CitizenNavbar";

const ReportFeed = () => {
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
      <CitizenNavbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 pt-24 px-4 md:px-8 transition-all">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Reports Feed
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Explore all reported civic issues around you 📍
          </p>

          {loading ? (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-600">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-400 border-opacity-70 mb-4"></div>
              <p className="text-lg font-medium">Loading reports...</p>
            </div>
          ) : reports.length > 0 ? (
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6">
              <IssueGrid reports={reports} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center mt-20 text-gray-600 transition-all">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076504.png"
                alt="No Reports"
                className="w-32 h-32 opacity-80 mb-4"
              />
              <p className="text-lg font-medium text-gray-800">
                No issues reported yet.
              </p>
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

export default ReportFeed;
