import React, { useEffect, useState } from "react";
import { CitizenAPI } from "../../api/api"; // ✅ Integrated with hybrid API
import IssueGrid from "../../components/issueGridModule/IssueGrid";
import CitizenNavbar from "../../components/generalComponents/Navbars/CitizenNavbar"
const MyReports = () => {
  const [loading, setLoading] = useState(true);
  const [userReports, setUserReports] = useState([]);

  // ✅ Fetch user's reports on mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await CitizenAPI.getMyReports();
        const { data } = response;
        if (data.success && data.reports) {
          setUserReports(data.reports);
        } else {
          console.warn("⚠️ Failed to fetch user reports:", data.message);
          setUserReports([]);
        }
      } catch (error) {
        console.error("❌ Error fetching reports:", error);
        setUserReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <>
    <CitizenNavbar/>
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-900 to-black text-white p-6">
      <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center m-5">My Reports</h1>
        <p className="text-sm text-gray-300 mb-8 text-center">
          View and manage all the issues you’ve reported so far.
        </p>

        {loading ? (
          <div className="text-center text-gray-400 mt-10">
            <p>Loading your reports...</p>
          </div>
        ) : userReports.length === 0 ? (
          <div className="text-center text-gray-400 mt-10">
            <p>You haven’t submitted any reports yet.</p>
          </div>
        ) : (
          <IssueGrid reports={userReports} />
        )}
      </div>
    </div>
    </>
  );
};

export default MyReports;
