import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import LocationPicker from "./LocationPicker";
import { CitizenAPI } from "../../api/api"; // 🔗 Integrated with your hybrid API

import CitizenNavbar from "../generalComponents/Navbars/CitizenNavbar"

const ReportForm = () => {
  const [report, setReport] = useState({
    title: "",
    description: "",
    category: "", // ✅ Added category
    image: null,
    previewImage: null,
    location: { lat: null, lng: null, name: "" },
  });

  const [loading, setLoading] = useState(false);

  // ✅ Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReport((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle image upload
  const handleImageUpload = (file) => {
    const previewUrl = URL.createObjectURL(file);
    setReport((prev) => ({ ...prev, image: file, previewImage: previewUrl }));
  };

  // ✅ Handle location selection manually
  const handleManualLocationSelect = (location) => {
    setReport((prev) => ({ ...prev, location }));
  };

  // ✅ Auto-detect location (browser geolocation)
  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setReport((prev) => ({
          ...prev,
          location: { lat: latitude, lng: longitude, name: "Current Location" },
        }));
      },
      (err) => alert("Unable to detect location. Please select manually.")
    );
  };

  // ✅ Submit the report
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Submitting report:");
  console.log("Image:", report.image);
  console.log("Location:", report.location);
  console.log("Title:", report.title);
  console.log("Description:", report.description);
  console.log("Category:", report.category);

  setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", report.title);
      formData.append("description", report.description);
      formData.append("category", report.category); // ✅ Include category
      formData.append("image", report.image);
      formData.append("latitude", report.location.lat);
      formData.append("longitude", report.location.lng);
      formData.append("locationName", report.location.name);


      const token = localStorage.getItem("token"); // or wherever you store it
      const response = await CitizenAPI.createReport(formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { data } = response;

      if (data.success) {
        alert("✅ Report submitted successfully!");
        setReport({
          title: "",
          description: "",
          category: "",
          image: null,
          previewImage: null,
          location: { lat: null, lng: null, name: "" },
        });
      } else {
        alert("⚠️ Failed to submit: " + data.message);
      }
    } catch (err) {
      console.error("Submit Error:", err);
      alert("❌ Something went wrong while submitting your report.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Predefined categories
  const categories = [
    "Road Damage",
    "Water Leakage",
    "Garbage Issue",
    "Streetlight Problem",
    "Illegal Parking",
    "Public Safety",
    "Other",
  ];

  return (
    <>
      <CitizenNavbar />
      <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-gray-900 to-black text-white p-4 mt-10 ">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-full max-w-lg shadow-2xl">
          <h2 className="text-2xl font-bold mb-4 text-center">Report an Issue</h2>
          <p className="text-sm text-gray-300 mb-6 text-center">
            Capture an image, describe the issue, and select or auto-detect your location.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <ImageUpload
              image={report.image}
              previewImage={report.previewImage}
              handleImageUpload={handleImageUpload}
            />

            <input
              type="text"
              name="title"
              placeholder="Title"
              value={report.title}
              onChange={handleInputChange}
              className="w-full border border-white/30 bg-white/10 placeholder-gray-300 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              rows="3"
              value={report.description}
              onChange={handleInputChange}
              className="w-full border border-white/30 bg-white/10 placeholder-gray-300 px-4 py-3 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              required
            />

            {/* ✅ Category Dropdown */}
            <select
              name="category"
              value={report.category}
              onChange={handleInputChange}
              required
              className="w-full border border-white/30 bg-white/10 text-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer appearance-none"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.08)",
                color: "#E5E7EB",
              }}
            >
              <option
                value=""
                disabled
                style={{
                  backgroundColor: "#1F2937",
                  color: "#E5E7EB",
                }}
              >
                Select Category
              </option>
              {categories.map((cat, index) => (
                <option
                  key={index}
                  value={cat}
                  style={{
                    backgroundColor: "#1F2937", // dark gray (matches bg-gray-800)
                    color: "#E5E7EB", // light gray text
                  }}
                >
                  {cat}
                </option>
              ))}
            </select>


            <LocationPicker
              location={report.location}
              detectLocation={detectLocation}
              onLocationSelect={handleManualLocationSelect}
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl font-semibold text-white bg-linear-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 shadow-lg transition-all transform hover:scale-105 ${loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              {loading ? "Submitting..." : "Submit Report"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReportForm;
