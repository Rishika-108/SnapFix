import React, { useEffect, useState } from "react";

// ===== Layout Components =====
import GovernmentSidebar from "../components/generalComponents/GovernmentSidebar";
import Topbar from "../components/adminModule/Topbar";
import Footer from "../components/generalComponents/Footer";
import IssueGrid from "../components/issueGridModule/IssueGrid";

// ===== API Utilities =====
import { api } from "../api/api"; // Make sure this matches your API export

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await api.getAllReports();
        if (res.success) {
          setReports(res.reports);
        } else {
          alert(res.message || "Failed to fetch reports");
        }
      } catch (err) {
        console.error("Error fetching reports:", err);
        alert(err.message || "Could not fetch reports from server");
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <div className="relative min-h-screen flex text-gray-100 bg-linear-to-br from-[#0B1725] via-[#0E2439] to-[#142E4D] transition-all duration-300">
      {/* Background Pattern Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#1A3554_1px,transparent_1px)] bg-size-[24px_24px] opacity-15 pointer-events-none" />

      {/* Sidebar */}
      <GovernmentSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col ml-64 relative z-10 overflow-hidden">
        <Topbar />

        <main className="flex-1 p-8 overflow-y-auto">
          {loading ? (
            <p className="text-center text-gray-400">Loading reports...</p>
          ) : reports.length === 0 ? (
            <p className="text-center text-gray-400">No reports available.</p>
          ) : (
            <IssueGrid reports={reports} />
          )}
        </main>

        <Footer />
      </div>

      {/* Subtle overlay gradient for focus depth */}
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

export default Reports;
