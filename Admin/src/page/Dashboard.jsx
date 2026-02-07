import React, { useEffect, useState } from "react";

// ===== Layout Components =====
import GovernmentSidebar from "../components/generalComponents/GovernmentSidebar";
import Topbar from "../components/adminModule/Topbar";

// ===== Dashboard Components =====
import InsightCard from "../components/adminModule/InsightCard";
import Heatmap from "../components/adminModule/heatmapModule/Heatmap";
import DashboardHeader from "../components/adminModule/DashboardHeader";
import Footer from "../components/generalComponents/Footer";
import TrafficCard from "../components/adminModule/TrafficCard";
import api from "../api/api";

const Dashboard = () => {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("All Reports");
  const [allReports, setAllReports] = useState([]);

  /* ================= Fetch Reports ================= */
  useEffect(() => {
    const fetchReports = async () => {
      const response = await api.getAllReports();
      setAllReports(response.reports || []);
      setLoading(false);
    };
    fetchReports();
  }, []);

  /* ================= Filter Stats ================= */
  useEffect(() => {
    if (!allReports.length) return;

    const filtered =
      dateRange === "All Reports"
        ? allReports
        : filterReportsByDate(allReports, dateRange);

    setStats({
      total: filtered.length,
      pending: filtered.filter((r) => r.status === "Pending").length,
      active: filtered.filter((r) => r.status === "In Progress").length,
      completed: filtered.filter((r) => r.status === "Completed").length,
    });

    setLoading(false);
  }, [dateRange, allReports]);

  const filterReportsByDate = (reports, range) => {
    const { startDate, endDate } = getDateRange(range);
    if (!startDate) return reports;

    return reports.filter((r) => {
      const date = new Date(r.createdAt);
      return date >= startDate && date <= endDate;
    });
  };

  const getDateRange = (range) => {
    const now = new Date();
    let startDate = null;
    const endDate = new Date(now.setHours(23, 59, 59, 999));

    if (range === "Today") {
      startDate = new Date();
      startDate.setHours(0, 0, 0, 0);
    }

    return { startDate, endDate };
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0B1725] via-[#0E2439] to-[#142E4D] text-gray-100">
      {/* Sidebar */}
      <GovernmentSidebar />

      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Topbar (mobile handled inside) */}
        <Topbar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8 space-y-8">
          <DashboardHeader
            title="Government Dashboard"
            subtitle="Civic Issue Reporting Overview"
            onDateRangeChange={setDateRange}
            onLoading={setLoading}
          />

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <InsightCard title="Total Reports" value={loading ? "..." : stats.total} />
            <InsightCard title="Pending Issues" value={loading ? "..." : stats.pending} />
            <InsightCard title="Active Issues" value={loading ? "..." : stats.active} />
            <InsightCard title="Issues Resolved" value={loading ? "..." : stats.completed} />
          </section>

          {/* Charts */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#0E2439]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-5">
              <Heatmap allReports={allReports} />
            </div>

            <div className="bg-[#0E2439]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-5">
              <TrafficCard reports={allReports} loading={loading} />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;

