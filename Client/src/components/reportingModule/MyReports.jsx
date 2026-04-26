import React, { useEffect, useState } from "react";
import { CitizenAPI } from "../../api/api";
import IssueGrid from "../../components/issueGridModule/IssueGrid";
import CitizenNavbar from "../../components/generalComponents/Navbars/CitizenNavbar";
import { useTranslation } from "../../hooks/useTranslation";

const MyReports = () => {
  const { t } = useTranslation();
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
            {t('My Reports')}
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mb-6 sm:mb-8 text-center">
            {t('View and manage all the issues you’ve reported or upvoted so far.')}
          </p>

          {/* Main Grid Section */}
          <div className="space-y-10">
            {/* My Submissions */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-700 flex items-center gap-2">
                <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                {t('My Submissions')}
              </h2>
              <IssueGrid reports={userReports} loading={loading} />
            </section>

            {/* Upvoted by me */}
            {(upvotedReports.length > 0 || loading) && (
              <section>
                <h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-700 flex items-center gap-2">
                  <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                  {t('Upvoted Issues')}
                </h2>
                <IssueGrid reports={upvotedReports} loading={loading} />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyReports;

