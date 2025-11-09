// import React, { useState } from "react";
// import { WorkerAPI } from "../../api/api";

// const PlaceBid = ({ reportId, gigId, onClose }) => {
//   const [bidAmount, setBidAmount] = useState("");
//   const [resourceNote, setResourceNote] = useState("");
//   const [duration, setDuration] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [successMsg, setSuccessMsg] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccessMsg("");

//     try {
//       const response = await WorkerAPI.createBid(reportId, {
//         bidAmount,
//         resourceNote,
//         duration,
//       });

//       const { data } = response;
//       if (!data.success) throw new Error(data.message);

//       setSuccessMsg("✅ Bid submitted successfully!");
//       setBidAmount("");
//       setResourceNote("");
//       setDuration("");

//       setTimeout(() => onClose && onClose(), 1500);
//     } catch (err) {
//       setError(err.message || "Failed to submit bid");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
//       <div className="bg-gray-900 text-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
//         {/* Close Button */}
//         <button
//           onClick={onClose}
//           className="absolute top-3 right-3 text-white text-xl font-bold hover:text-red-400 transition"
//         >
//           ✕
//         </button>

//         <h2 className="text-2xl font-bold mb-4 text-center text-indigo-400">
//           Place Your Bid
//         </h2>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Bid Amount</label>
//             <input
//               type="number"
//               value={bidAmount}
//               onChange={(e) => setBidAmount(e.target.value)}
//               placeholder="Enter your bid amount"
//               required
//               className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Resource Note</label>
//             <textarea
//               value={resourceNote}
//               onChange={(e) => setResourceNote(e.target.value)}
//               placeholder="Describe resources or notes"
//               className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
//               rows={3}
//             />
//           </div>

//           <div>
//             <label className="block text-sm text-gray-300 mb-1">Duration (days)</label>
//             <input
//               type="number"
//               value={duration}
//               onChange={(e) => setDuration(e.target.value)}
//               placeholder="Estimated duration in days"
//               required
//               className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
//             />
//           </div>

//           {error && <p className="text-red-400 text-sm">{error}</p>}
//           {successMsg && <p className="text-green-400 text-sm">{successMsg}</p>}

//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-2.5 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all transform hover:scale-105 ${
//               loading ? "opacity-60 cursor-not-allowed" : ""
//             }`}
//           >
//             {loading ? "Submitting..." : "Submit Bid"}
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PlaceBid;

import React, { useState } from "react";
import { WorkerAPI } from "../../api/api";

const PlaceBid = ({ reportId, gigId, onClose }) => {
  const [bidAmount, setBidAmount] = useState("");
  const [resourceNote, setResourceNote] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      // Call backend API
      const response = await WorkerAPI.createBid(reportId, {
        bidAmount,
        resourceNote,
        duration,
      });

      const { data } = response;

      if (!data.success) throw new Error(data.message);

      setSuccessMsg("✅ Bid submitted successfully!");
      setBidAmount("");
      setResourceNote("");
      setDuration("");

      // Close modal after short delay
      setTimeout(() => onClose && onClose(), 1500);
    } catch (err) {
      setError(err.message || "Failed to submit bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 text-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-white text-xl font-bold hover:text-red-400 transition"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-400">
          Place Your Bid
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Bid Amount</label>
            <input
              type="number"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              placeholder="Enter your bid amount"
              required
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Resource Note</label>
            <textarea
              value={resourceNote}
              onChange={(e) => setResourceNote(e.target.value)}
              placeholder="Describe resources or notes"
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Duration (days)</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="Estimated duration in days"
              required
              className="w-full px-3 py-2 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-gray-400"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {successMsg && <p className="text-green-400 text-sm">{successMsg}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all transform hover:scale-105 ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Submitting..." : "Submit Bid"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PlaceBid;
