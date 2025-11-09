import React, { useState } from "react";
import ImageUpload from "./ImageUpload";
import LocationPicker from "./LocationPicker";
import { CitizenAPI } from "../../api/api";
import CitizenNavbar from "../generalComponents/Navbars/CitizenNavbar";

const ReportForm = () => {
  const [report, setReport] = useState({
    title: "",
    description: "",
    category: "",
    image: null,
    previewImage: null,
    location: { lat: null, lng: null, name: "" },
  });

  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setReport((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (file) => {
    const previewUrl = URL.createObjectURL(file);
    setReport((prev) => ({ ...prev, image: file, previewImage: previewUrl }));
  };

  const handleManualLocationSelect = (location) => {
    setReport((prev) => ({ ...prev, location }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", report.title);
      formData.append("description", report.description);
      formData.append("category", report.category);
      formData.append("image", report.image);
      formData.append("latitude", report.location.lat);
      formData.append("longitude", report.location.lng);
      formData.append("locationName", report.location.name);

      const token = localStorage.getItem("token");
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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex justify-center items-center pt-24 pb-10 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            Report an Issue
          </h2>
          <p className="text-gray-600 text-sm mb-6 text-center">
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
              className="w-full border border-gray-300 bg-white placeholder-gray-400 px-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            <textarea
              name="description"
              placeholder="Description"
              rows="3"
              value={report.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 bg-white placeholder-gray-400 px-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
              required
            />

            <select
              name="category"
              value={report.category}
              onChange={handleInputChange}
              required
              className="w-full border border-gray-300 bg-white text-gray-700 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
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
              className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-blue-500 shadow-md transition-all transform hover:scale-105 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
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
