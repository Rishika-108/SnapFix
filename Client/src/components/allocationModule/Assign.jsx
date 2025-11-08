import React, { useEffect, useState } from "react";
import { WorkerAPI, AdminAPI } from "../../api/api"; // ✅ Integrated hybrid API system

const Assign = ({ reportId, onClose }) => {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [assigningId, setAssigningId] = useState(null);

  // ✅ Fetch all bids for this report
  useEffect(() => {
    const fetchBids = async () => {
      try {
        const response = await WorkerAPI.getBidsForReport(reportId);
        const { data } = response;

        if (data?.success) {
          setBids(data.bids || []);
        } else {
          console.warn("⚠️ Failed to fetch bids:", data?.message);
          setBids([]);
        }
      } catch (error) {
        console.error("❌ Error fetching bids:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (reportId) fetchBids();
  }, [reportId]);

  // ✅ Assign a gig worker to a task (through AdminAPI)
  const handleAssign = async (bid) => {
    try {
      setAssigningId(bid._id);

      const response = await AdminAPI.approveBid(bid._id);
      const { data } = response;

      if (data?.success) {
        alert("✅ Task successfully assigned!");
        onClose?.();
      } else {
        alert("⚠️ Failed to assign task: " + data?.message);
      }
    } catch (error) {
      console.error("❌ Assignment failed:", error.message);
      alert(error.message || "Failed to assign task.");
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-full max-w-4xl shadow-2xl max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold text-center mb-6 text-white">
        Assign a Gig Worker
      </h2>

      {/* Loading State */}
      {loading ? (
        <p className="text-gray-300 text-center">Loading bids...</p>
      ) : bids.length === 0 ? (
        <p className="text-gray-400 text-center">No bids available yet.</p>
      ) : (
        <div className="space-y-4">
          {bids.map((bid) => (
            <div
              key={bid._id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/10 border border-white/20 rounded-xl p-4 hover:bg-white/20 transition-all"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-white">
                  Budget: ₹{bid.bidAmount}
                </h3>
                <p className="text-gray-300 text-sm mt-1">
                  Duration: <span className="text-white">{bid.duration}</span>
                </p>
                {bid.resourceNote && (
                  <p className="text-gray-300 text-sm mt-1">
                    Description:{" "}
                    <span className="text-white italic">
                      {bid.resourceNote}
                    </span>
                  </p>
                )}
                <div className="flex gap-4 mt-2 text-sm text-gray-300">
                  <p>
                    Worker:{" "}
                    <span className="text-white">
                      {bid.gigWorkerId?.name || "Unnamed Worker"}
                    </span>
                  </p>
                  <p>
                    Rating: <span className="text-yellow-400">⭐ 4.7</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleAssign(bid)}
                disabled={assigningId === bid._id}
                className={`px-4 py-2 rounded-lg text-white font-semibold shadow-md transition-all ${
                  assigningId === bid._id
                    ? "bg-gray-500 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-500 hover:scale-105"
                }`}
              >
                {assigningId === bid._id ? "Assigning..." : "Assign Task"}
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-6">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white shadow-md transition-all"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Assign;
