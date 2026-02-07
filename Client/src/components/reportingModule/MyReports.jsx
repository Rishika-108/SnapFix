import React, { useEffect, useState } from "react";
import { CitizenAPI } from "../../api/api";
import IssueGrid from "../../components/issueGridModule/IssueGrid";
import CitizenNavbar from "../../components/generalComponents/Navbars/CitizenNavbar";

const MyReports = () => {
  const [loading, setLoading] = useState(true);
  const [userReports, setUserReports] = useState([]);
  const [upvotedReports, setUpvotedReports] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await CitizenAPI.getMyReports();
        const { data } = response;

        if (data.success) {
          setUserReports(data.reports || []);
          setUpvotedReports(data.upvotedReports || []);
        } else {
          setErrorMessage(data.message || "No reports found.");
        }
      } catch {
        setErrorMessage("Could not fetch your reports. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="relative min-h-screen w-full bg-gray-50 overflow-x-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200"></div>

      {/* Decorative Blobs (hidden on small screens) */}
      <div className="hidden sm:block absolute top-0 left-1/4 w-72 h-72 md:w-96 md:h-96 bg-blue-200 rounded-full blur-3xl opacity-30"></div>
      <div className="hidden sm:block absolute bottom-0 right-1/3 w-64 h-64 md:w-80 md:h-80 bg-purple-200 rounded-full blur-3xl opacity-20"></div>

      {/* Page Content */}
      <div className="relative z-10 flex justify-center pt-20 sm:pt-24 px-3 sm:px-4 md:px-8 pb-10">
        <div className="w-full max-w-6xl">

          {/* Page Title */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2 text-center text-gray-800">
            My Reports
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 text-center">
            View and manage all the issues you’ve reported or upvoted so far.
          </p>

          {/* Loading / Error / Empty States */}
          {loading ? (
            <div className="text-center text-gray-500 mt-10">
              <div className="animate-spin rounded-full h-8 w-8 sm:h-10 sm:w-10 border-t-4 border-indigo-400 mx-auto mb-3"></div>
              <p className="text-sm">Loading your reports...</p>
            </div>
          ) : errorMessage ? (
            <div className="text-center text-gray-500 mt-10 text-sm">
              {errorMessage}
            </div>
          ) : userReports.length === 0 && upvotedReports.length === 0 ? (
            <div className="text-center text-gray-500 mt-10 text-sm">
              You haven’t submitted or upvoted any reports yet.
            </div>
          ) : (
            <>
              {/* User Reports */}
              {userReports.length > 0 && (
                <div className="bg-white/90 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 backdrop-blur-sm">
                  <IssueGrid reports={userReports} />
                </div>
              )}

              {/* Upvoted Reports */}
              {upvotedReports.length > 0 && (
                <>
                  <h2 className="text-xl sm:text-2xl font-semibold mt-8 sm:mt-10 mb-3 sm:mb-4 text-gray-700">
                    Upvoted Reports
                  </h2>
                  <div className="bg-white/90 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 backdrop-blur-sm">
                    <IssueGrid reports={upvotedReports} />
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyReports;

