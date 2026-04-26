import React, { useEffect, useState } from "react";
import { CitizenAPI } from "../../api/api";
import IssueGrid from "../issueGridModule/IssueGrid";
import CitizenNavbar from "../generalComponents/Navbars/CitizenNavbar";
import { useTranslation } from "../../hooks/useTranslation";

const ReportFeed = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await CitizenAPI.getNearbyReports();
        const { data } = response;
        if (data.success && data.reports) {
          setReports(data.reports);
        } else {
          setReports([]);
        }
      } catch {
        setReports([]);
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
      <div className="relative z-10 w-full">
        <CitizenNavbar />

        <div className="pt-20 sm:pt-24 px-3 sm:px-4 md:px-8 transition-all">
          <div className="max-w-7xl mx-auto">

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 text-center">
              {t('reportsFeed')}
            </h1>
            <p className="text-xs sm:text-sm text-center text-gray-600 mb-6 sm:mb-8">
               {t('nearbyIssues')} 📍
            </p>

            {/* Loading State */}
            {loading ? (
              <div className="flex flex-col items-center justify-center mt-16 text-gray-600">
                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-4 border-indigo-400 mb-3"></div>
                <p className="text-sm sm:text-lg font-medium">
                  {t('loading')}
                </p>
              </div>
            ) : reports.length > 0 ? (
              /* Issue Grid Container */
              <div className="bg-white/90 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 p-4 sm:p-6 backdrop-blur-sm">
                <IssueGrid reports={reports} />
              </div>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center mt-16 text-gray-600">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/4076/4076504.png"
                  alt="No Reports"
                  className="w-20 h-20 sm:w-32 sm:h-32 opacity-80 mb-4"
                />
                <p className="text-base sm:text-lg font-medium text-gray-800">
                  {t('noIssues')}
                </p>
                <p className="text-xs sm:text-sm text-gray-500 text-center">
                  {t('Be the first to report a civic issue in your area.')}
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
