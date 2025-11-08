import React, { useState, useEffect } from "react";
import { WorkerAPI, AdminAPI, CitizenAPI } from "../../api/api"; // ✅ Integrated API
import Bid from "../biddingModule/Bid";
import Assign from "../allocationModule/Assign"; // placeholder for future

const BidSection = ({ report, user }) => {
  const [bidCount, setBidCount] = useState(0);
  const [showBidModal, setShowBidModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // ✅ Fetch total bids for this report using WorkerAPI or CitizenAPI
  useEffect(() => {
    const fetchBidCount = async () => {
      try {
        if (!report?._id) return;

        const response = await WorkerAPI.getBidsForReport(report._id);
        const { data } = response;

        if (data?.success) {
          setBidCount(data.bids?.length || 0);
        } else {
          console.warn("⚠️ Failed to fetch bids:", data?.message);
        }
      } catch (err) {
        console.error("❌ Error fetching bid count:", err.message);
      }
    };

    fetchBidCount();
  }, [report?._id]);

  if (!user?.role) return null;

  return (
    <div className="flex items-center gap-4">
      {/* ✅ GIG WORKER SECTION */}
      {user.role === "gigworker" && (
        <>
          <button
            onClick={() => setShowBidModal(true)}
            className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm shadow-md transition-all"
          >
            Bid Now
          </button>

          {/* ✅ Modal Render */}
          {showBidModal && (
            <Bid
              reportId={report?._id}
              gigId={user?._id}
              onCancel={() => setShowBidModal(false)}
            />
          )}
        </>
      )}

      {/* ✅ GOVERNMENT SECTION */}
      {user.role === "government" && (
        <>
          <button
            onClick={() => setShowAssignModal(true)}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm shadow-md transition-all"
          >
            Assign
          </button>

          {/* Modal placeholder */}
          {showAssignModal && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
              <div className="relative bg-white/10 p-6 rounded-2xl border border-white/20 text-white">
                <button
                  onClick={() => setShowAssignModal(false)}
                  className="absolute top-2 right-3 text-white text-lg"
                >
                  ✕
                </button>
                <p className="text-center text-gray-300 mb-3">
                  Assign module coming soon...
                </p>
                <Assign
                  reportId={report?._id}
                  onClose={() => setShowAssignModal(false)}
                />
              </div>
            </div>
          )}
        </>
      )}

      {/* ✅ CITIZEN SECTION */}
      {user.role === "citizen" && (
        <p className="text-gray-400 text-sm">Bids: {bidCount}</p>
      )}
    </div>
  );
};

export default BidSection;
