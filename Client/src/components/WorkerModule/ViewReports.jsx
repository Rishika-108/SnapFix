import React, { useEffect, useState } from "react";
import { Loader2, MapPin, FileText, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { WorkerAPI } from "../../api/api";
import GigworkerNavbar from "../generalComponents/Navbars/GigworkerNavbar";
import PlaceBid from "./PlaceBid";

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBidModal, setShowBidModal] = useState(null); // report._id for modal
  const [user, setUser] = useState(null);

  // Get logged-in user from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Fetch nearby reports
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await WorkerAPI.getNearbyReports();
        const { data } = response;

        if (data?.success) {
          setReports(data.reports || []);
          console.log("Fetched reports:", data.reports);
        } else {
          console.warn("Failed to fetch reports:", data?.message);
        }
      } catch (error) {
        console.error("Error fetching nearby reports:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  return (
    <>
      <GigworkerNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-6xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Nearby Reports</h1>
          <p className="text-sm text-gray-300 mb-8 text-center">
            View issues reported near your location and place bids to work on them.
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-indigo-400" size={28} />
              <span className="ml-3 text-gray-300">Loading nearby reports...</span>
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <AlertCircle className="mx-auto mb-3 text-gray-500" size={32} />
              <p>No nearby reports found in your area.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reports.map((report) => (
                <div
                  key={report._id}
                  className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
                >
                  {/* Header */}
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      {report.title || "Untitled Report"}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      <MapPin className="inline mr-1 text-indigo-400" size={16} />
                      {report.locationName || "Location not specified"}
                    </p>
                    <p className="text-gray-400 text-sm">
                      Submitted{" "}
                      <span className="text-indigo-300">
                        {formatDistanceToNow(new Date(report.createdAt || Date.now()), {
                          addSuffix: true,
                        })}
                      </span>
                    </p>
                  </div>

                  {/* Image */}
                  {report.imageUrl && (
                    <img
                      src={report.imageUrl}
                      alt={report.title || "Report Image"}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                  )}

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                    {report.description || "No description provided."}
                  </p>

                  {/* Reported By */}
                  <p className="text-xs text-gray-400 mb-4">
                    Reported by:{" "}
                    <span className="text-indigo-400 font-medium">
                      {report.createdBy?.name || "Anonymous"}
                    </span>
                  </p>

                  {/* Status */}
                  <p className="text-sm mb-3">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        report.status === "resolved"
                          ? "text-green-400"
                          : report.status === "in_progress"
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      {report.status || "Pending"}
                    </span>
                  </p>

                  {/* Category */}
                  {report.category && (
                    <p className="text-sm text-gray-300 mb-4">
                      Category: <span className="text-indigo-400">{report.category}</span>
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/10">
                    <div className="flex items-center text-sm text-gray-400">
                      <FileText className="mr-2 text-indigo-400" size={16} />
                      {report._id.slice(-6)}
                    </div>

                    {/* Place Bid Button */}
                    {user?.role === "gigworker" && (
                      <button
                        onClick={() => setShowBidModal(report._id)}
                        className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm shadow-md transition-all"
                      >
                        Place Bid
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PlaceBid Modal */}
          {showBidModal && user && (
            <PlaceBid
              reportId={showBidModal}
              gigId={user._id}
              onClose={() => setShowBidModal(null)}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default ViewReports;
