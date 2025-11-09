// import React, { useEffect, useState } from "react";

// // ===== Layout Components =====
// import GovernmentSidebar from "../components/generalComponents/GovernmentSidebar";
// import Topbar from "../components/adminModule/Topbar";

// // ===== Dashboard Components =====
// import InsightCard from "../components/adminModule/InsightCard";
// import AreaPerformanceMap from "../components/adminModule/AreaPerformanceMap";
// import DashboardHeader from "../components/adminModule/DashboardHeader";
// import Heatmap from "../components/adminModule/heatmapModule/Heatmap";
// import Footer from "../components/generalComponents/Footer";
// import TrafficCard from "../components/adminModule/TrafficCard";

// // ===== API Utilities =====
// import { getReportStats } from "../api/handleReports";

// const Dashboard = () => {
//   const [stats, setStats] = useState({
//     total: 0,
//     active: 0,
//     pending: 0,
//     completed: 0,
//   });
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     let isMounted = true;
//     const fetchStats = async () => {
//       setLoading(true);
//       try {
//         const data = await getReportStats();
//         if (isMounted) setStats(data);
//       } catch (err) {
//         console.error("Error fetching dashboard stats:", err);
//       } finally {
//         if (isMounted) setLoading(false);
//       }
//     };

//     fetchStats();
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   return (
//     <div
//       className="min-h-screen flex bg-linear-to-br from-[#0B1725] via-[#0E2439] to-[#142E4D] 
//                  text-gray-100 transition-all duration-300"
//     >
//       {/* ===== Fixed Sidebar ===== */}
//       <GovernmentSidebar />

//       {/* ===== Main Content Wrapper ===== */}
//       <div className="flex-1 flex flex-col ml-64 overflow-hidden">
//         {/* ===== Top Navigation ===== */}
//         <Topbar />

//         {/* ===== Main Dashboard Section ===== */}
//         <main className="flex-1 p-8 overflow-y-auto space-y-8">
//           {/* Header */}
//           <DashboardHeader
//             title="Government Dashboard"
//             subtitle="Civic Issue Reporting Overview"
//           />

//           {/* Insight Cards */}
//           <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
//             <InsightCard
//               title="Total Reports"
//               value={loading ? "8" : stats.total}
//               change={stats.total ? 4.62 : 0}
//             />
//             <InsightCard
//               title="Pending Issues"
//               value={loading ? "7" : getReportStats("p")}
//               change={stats.pending ? 1.25 : 0}
//             />
//             <InsightCard
//               title="Active Issues"
//               value={loading ? "6" : getReportStats("inprogress")}
//               change={stats.active ? 2.01 : 0}
//             />
//             <InsightCard
//               title="Issues Resolved"
//               value={loading ? "1" : getReportStats("completed")}
//               change={stats.completed ? -3.14 : 0}
//             />
//           </section>

//           {/* Charts Section */}
//           <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* Left (Heatmap / Chart) */}
//             <div
//               className="col-span-2 bg-[#0E2439]/60 backdrop-blur-xl border border-white/10 
//                          rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.3)] 
//                          hover:shadow-[0_0_25px_rgba(62,168,255,0.25)] transition-all duration-300"
//             >
//               <h2 className="text-md font-semibold text-gray-200 mb-4">
//                 Issue Reporting Trends
//               </h2>
//               <Heatmap />
//             </div>

//             {/* Right (Traffic Card) */}
//             <div
//               className="bg-[#0E2439]/60 backdrop-blur-xl border border-white/10 
//                          rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.3)] 
//                          hover:shadow-[0_0_25px_rgba(62,168,255,0.25)] transition-all duration-300"
//             >
//               <TrafficCard />
//             </div>
//           </section>
//         </main>

//         <Footer />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;

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

const Dashboard = () => {
  // ===== Dummy Data =====
  const dummyStats = {
    total: 120,
    active: 35,
    pending: 50,
    completed: 35,
  };

  const [stats, setStats] = useState(dummyStats);
  const [loading, setLoading] = useState(false);

  // Optional: simulate loading
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setStats(dummyStats); // in real scenario, you'd fetch API here
      setLoading(false);
    }, 1000); // 1s delay to simulate API call
    return () => clearTimeout(timer);
  }, []);

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
              <h2 className="text-md font-semibold text-gray-200 mb-4">
                Issue Reporting Trends
              </h2>
              <Heatmap />
            </div>

            <div
              className="bg-[#0E2439]/60 backdrop-blur-xl border border-white/10 
                         rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.3)] 
                         hover:shadow-[0_0_25px_rgba(62,168,255,0.25)] transition-all duration-300"
            >
              <TrafficCard />
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
