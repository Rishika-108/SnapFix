import React, { useEffect, useState } from "react";
import { CitizenAPI } from "../../api/api"; // Backend API
import IssueGrid from "../../components/issueGridModule/IssueGrid";
import CitizenNavbar from "../../components/generalComponents/Navbars/CitizenNavbar";

const MyReports = () => {
  const [loading, setLoading] = useState(true);
  const [userReports, setUserReports] = useState([]);
  const [upvotedReports, setUpvotedReports] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch user's reports on mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await CitizenAPI.getMyReports();
        const { data } = response;

        if (data.success) {
          setUserReports(data.reports || []);
          setUpvotedReports(data.upvotedReports || []);
        } else {
          console.warn("⚠️ Failed to fetch user reports:", data.message);
          setErrorMessage(data.message || "No reports found.");
          setUserReports([]);
          setUpvotedReports([]);
        }
      } catch (error) {
        console.error("❌ Error fetching reports:", error);
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
    <>
      <CitizenNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 text-gray-800 p-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 w-full max-w-6xl">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">My Reports</h1>
          <p className="text-sm text-gray-600 mb-8 text-center">
            View and manage all the issues you’ve reported or upvoted so far.
          </p>

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
              {userReports.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Reports</h2>
                  <IssueGrid reports={userReports} />
                </>
              )}

              {upvotedReports.length > 0 && (
                <>
                  <h2 className="text-2xl font-semibold mt-10 mb-4 text-gray-700">
                    Upvoted Reports
                  </h2>
                  <IssueGrid reports={upvotedReports} />
                </>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default MyReports;
