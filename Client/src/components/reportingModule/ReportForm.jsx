import React, { useCallback, useState } from "react";
import ImageUpload from "./ImageUpload";
import LocationPicker from "./LocationPicker";
import { CitizenAPI } from "../../api/api";
import CitizenNavbar from "../generalComponents/Navbars/CitizenNavbar";
import { useTranslation } from "../../hooks/useTranslation";

const ReportForm = () => {
  const { t } = useTranslation();
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

const detectLocation = useCallback(() => {
  console.log("📍 detectLocation called");

  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;

        console.log("✅ Location detected:", latitude, longitude);

        setReport((prev) => ({
          ...prev,
          location: {
            lat: latitude,
            lng: longitude,
            name: "Current Location",
          },
        }));

        resolve({ latitude, longitude });
      },
      (err) => {
        console.error("❌ Geolocation error:", err);
        reject(err);
      },
      {
        enableHighAccuracy: false,
        timeout: 20000,
        maximumAge: 60000,
      }
    );
  });
}, []);

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
  "Roads & Transportation",
  "Water & Sewerage",
  "Garbage & Sanitation",
  "Streetlights & Electricity",
  "Public Health",
  "Traffic & Parking",
  "Urban Planning",
  "Public Safety",
  "Other",
];


  return (
    <>
      <CitizenNavbar />
      <div className="min-h-screen bg-[#F8FAFC] flex justify-center items-center pt-24 pb-10 px-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-lg border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            {t('Report an Issue')}
          </h2>
          <p className="text-gray-600 text-sm mb-6 text-center">
            {t('Capture an image, describe the issue, and select or auto-detect your location.')}
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
              placeholder={t("What's the issue?")}
              value={report.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 bg-white placeholder-gray-400 px-4 py-3 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />

            <textarea
              name="description"
              placeholder={t("Describe the problem in detail...")}
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
                {t('Select Category')}
              </option>
              {categories.map((cat, index) => (
                <option key={index} value={cat}>
                  {t(cat)}
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
              className={`w-full py-3 rounded-xl font-semibold text-white bg-linear-to-r from-[#3EA8FF] to-[#0E72C2] hover:scale-105 shadow-md transition-all transform ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? t("Submitting...") : t("Submit Report")}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ReportForm;
