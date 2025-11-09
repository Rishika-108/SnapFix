import React, { useEffect, useState } from "react";
import { Loader2, MapPin, ClipboardList, Upload, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import  WorkerAPI  from "../../api/api";
import GigworkerNavbar from "../generalComponents/Navbars/GigworkerNavbar";

const TaskAssigned = ({ user }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [proofImage, setProofImage] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [uploading, setUploading] = useState(false);

  // ✅ Fetch assigned tasks
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const response = await WorkerAPI.getTaskDetail(user?._id); // adjust if backend uses /worker/tasks
        const { data } = response;

        if (data?.success) {
          setTasks(Array.isArray(data.tasks) ? data.tasks : [data.task]);
        } else {
          console.warn("⚠️ Failed to fetch tasks:", data?.message);
        }
      } catch (error) {
        console.error("❌ Error fetching assigned tasks:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) fetchTasks();
  }, [user?._id]);

  // ✅ Upload Proof
  const handleProofSubmit = async (e) => {
    e.preventDefault();
    if (!selectedTask || !proofImage) {
      alert("Please select a proof image and fill all fields.");
      return;
    }

    const formData = new FormData();
    formData.append("remarks", remarks);
    formData.append("latitude", "0");
    formData.append("longitude", "0");
    formData.append("file", proofImage);

    try {
      setUploading(true);
      const response = await WorkerAPI.uploadTaskProof(selectedTask._id, formData);
      const { data } = response;

      if (data.success) {
        alert("✅ Proof uploaded successfully!");
        setTasks((prev) =>
          prev.map((t) => (t._id === selectedTask._id ? data.task : t))
        );
        setSelectedTask(null);
        setProofImage(null);
        setRemarks("");
      } else {
        alert("⚠️ Failed to upload proof: " + data.message);
      }
    } catch (error) {
      console.error("❌ Error uploading proof:", error.message);
      alert("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <GigworkerNavbar />
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-6xl shadow-2xl">
          <h1 className="text-3xl font-bold mb-6 text-center">Assigned Tasks</h1>
          <p className="text-sm text-gray-300 mb-8 text-center">
            View all reports assigned to you and upload completion proof.
          </p>

          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="animate-spin text-indigo-400" size={28} />
              <span className="ml-3 text-gray-300">Loading your assigned tasks...</span>
            </div>
          ) : tasks.length === 0 ? (
            <div className="text-center text-gray-400 mt-10">
              <ClipboardList className="mx-auto mb-3 text-gray-500" size={32} />
              <p>No tasks assigned yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task) => (
                <div
                  key={task._id}
                  className="bg-white/10 border border-white/20 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
                >
                  {/* 🧾 Task Info */}
                  <div className="mb-3">
                    <h3 className="text-lg font-semibold text-white">
                      {task.reportId?.title || "Untitled Report"}
                    </h3>
                    <p className="text-gray-400 text-sm flex items-center">
                      <MapPin className="text-indigo-400 mr-1" size={16} />
                      {task.reportId?.locationName || "Location not specified"}
                    </p>
                  </div>

                  <p className="text-gray-300 text-sm mb-3 line-clamp-3">
                    {task.reportId?.description || "No description provided."}
                  </p>

                  <p className="text-sm text-gray-400 mb-2">
                    Assigned{" "}
                    <span className="text-indigo-300">
                      {formatDistanceToNow(new Date(task.createdAt || Date.now()), { addSuffix: true })}
                    </span>
                  </p>

                  {/* ⚙️ Task Status */}
                  <p className="text-sm mb-4">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        task.status === "Completed"
                          ? "text-green-400"
                          : task.status === "Proof Submitted"
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      {task.status}
                    </span>
                  </p>

                  {/* 📁 Proof Button */}
                  {task.status !== "Proof Submitted" && (
                    <button
                      onClick={() => setSelectedTask(task)}
                      className="w-full py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all transform hover:scale-105"
                    >
                      <Upload className="inline mr-2" size={18} />
                      Upload Proof
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 🖼️ Proof Upload Modal */}
          {selectedTask && (
            <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
              <div className="relative bg-gray-900 border border-white/20 rounded-3xl p-8 w-full max-w-lg shadow-2xl text-white">
                <button
                  onClick={() => setSelectedTask(null)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-white text-xl font-bold"
                >
                  ✕
                </button>

                <h2 className="text-2xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
                  Upload Proof
                </h2>

                <form onSubmit={handleProofSubmit} className="space-y-5">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setProofImage(e.target.files[0])}
                    className="w-full text-gray-300 text-sm bg-white/0 border border-white/30 rounded-xl px-3 py-2"
                    required
                  />

                  <textarea
                    rows="3"
                    placeholder="Add remarks..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full border border-white/30 bg-white/0 placeholder-gray-300 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition-all duration-300"
                  />

                  <button
                    type="submit"
                    disabled={uploading}
                    className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all transform hover:scale-105 ${
                      uploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {uploading ? "Uploading..." : "Submit Proof"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default TaskAssigned;
