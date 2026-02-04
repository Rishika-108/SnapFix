import React, { useEffect, useState } from "react";
import { CitizenAPI } from "../../api/api";
import IssueGrid from "../issueGridModule/IssueGrid";
import CitizenNavbar from "../generalComponents/Navbars/CitizenNavbar";

const ReportFeed = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <div className="relative min-h-screen w-full bg-gray-50">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200"></div>

      {/* Soft Blurred Shapes */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-200 rounded-full filter blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 right-1/3 w-80 h-80 bg-purple-200 rounded-full filter blur-3xl opacity-20"></div>

      {/* Page Content */}
      <div className="relative z-10 w-full">
        <CitizenNavbar />
        <div className="pt-24 px-4 md:px-8 transition-all">
          <div className="max-w-7xl mx-auto min-w-full">
            {/* Title */}
            <h1 className="text-3xl font-bold text-gray-800 mb-3 text-center">
              Reports Feed
            </h1>
            <p className="text-center text-gray-600 mb-8">
              Explore all reported civic issues around you 📍
            </p>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center mt-20 text-gray-600">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-400 border-opacity-70 mb-4"></div>
                <p className="text-lg font-medium">Loading reports...</p>
              </div>
            ) : reports.length > 0 ? (
              // Issue Grid Container
              <div className="bg-white/90 rounded-3xl shadow-lg border border-gray-100 p-6 min-w-full backdrop-blur-sm">
                <IssueGrid reports={reports} />
              </div>
            ) : (
              // Empty State
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
      </div>
    </div>
  );
};

export default ReportFeed;
