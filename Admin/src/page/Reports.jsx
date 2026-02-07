import React, { useEffect, useState } from "react";

// ===== Layout Components =====
import GovernmentSidebar from "../components/generalComponents/GovernmentSidebar";
import Topbar from "../components/adminModule/Topbar";
import Footer from "../components/generalComponents/Footer";
import IssueGrid from "../components/issueGridModule/IssueGrid";

// ===== API Utilities =====
import { api } from "../api/api";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await api.getAllReports();
        if (res.success) {
          setReports(res.reports || []);
        } else {
          console.warn(res.message || "Failed to fetch reports");
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="relative min-h-screen flex text-gray-100 bg-gradient-to-br from-[#0B1725] via-[#0E2439] to-[#142E4D]">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#1A3554_1px,transparent_1px)] bg-[length:24px_24px] opacity-15 pointer-events-none" />

      {/* Sidebar */}
      <GovernmentSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 relative z-10">
        <Topbar />

        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          {loading ? (
            <p className="text-center text-gray-400">
              Loading reports...
            </p>
          ) : reports.length === 0 ? (
            <p className="text-center text-gray-400">
              No reports available.
            </p>
          ) : (
            <div className="max-w-7xl mx-auto">
              <IssueGrid reports={reports} />
            </div>
          )}
        </main>

        <Footer />
      </div>

      {/* Subtle overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default Reports;

