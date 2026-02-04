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
          setUserReports([]);
          setUpvotedReports([]);
        }
      } catch (error) {
        setErrorMessage("Could not fetch your reports. Please try again.");
        setUserReports([]);
        setUpvotedReports([]);
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
      <div className="relative z-10 flex justify-center items-start pt-24 px-4 md:px-8 pb-10 w-full">
        <div className="w-full max-w-6xl">
          {/* Page Title */}
          <h1 className="text-4xl font-bold mb-3 text-center text-gray-800">
            My Reports
          </h1>
          <p className="text-sm text-gray-600 mb-8 text-center">
            View and manage all the issues you’ve reported or upvoted so far.
          </p>

          {/* Loading */}
          {loading ? (
            <div className="text-center text-gray-500 mt-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-400 border-opacity-70 mx-auto mb-4"></div>
              <p>Loading your reports...</p>
            </div>
          ) : errorMessage ? (
            <div className="text-center text-gray-500 mt-10">
              <p>{errorMessage}</p>
            </div>
          ) : userReports.length === 0 && upvotedReports.length === 0 ? (
            <div className="text-center text-gray-500 mt-10">
              <p>You haven’t submitted or upvoted any reports yet.</p>
            </div>
          ) : (
            <>
              {/* User Reports */}
              {userReports.length > 0 && (
                <div className="bg-white/90 rounded-3xl shadow-lg border border-gray-100 p-6 backdrop-blur-sm">
                  <IssueGrid reports={userReports} />
                </div>
              )}

              {/* Upvoted Reports */}
              {upvotedReports.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-700">
                    Upvoted Reports
                  </h2>
                  <div className="bg-white/90 rounded-3xl shadow-lg border border-gray-100 p-6 backdrop-blur-sm">
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
