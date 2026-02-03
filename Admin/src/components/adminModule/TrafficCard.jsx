import React, { useState, useEffect, useMemo } from "react";
import { FiDownload } from "react-icons/fi";
import { IoIosArrowForward } from "react-icons/io";
import Chart from "react-apexcharts";

const CATEGORIES = [
  "All Reports",
  "Roads & Transportation",
  "Water & Sewerage",
  "Garbage & Sanitation",
  "Streetlights & Electricity",
  "Public Health",
  "Traffic & Parking",
  "Urban Planning",
  "Public Safety",
  "Other",
];

const TrafficCard = ({
  title = "Reports Overview",
  reports = [],
  loading = false,
  onDownload = () => {},
}) => {
  const [filter, setFilter] = useState("All Reports");
  const [reportsData, setReportsData] = useState({
    total: 0,
    active: 0,
    pending: 0,
    completed: 0,
  });

  // ✅ Category-based filtering + status aggregation
  useEffect(() => {
    if (!Array.isArray(reports)) return;

    const filteredReports =
      filter === "All Reports"
        ? reports
        : reports.filter((r) => r.category === filter);

    let active = 0;
    let pending = 0;
    let completed = 0;

    filteredReports.forEach((r) => {
      if (r.status === "In Progress") active++;
      else if (r.status === "Pending") pending++;
      else if (r.status === "Completed") completed++;
    });

    setReportsData({
      total: filteredReports.length,
      active,
      pending,
      completed,
    });
  }, [reports, filter]);

  // ✅ Chart config (unchanged)
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
        colors: ["#FACC15", "#3B82F6", "#10B981"],
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
        theme: { mode: "dark" },
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
        </div>

        <button
          onClick={onDownload}
          className="hidden sm:flex items-center justify-center w-8 h-8 text-gray-500 dark:text-gray-400 hover:bg-blue-600/10 rounded-lg focus:outline-none transition"
        >
          <FiDownload className="text-lg" />
        </button>
      </div>

      {/* 🔥 Category Filters (ONLY CHANGE) */}
      <div className="flex flex-wrap gap-2 mb-4">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setFilter(category)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md border ${
              filter === category
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-transparent border-gray-300 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-blue-600/20 hover:text-blue-400"
            } transition`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Data Overview */}
      {/* <div className="grid grid-cols-3 gap-3 text-center">
        <div className="p-3 bg-blue-600/10 rounded-md border border-blue-600/20">
          <p className="text-xs text-gray-400">Total</p>
          <p className="text-lg font-semibold text-blue-400">
            {loading ? "..." : reportsData.total}
          </p>
        </div>
        <div className="p-3 bg-yellow-500/10 rounded-md border border-yellow-500/20">
          <p className="text-xs text-gray-400">Active</p>
          <p className="text-lg font-semibold text-yellow-400">
            {loading ? "..." : reportsData.active}
          </p>
        </div>
        <div className="p-3 bg-green-500/10 rounded-md border border-green-500/20">
          <p className="text-xs text-gray-400">Completed</p>
          <p className="text-lg font-semibold text-green-400">
            {loading ? "..." : reportsData.completed}
          </p>
        </div>
      </div> */}

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
