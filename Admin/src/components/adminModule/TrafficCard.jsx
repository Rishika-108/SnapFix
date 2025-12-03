import React, { useState, useEffect, useMemo } from "react";
import { FiDownload } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import Chart from "react-apexcharts";
import { getReports } from "../../api/handleReports";

/**
 * Reusable TrafficCard component for report summary
 *
 * Shows filters (All, Active, Pending, Completed) and report statistics.
 */
const TrafficCard = ({
  title = "Reports Overview",
  description = "Monitor and analyze all submitted reports based on their status.",
  onDownload = () => {},
}) => {
  const [filter, setFilter] = useState("all");
  const [reportsData, setReportsData] = useState({
    total: 7,
    active: 6,
    pending: 6,
    completed: 1,
  });
  const [loading, setLoading] = useState(false);

  // ✅ Fetch reports data dynamically
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await getAllReports();
        if (!isMounted) return;

        const total = data.length;
        const active = data.filter((r) => r.status === "active").length;
        const pending = data.filter((r) => r.status === "pending").length;
        const completed = data.filter((r) => r.status === "completed").length;

        setReportsData({ total, active, pending, completed });
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchData();
    return () => {
      isMounted = false;
    };
  }, [filter]);

  // ✅ Memoized Chart Config (prevents re-render flicker)
  const chartData = useMemo(
    () => ({
      series: [
        reportsData.active,
        reportsData.pending,
        reportsData.completed,
      ],
      options: {
        chart: {
          type: "donut",
          background: "transparent",
          animations: {
            enabled: true,
            easing: "easeinout",
            speed: 800,
          },
        },
        labels: ["Active", "Pending", "Completed"],
        colors: ["#FACC15", "#3B82F6", "#10B981"], // yellow, blue, green
        legend: {
          position: "bottom",
          labels: { colors: "#9CA3AF" },
        },
        dataLabels: {
          enabled: true,
          formatter: (val) => `${val.toFixed(1)}%`,
          style: { fontSize: "12px", fontWeight: "500" },
        },
        tooltip: {
          y: {
            formatter: (val) => `${val} reports`,
          },
        },
        stroke: {
          show: true,
          width: 2,
          colors: ["transparent"],
        },
        plotOptions: {
          pie: {
            expandOnClick: false,
            donut: {
              size: "70%",
              labels: {
                show: true,
                total: {
                  show: true,
                  label: "Total",
                  color: "#9CA3AF",
                  formatter: () => reportsData.total || 0,
                },
              },
            },
          },
        },
        theme: {
          mode: "dark",
        },
        responsive: [
          {
            breakpoint: 480,
            options: {
              chart: { width: 240 },
              legend: { position: "bottom" },
            },
          },
        ],
      },
    }),
    [reportsData]
  );

  return (
    <div className="max-w-sm w-full bg-white dark:bg-[#0E2439] rounded-lg shadow-md border border-gray-200 dark:border-white/10 p-4 md:p-6 relative transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between mb-3">
        <div className="flex items-center">
          <h5 className="text-xl font-bold text-gray-900 dark:text-gray-100 pe-1">
            {title}
          </h5>
          <div className="relative group">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer ml-1"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm0 16a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm1-5.034V12a1 1 0 0 1-2 0v-1.418a1 1 0 0 1 1.038-.999 1.436 1.436 0 0 0 1.488-1.441 1.501 1.501 0 1 0-3-.116.986.986 0 0 1-1.037.961 1 1 0 0 1-.96-1.037A3.5 3.5 0 1 1 11 11.466Z" />
            </svg>

            {/* Tooltip */}
            <div className="absolute hidden group-hover:block top-5 left-0 w-72 bg-white dark:bg-[#142E4D] border border-gray-200 dark:border-white/10 rounded-lg shadow-md p-3 z-10">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Report Growth - Incremental
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                {description}
              </p>
              <a
                href="#"
                className="flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 text-sm font-medium hover:underline"
              >
                Read more <IoIosArrowForward className="ml-1 text-xs" />
              </a>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={onDownload}
          className="hidden sm:flex items-center justify-center w-8 h-8 text-gray-500 dark:text-gray-400 hover:bg-blue-600/10 rounded-lg focus:outline-none transition"
        >
          <FiDownload className="text-lg" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex space-x-3 mb-4">
        {["all", "active", "pending", "completed"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border ${
              filter === status
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-transparent border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-blue-600/20 hover:text-blue-400"
            } transition`}
          >
            {status === "all"
              ? "All Reports"
              : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Data Overview */}
      <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-blue-600/10 rounded-md border border-blue-600/20">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-lg font-semibold text-blue-400">
            {loading ? "..." : reportsData.total== "[object Promise]" ? "..." : reportsData.total}
          </p>
        </div>
        <div className="p-3 bg-yellow-500/10 rounded-md border border-yellow-500/20">
          <p className="text-xs text-gray-400">Active</p>
          <p className="text-lg font-semibold text-yellow-400">
            {loading ? "..." : reportsData.active== "[object Promise]" ? "..." : reportsData.active}
          </p>
        </div>
        <div className="p-3 bg-green-500/10 rounded-md border border-green-500/20">
          <p className="text-xs text-gray-400">Completed</p>
          <p className="text-lg font-semibold text-green-400">
            {loading ? "..." : reportsData.completed== "[object Promise]" ? "..." : reportsData.completed}
          </p>
        </div>
      </div>

      {/* ✅ Dynamic Donut Chart */}
      <div className="py-6 flex justify-center items-center">
        {loading ? (
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            Loading chart...
          </p>
        ) : reportsData.total > 0 ? (
          <Chart
            options={chartData.options}
            series={chartData.series}
            type="donut"
            width="100%"
            height="240"
          />
        ) : (
          <p className="text-gray-400 dark:text-gray-500 text-sm">
            No reports to display
          </p>
        )}
      </div>
    </div>
  );
};

export default React.memo(TrafficCard);
