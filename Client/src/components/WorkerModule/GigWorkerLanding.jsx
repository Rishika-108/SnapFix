import React, { useEffect, useState } from "react";
import  WorkerAPI  from "../../api/api";
// existing imports remain unchanged

import { FaBriefcase, FaBolt, FaGlobe } from "react-icons/fa";

const features = [
  {
    icon: <FaBriefcase />,
    title: "Flexible Work",
    desc: "Choose jobs that fit your schedule and work on your terms.",
    color: "from-indigo-400 to-purple-500",
  },
  {
    icon: <FaBolt />,
    title: "Instant Earnings",
    desc: "Get paid promptly for tasks you complete. No delays, no hassle.",
    color: "from-yellow-400 to-orange-500",
  },
  {
    icon: <FaGlobe />,
    title: "Local Impact",
    desc: "Solve problems in your community and make a real difference.",
    color: "from-green-400 to-teal-500",
  },
];

const GigWorkerLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white flex flex-col">

      {/* ================= Hero Section ================= */}
      <section className="flex flex-col items-center justify-center text-center px-6 md:px-20 py-32 space-y-6">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent leading-tight animate-gradient">
          Earn on Your Schedule
        </h1>
        <p className="text-gray-300 text-lg md:text-xl max-w-2xl">
          Connect with local citizens reporting issues. Place bids, get work, and earn as a gig worker.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Link
            to="/gigworker/feed"
            className="px-8 py-4 rounded-full bg-indigo-600 hover:bg-indigo-500 font-semibold shadow-lg transition-all"
          >
            View Reports
          </Link>
          <Link
            to="/gigworker/current-work"
            className="px-8 py-4 rounded-full bg-gray-700 hover:bg-gray-600 font-semibold shadow-lg transition-all"
          >
            My Tasks
          </Link>
        </div>
      </section>

      {/* ================= Features Section ================= */}
      <section className="px-6 md:px-20 py-20 bg-white/5 backdrop-blur-xl border-t border-white/20">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-12">
          Why Join as a Gig Worker?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center text-center p-8 rounded-3xl bg-white/10 backdrop-blur-lg border border-white/20 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
            >
              <div
                className={`w-16 h-16 md:w-20 md:h-20 flex items-center justify-center rounded-full bg-gradient-to-r ${feature.color} text-white text-2xl md:text-3xl mb-4 shadow-md`}
              >
                {feature.icon}
              </div>
              <h3 className="text-xl md:text-2xl font-semibold mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= Call-to-Action Section ================= */}
      <section className="px-6 md:px-20 py-20 flex flex-col items-center text-center bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-t-3xl mt-16 shadow-xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-100 mb-8 max-w-xl">
          Sign up as a gig worker today and start earning by helping your community.
        </p>
        <Link
          to="/gigworker/feed"
          className="px-10 py-4 rounded-full bg-white text-indigo-600 font-semibold shadow-2xl hover:shadow-3xl transition-all"
        >
          Start Working
        </Link>
      </section>

      {/* ================= Footer ================= */}
      <footer className="mt-auto py-6 text-center text-gray-400 text-sm border-t border-white/20">
        &copy; {new Date().getFullYear()} SnapFix. All rights reserved.
      </footer>
    </div>
  );
};

export default GigWorkerLanding;
