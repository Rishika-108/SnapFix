import React, { useState, useEffect } from "react";

// ===== Layout Components =====
import GovernmentSidebar from "../components/generalComponents/GovernmentSidebar";
import Topbar from "../components/adminModule/Topbar";
import Footer from "../components/generalComponents/Footer";
import Table from "../components/allocationModule/Table";
import api from "../api/api";
import { Loader2 } from "lucide-react";

const FundRelease = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCompletedTasks = async () => {
    try {
      setLoading(true);
      const data = await api.getCompletedTasks();
      if (data.success) {
        setCompletedTasks(data.tasks);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch completed tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompletedTasks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B1725] text-white">
        <Loader2 className="animate-spin mr-3" size={32} />
        <span className="text-xl">Loading Projects for Fund Release...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-[#0B1725] via-[#0E2439] to-[#142E4D] text-gray-100">
      {/* Sidebar */}
      <GovernmentSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64">
        <Topbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 md:px-8 md:py-8">
          {/* Horizontal scroll for table on mobile */}
          <div className="overflow-x-auto">
            <Table completedTasks={completedTasks} onRefresh={fetchCompletedTasks} />
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default FundRelease;

