import React, { useEffect, useState } from "react";

// ===== Layout Components =====
import GovernmentSidebar from "../components/generalComponents/GovernmentSidebar";
import Topbar from "../components/adminModule/Topbar";

// ===== Dashboard Components =====
import InsightCard from "../components/adminModule/InsightCard";
import AreaPerformanceMap from "../components/adminModule/AreaPerformanceMap";
import DashboardHeader from "../components/adminModule/DashboardHeader";
import Heatmap from "../components/adminModule/heatmapModule/Heatmap";
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

  // Dashboard Data Loading From Here

  // initial Reports Fetch
  useEffect(() => {
    const fetchReports = async () => {
      const response = await api.getAllReports();
      setAllReports(response.reports);
      setLoading(false);
    };
    fetchReports();
  }, []);

  // Updates Reports on dateChange
  useEffect(() => {
    if (!allReports.length) return;
    let filtered = [];
    if (dateRange == "All Reports") {
      filtered = allReports;
    } else {
      filtered = filterReportsByDate(allReports, dateRange);
    }

    setStats({
      total: filtered.length,
      pending: filtered.filter((r) => r.status === "Pending").length,
      active: filtered.filter((r) => r.status === "In Progress").length,
      completed: filtered.filter((r) => r.status === "Completed").length,
    });
    setLoading(false);
  }, [dateRange, allReports]);

  // Get Date Range To Update reports
  const filterReportsByDate = (reports, range) => {
    const { startDate, endDate } = getDateRange(range);

    if (!startDate) return reports;

    return reports.filter((report) => {
      const createdAt = new Date(report.createdAt);
      createdAt.setHours(0, 0, 0, 0);
      return createdAt >= startDate && createdAt <= endDate;
    });
  };
  const getDateRange = (range) => {
    const now = new Date();
    let startDate;
    let endDate = new Date(now);

    // Normalize endDate to end of today
    endDate.setHours(23, 59, 59, 999);

    switch (range) {
      case "Today": {
        startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        break;
      }

      case "This Week": {
        const today = new Date();
        const day = today.getDay(); // 0 (Sun) → 6 (Sat)
        const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Monday
        startDate = new Date(today.setDate(diff));
        startDate.setHours(0, 0, 0, 0);
        break;
      }

      case "This Month": {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      }

      case "This Year": {
        startDate = new Date(now.getFullYear(), 0, 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      }

      default:
        startDate = null;
    }

    return { startDate, endDate };
  };

  return (
    <div
      className="min-h-screen flex bg-linear-to-br from-[#0B1725] via-[#0E2439] to-[#142E4D] 
                 text-gray-100 transition-all duration-300"
    >
      <GovernmentSidebar />

      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        <Topbar />

        <main className="flex-1 p-8 overflow-y-auto space-y-8">
          <DashboardHeader
            title="Government Dashboard"
            subtitle="Civic Issue Reporting Overview"
            onDateRangeChange={setDateRange}
            onLoading={setLoading}
          />

          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <InsightCard
              title="Total Reports"
              value={loading ? "..." : stats.total}
              change={stats.total ? 4.62 : 0}
            />
            <InsightCard
              title="Pending Issues"
              value={loading ? "..." : stats.pending}
              change={stats.pending ? 1.25 : 0}
            />
            <InsightCard
              title="Active Issues"
              value={loading ? "..." : stats.active}
              change={stats.active ? 2.01 : 0}
            />
            <InsightCard
              title="Issues Resolved"
              value={loading ? "..." : stats.completed}
              change={stats.completed ? -3.14 : 0}
            />
          </section>

          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div
              className="col-span-2 bg-[#0E2439]/60 backdrop-blur-xl border border-white/10 
                         rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.3)] 
                         hover:shadow-[0_0_25px_rgba(62,168,255,0.25)] transition-all duration-300"
            >
              {/* <h2 className="text-md font-semibold text-gray-200 mb-4">
                Issue Reporting Trends
              </h2> */}
              <Heatmap allReports = {allReports} />
            </div>

            <div
              className="bg-[#0E2439]/60 backdrop-blur-xl border border-white/10 
                         rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.3)] 
                         hover:shadow-[0_0_25px_rgba(62,168,255,0.25)] transition-all duration-300"
            >
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
