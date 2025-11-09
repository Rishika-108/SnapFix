// import React from "react";
import { Link } from "react-router-dom";

const GigWorkerLanding = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col">

      {/* ================= Hero Section ================= */}
      <section className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-20 py-16">
        {/* Left Column */}
        <div className="md:w-1/2 space-y-6">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Earn on Your Schedule
          </h1>
          <p className="text-gray-300 text-lg md:text-xl">
            Connect with citizens reporting issues nearby. Place bids, get work, and earn as a gig worker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link
              to="/gigworker/feed"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold shadow-lg transition-all text-center"
            >
              View Reports
            </Link>
            <Link
              to="/gigworker/current-work"
              className="px-6 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 font-semibold shadow-lg transition-all text-center"
            >
              My Tasks
            </Link>
          </div>
        </div>

        {/* Right Column: Icon Cards */}
    {/* Right Column: Classy Icon Cards */}
<div className="md:w-1/2 flex flex-col gap-6 mb-10 md:mb-0">
  <div className="flex items-center bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm hover:shadow-lg transition-shadow">
    <div className="text-4xl mr-4">💼</div>
    <p className="text-white font-medium text-lg">
      Pick gigs that fit your schedule.
    </p>
  </div>
  <div className="flex items-center bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm hover:shadow-lg transition-shadow">
    <div className="text-4xl mr-4">⚡</div>
    <p className="text-white font-medium text-lg">
      Get paid instantly for every completed task.
    </p>
  </div>
  <div className="flex items-center bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-sm hover:shadow-lg transition-shadow">
    <div className="text-4xl mr-4">🌍</div>
    <p className="text-white font-medium text-lg">
      Make a real impact in your local community.
    </p>
  </div>
</div>

      </section>

      {/* ================= Features Section ================= */}
      <section className="px-6 md:px-20 py-16 bg-white/10 backdrop-blur-xl border-t border-white/20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Why Join as a Gig Worker?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/10 p-6 rounded-2xl text-center shadow-md hover:shadow-xl transition-all">
            <h3 className="text-xl font-semibold mb-2">Flexible Work</h3>
            <p className="text-gray-300">
              Choose jobs that fit your schedule and work on your terms.
            </p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl text-center shadow-md hover:shadow-xl transition-all">
            <h3 className="text-xl font-semibold mb-2">Instant Earnings</h3>
            <p className="text-gray-300">
              Get paid promptly for tasks you complete. No delays, no hassle.
            </p>
          </div>
          <div className="bg-white/10 p-6 rounded-2xl text-center shadow-md hover:shadow-xl transition-all">
            <h3 className="text-xl font-semibold mb-2">Local Impact</h3>
            <p className="text-gray-300">
              Solve problems in your community and make a real difference.
            </p>
          </div>
        </div>
      </section>

      {/* ================= Call-to-Action Section ================= */}
      <section className="px-6 md:px-20 py-16 flex flex-col items-center text-center bg-indigo-600 rounded-t-3xl mt-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-100 mb-6">
          Sign up as a gig worker today and start earning by helping your community.
        </p>
        <Link
          to="/gigworker/feed"
          className="px-8 py-4 rounded-xl bg-white text-indigo-600 font-semibold shadow-lg hover:shadow-2xl transition-all"
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
