import React, { useEffect, useState } from "react";
import { WorkerAPI } from "../../api/api";
import { User, Mail, MapPin, Loader2, Briefcase, Clock, Star } from "lucide-react";

const ViewProfile = () => {
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch worker profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await WorkerAPI.getProfile();
        const { data } = response;

        if (data.success) {
          setWorker(data.worker);
        } else {
          console.warn("⚠️ Failed to fetch profile:", data.message);
        }
      } catch (error) {
        console.error("❌ Error fetching profile:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-400">
        <Loader2 className="animate-spin mr-2" /> Loading profile...
      </div>
    );

  if (!worker)
    return (
      <div className="text-center text-gray-400 p-6">
        Could not load profile details.
      </div>
    );

  const { name, email, location, skills, createdAt, role, rating, completedTasks, walletBalance, approvedStatus, phone } = worker;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white p-6">
      <div className="bg-gray-900/70 border border-white/20 backdrop-blur-xl rounded-3xl shadow-2xl w-full max-w-3xl p-8">
        <h1 className="text-4xl font-bold mb-6 text-center bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          My Profile
        </h1>

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          {/* Profile Card */}
          <div className="flex flex-col items-center md:items-start gap-4 flex-1">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full w-24 h-24 flex justify-center items-center text-3xl font-bold shadow-lg">
              {name?.[0]?.toUpperCase() || "?"}
            </div>
            <div>
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <User size={20} /> {name || "Unnamed Worker"}
              </h2>
              <p className="flex items-center gap-2 text-gray-300 mt-1">
                <Mail size={18} /> {email || "No email"}
              </p>
              <p className="flex items-center gap-2 text-gray-300 mt-1">
                <MapPin size={18} />{" "}
                {location?.coordinates
                  ? `Lat: ${location.coordinates[1]}, Lon: ${location.coordinates[0]}`
                  : "Location not set"}
              </p>
              <p className="flex items-center gap-2 text-gray-300 mt-1">
                <span>📞</span> {phone || "No phone"}
              </p>
              <p className="flex items-center gap-2 text-gray-400 mt-1">
                <Clock size={18} /> Joined {new Date(createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Stats Card */}
          <div className="flex-1 bg-gray-800/50 rounded-2xl p-6 border border-white/10">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Briefcase size={20} /> Worker Details
            </h3>

            <ul className="space-y-3 text-gray-300">
              <li>
                <span className="font-medium text-indigo-400">Role:</span> {role || "Gig Worker"}
              </li>
              <li>
                <span className="font-medium text-indigo-400">Skills:</span>{" "}
                {skills?.length ? skills.join(", ") : "No skills added"}
              </li>
              <li>
                <span className="font-medium text-indigo-400">Rating:</span>{" "}
                <span className="flex items-center gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={16} className={i < rating ? "text-yellow-400" : "text-gray-600"} />
                  ))}
                  <span className="ml-2 text-sm">({rating.toFixed(1)})</span>
                </span>
              </li>
              <li>
                <span className="font-medium text-indigo-400">Tasks Completed:</span>{" "}
                {completedTasks?.length || 0}
              </li>
              <li>
                <span className="font-medium text-indigo-400">Wallet Balance:</span> ₹{walletBalance || 0}
              </li>
              <li>
                <span className="font-medium text-indigo-400">Approval Status:</span> {approvedStatus || "Pending"}
              </li>
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-md transition-all"
            onClick={() => alert("Edit Profile coming soon...")}
          >
            Edit Profile
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-medium shadow-md transition-all"
            onClick={() => alert("Logout coming soon...")}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;
