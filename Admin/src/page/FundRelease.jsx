import React, { useEffect, useState } from "react";

// ===== Layout Components =====
import GovernmentSidebar from "../components/generalComponents/GovernmentSidebar";
import Topbar from "../components/adminModule/Topbar";
import Footer from "../components/generalComponents/Footer";
import Table from "../components/allocationModule/Table"


const FundRelease = () => {

  const completedTasks = [
  {
    id: 1,
    rating: 4.8,
    bidAmount: 120000,
    gigName: "Public Works - Road Repair",
    title: "District Highway Maintenance",
    description:
      "Completed resurfacing and drainage work for the 3.4 km district highway section under PMGSY Phase II. All safety markings applied.",
    duration: "14 Days",
  },
  {
    id: 2,
    rating: 5.0,
    bidAmount: 95000,
    gigName: "IT Department - Data Entry",
    title: "Citizen Database Digitization",
    description:
      "Digitized and verified over 20,000 citizen records for e-Governance integration. Accuracy validated by QA audit.",
    duration: "10 Days",
  },
  {
    id: 3,
    rating: 4.6,
    bidAmount: 78000,
    gigName: "Health Department - Survey Work",
    title: "Public Health Facility Audit",
    description:
      "Conducted field inspection and compiled health infrastructure data for 42 rural clinics under Ayushman Bharat.",
    duration: "12 Days",
  },
  {
    id: 4,
    rating: 4.9,
    bidAmount: 145000,
    gigName: "Education Department - Infrastructure",
    title: "School Roof Renovation Project",
    description:
      "Completed structural repairs and roof waterproofing for 5 government schools in Zone B.",
    duration: "20 Days",
  },
  {
    id: 5,
    rating: 4.7,
    bidAmount: 88000,
    gigName: "Transport Department - Vehicle Tracking",
    title: "GPS Installation and Testing",
    description:
      "Installed GPS units in 100 public buses and verified data integration with the state monitoring dashboard.",
    duration: "9 Days",
  },
];
  

  return (
    <div className="bg-slate-50 text-gray-900 min-h-screen flex">
      {/* ===== Fixed Sidebar ===== */}
      <GovernmentSidebar />

      {/* ===== Main Content Wrapper ===== */}
      <div className="flex-1 flex flex-col ml-64 overflow-hidden">
        {/* Top Navigation */}
        <Topbar />
        <Table  completedTasks={completedTasks}/>
        <Footer />
      </div>
    </div>
  );
};

export default FundRelease;
