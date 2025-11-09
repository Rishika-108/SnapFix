import React, { useState } from "react";
import { Loader2, Upload } from "lucide-react";
import  WorkerAPI  from "../../api/api";

const UploadProof = ({ taskId, onCancel, onSuccess }) => {
  const [proofImage, setProofImage] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [uploading, setUploading] = useState(false);

  // ✅ Optional: auto-fill current coordinates
  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported in your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLatitude(pos.coords.latitude.toString());
        setLongitude(pos.coords.longitude.toString());
      },
      () => alert("Failed to retrieve location.")
    );
  };

  // ✅ Upload proof
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!proofImage || !latitude || !longitude) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    const formData = new FormData();
    formData.append("remarks", remarks);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("file", proofImage);

    try {
      setUploading(true);
      const response = await WorkerAPI.uploadTaskProof(taskId, formData);
      const { data } = response;

      if (data.success) {
        alert("✅ Proof uploaded successfully!");
        if (onSuccess) onSuccess(data.task);
        if (onCancel) onCancel();
      } else {
        alert("⚠️ " + (data.message || "Upload failed."));
      }
    } catch (error) {
      console.error("❌ Upload error:", error.message);
      alert("Failed to upload proof. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative bg-gray-900 border border-white/20 rounded-3xl p-8 w-full max-w-lg shadow-2xl text-white">
        {/* ✖️ Close Button */}
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 text-gray-300 hover:text-white text-xl font-bold"
          >
            ✕
          </button>
        )}

        <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Upload Proof of Work
        </h2>
        <p className="text-sm text-gray-300 mb-6 text-center">
          Upload an image of your completed work, add remarks, and confirm your location.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 📸 File Input */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProofImage(e.target.files[0])}
            className="w-full border border-white/30 bg-white/0 placeholder-gray-300 px-4 py-3 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer transition-all"
            required
          />

          {/* 📝 Remarks */}
          <textarea
            rows="3"
            placeholder="Add remarks about your work..."
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            className="w-full border border-white/30 bg-white/0 placeholder-gray-300 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none transition-all duration-300"
          />

          {/* 📍 Location Inputs */}
          <div className="grid grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Latitude"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className="border border-white/30 bg-white/0 placeholder-gray-300 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
              required
            />
            <input
              type="text"
              placeholder="Longitude"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className="border border-white/30 bg-white/0 placeholder-gray-300 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
              required
            />
          </div>

          <button
            type="button"
            onClick={handleAutoLocation}
            className="w-full text-sm text-indigo-300 hover:text-indigo-200 underline mb-2"
          >
            Use current location
          </button>

          {/* 🔘 Action Buttons */}
          <div className="flex justify-between items-center gap-4">
            <button
              type="submit"
              disabled={uploading}
              className={`flex-1 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all transform hover:scale-105 ${
                uploading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {uploading ? (
                <span className="flex justify-center items-center gap-2">
                  <Loader2 className="animate-spin" size={18} /> Uploading...
                </span>
              ) : (
                <span className="flex justify-center items-center gap-2">
                  <Upload size={18} /> Submit Proof
                </span>
              )}
            </button>

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="px-5 py-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition-all font-medium text-white shadow-md"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadProof;
