import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThoughtProcess from "../../assets/ThoughtProcess.svg";
import BlueEnterance from "../../assets/authbg.jpg"; // background image
import AuthHeader from "./AuthHeader";
import AuthToggle from "./AuthToggle";
import AuthForm from "./AuthForm";
import AuthSocials from "./AuthSocials";
import { AuthAPI } from "../../api/api";
import { useAuth } from "../generalComponents/Navbars/Navbar";

const AuthenticationWindow = ({ showLoginModal, setShowLoginModal }) => {
  const navigate = useNavigate();
  const { updateAuth } = useAuth();

  const [authMode, setAuthMode] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "citizen",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuth = async () => {
    setLoading(true);
    try {
      let response;

      if (authMode === "login") {
        if (formData.role === "citizen") {
          response = await AuthAPI.loginCitizen({
            email: formData.email,
            password: formData.password,
          });
        } else {
          response = await AuthAPI.loginWorker({
            email: formData.email,
            password: formData.password,
          });
        }

        const { data } = response;
        if (!data.success) throw new Error(data.message);

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user || data.worker));

        updateAuth({
          token: data.token,
          user: data.user || data.worker,
        });

        alert(`✅ Logged in successfully as ${formData.role}!`);
      } else {
        // Registration logic...
      }

      if (formData.role === "citizen") navigate("/citizen/feed");
      else if (formData.role === "gigworker") navigate("/gigworker/feed");

      setShowLoginModal(false);
    } catch (err) {
      console.error("Auth Error:", err.message);
      alert(err.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authMode === "register" && formData.role === "gigworker") {
      if (!navigator.geolocation) {
        alert("Geolocation is not supported by your browser.");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) =>
          setFormData((prev) => ({
            ...prev,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })),
        (error) => {
          console.error("Error getting location:", error);
          alert(
            "Unable to get your location. Please enable location services or try again."
          );
        },
        { enableHighAccuracy: true }
      );
    }
  }, [authMode, formData.role]);

  return (
    <>
      {showLoginModal && (
        <div
          className="fixed inset-0 flex flex-col items-center justify-start z-50 p-2 overflow-y-auto pt-[8%]"
          style={{
            backgroundImage: `url(${BlueEnterance})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundAttachment: "fixed", // makes the image fixed
          }}
        >
          {/* Dark overlay */}
          <div className="fixed inset-0 bg-[#0E2439]/70"></div>

          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 w-[90%] max-w-sm shadow-2xl relative animate-fadeInUp mb-10 z-10">
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-3 right-4 text-white hover:text-indigo-400 transition text-xl font-bold"
            >
              ✕
            </button>

            {/* Illustration */}
            <img
              src={ThoughtProcess}
              alt="Auth Illustration"
              className="w-36 h-auto mx-auto mb-3 animate-fadeIn"
            />

            {/* Header, Toggle, Form, Socials */}
            <AuthHeader authMode={authMode} />
            <AuthToggle authMode={authMode} setAuthMode={setAuthMode} />
            <AuthForm
              authMode={authMode}
              formData={formData}
              handleChange={handleChange}
              handleAuth={handleAuth}
              loading={loading}
            />
            <AuthSocials />
          </div>
        </div>
      )}
    </>
  );
};

export default AuthenticationWindow;
