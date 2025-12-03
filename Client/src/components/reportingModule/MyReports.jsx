import React, { useEffect, useState } from "react";
import { CitizenAPI } from "../../api/api";
import IssueGrid from "../../components/issueGridModule/IssueGrid";
import CitizenNavbar from "../../components/generalComponents/Navbars/CitizenNavbar";
import AppBG from "../../assets/B-g.jpg"; // background image

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
    <div className="relative min-h-screen w-full">
      <CitizenNavbar />

      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${AppBG})` }}
      />

      {/* White Tint Overlay */}
      <div className="absolute inset-0 bg-white/60" />

      {/* Page Content */}
      <div className="relative z-10 flex justify-center items-start pt-24 px-4 md:px-8 pb-10 w-full">
        <div className=" w-full max-w-6xl">
          <h1 className="text-4xl font-bold mb-6 text-center text-gray-800">
            My Reports
          </h1>
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
                <div className="bg-blue-50 rounded-3xl shadow-lg border border-gray-100  min-w-full">
                  <IssueGrid reports={userReports} />
                  </div>
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
    </div>
  );
};

export default MyReports;
