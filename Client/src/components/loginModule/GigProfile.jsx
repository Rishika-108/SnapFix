import React, { useState, useEffect } from "react";
import { createGigProfile, getGigById } from "../../DB/gig";

const GigProfile = ({ gigId, onClose }) => {
  const [skill, setSkill] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkGigProfile = async () => {
      if (!gigId) return;

      try {
        const existingProfile = await getGigById(gigId);

        // Show popup only if no profile exists
        if (!existingProfile) {
          setIsVisible(true);
        } else {
          onClose?.(); // If data exists, close instantly
        }
      } catch (error) {
        console.warn("ℹ️ No gig profile found, opening setup form.");
        setIsVisible(true);
      }
    };

    checkGigProfile();
  }, [gigId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!skill.trim() || !phone.trim()) {
      alert("Please fill all fields.");
      return;
    }

    setLoading(true);
    try {
      await createGigProfile(gigId, skill, phone);
      alert("✅ Gig profile created successfully!");
      setIsVisible(false);
      onClose?.();
    } catch (error) {
      console.error("❌ Error creating gig profile:", error.message);
      alert("Failed to create gig profile. Try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-md text-white shadow-2xl transition-transform transform hover:scale-[1.01] duration-300">
        {/* Close Button */}
        <button
          onClick={() => {
            setIsVisible(false);
            onClose?.();
          }}
          className="absolute top-3 right-4 text-white text-2xl hover:text-red-400 transition-colors"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold mb-4 text-center bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
          Complete Your Gig Profile
        </h2>
        <p className="text-gray-300 text-sm text-center mb-6">
          Enter your primary skill and contact number to start accepting tasks.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Skill Input */}
          <input
            type="text"
            placeholder="Your Primary Skill (e.g., Plumbing, Road Repair)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full border border-white/30 bg-white/10 placeholder-gray-300 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
            required
          />

          {/* Phone Input */}
          <input
            type="text"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border border-white/30 bg-white/10 placeholder-gray-300 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-300"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all transform hover:scale-105 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default GigProfile;
