import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { getReportWithBids, assignBid } from "../../api/bids";

const BidSection = ({ report, user, token }) => {
  const [bidCount, setBidCount] = useState(0);
  const [bids, setBids] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);

  const demo = true;
  if (demo) {
    useEffect(() => {
      if (report?.bids?.length > 0) {
        setBids(report.bids);
        setBidCount(report.bids.length);
      }
    }, [report, token]);
  } else {
    useEffect(() => {
      const fetchBids = async () => {
        try {
          if (!report?._id) return;
          setLoading(true);
          const data = await getReportWithBids(report._id, token);
          if (data?.success) {
            setBids(data.getBids || []);
            setBidCount(data.getBids?.length || 0);
          }
        } catch (err) {
          console.error("❌ Error fetching bids:", err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBids();
    }, [report?._id, token]);
  }

  const handleAssignBid = async () => {
    try {
      setAssigning(true);
      const response = await assignBid(token);
      if (response?.success) {
        alert("✅ " + response.message);
        setShowAssignModal(false);
      } else {
        alert("⚠️ Failed to assign bid. Please try again.");
      }
    } catch (err) {
      alert("❌ Error assigning bid: " + err.message);
    } finally {
      setAssigning(false);
    }
  };

  const modalContent = showAssignModal && (
    <div className="fixed inset-0 z-9999 flex justify-center items-center bg-black/70 backdrop-blur-md">
      <div
        className="relative bg-[#0E2439]/95 backdrop-blur-xl text-gray-100 
                    p-6 rounded-2xl border border-white/10 
                    shadow-[0_0_35px_rgba(62,168,255,0.25)] 
                    w-[90%] max-w-5xl animate-fadeInUp overflow-hidden"
      >
        <button
          onClick={() => setShowAssignModal(false)}
          className="absolute top-3 right-4 text-gray-300 hover:text-[#3EA8FF] text-xl font-bold transition-all"
        >
          ✕
        </button>

        <h2 className="text-2xl font-semibold mb-6 text-center bg-linear-to-r from-[#3EA8FF] to-[#2B7AC7] bg-clip-text text-transparent tracking-wide">
          Bids for Report: {report?.title || "N/A"}
        </h2>

        {loading ? (
          <p className="text-center text-gray-400">Loading bids...</p>
        ) : bids.length > 0 ? (
          <div className="overflow-x-auto max-h-[70vh] rounded-xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-[#132F4A]/80 text-gray-300 uppercase text-xs tracking-wider sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left border-b border-white/10">Worker</th>
                  <th className="px-4 py-3 text-left border-b border-white/10">Email</th>
                  <th className="px-4 py-3 text-left border-b border-white/10">Bid Amount</th>
                  <th className="px-4 py-3 text-left border-b border-white/10">Duration</th>
                  <th className="px-4 py-3 text-center border-b border-white/10">Action</th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid) => (
                  <tr
                    key={bid._id}
                    className="hover:bg-[#1B3D5A]/50 transition-all border-b border-white/5"
                  >
                    <td className="px-4 py-3 font-medium text-gray-100">
                      {bid.gigWorkerId?.name || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-gray-400">
                      {bid.gigWorkerId?.email || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">
                      ₹{bid.bidAmount}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{bid.duration} days</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={handleAssignBid}
                        disabled={assigning}
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold 
                          transition-all duration-200 shadow-sm ${
                            assigning
                              ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                              : "bg-linear-to-r from-emerald-500 to-teal-500 text-white hover:scale-[1.05] hover:shadow-[0_0_12px_rgba(52,211,153,0.3)]"
                          }`}
                      >
                        {assigning ? "Assigning..." : "Assign Bid"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-gray-400 mt-4">
            No bids have been submitted yet.
          </p>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowAssignModal(true)}
          className="px-4 py-1.5 rounded-lg 
                     bg-linear-to-r from-[#3EA8FF] to-[#2B7AC7] 
                     hover:from-[#4DB3FF] hover:to-[#338CE0] 
                     text-white text-sm font-medium shadow-[0_0_10px_rgba(62,168,255,0.25)] 
                     transition-all duration-200 hover:scale-[1.03]"
        >
          View Bids ({bidCount})
        </button>
      </div>

      {/* ✅ Render modal via portal */}
      {showAssignModal && ReactDOM.createPortal(modalContent, document.body)}
    </>
  );
};

export default BidSection;
