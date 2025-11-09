import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThoughtProcess from "../../assets/ThoughtProcess.svg";
import BlueEnterance from "../../assets/B-g.jpg"; // <-- import background image
import AuthHeader from "./AuthHeader";
import AuthForm from "./AuthForm";
import AuthSocials from "./AuthSocials";
import { AuthAPI, saveAuthData } from "../../api/api";

const AuthenticationWindow = ({ showLoginModal, setShowLoginModal }) => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await AuthAPI.loginAdmin({
        email: formData.email,
        password: formData.password,
      });

      if (!response?.success) throw new Error(response?.message || "Login failed");

      // Save token & user info in localStorage
      saveAuthData(response.token, {
        email: formData.email,
        role: response.role,
      });

      alert(`✅ Logged in successfully as ${response.role || formData.email}!`);
      setShowLoginModal(false);

      // Navigate to admin dashboard
      navigate("/government/dashboard");
    } catch (err) {
      console.error("Login Error:", err.message || err);
      alert(err.message || "Something went wrong during login!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showLoginModal && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50 overflow-y-auto"
          style={{
            backgroundImage: `url(${BlueEnterance})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div
            className="bg-[#0E2439]/90 backdrop-blur-xl border border-white/10 
                       rounded-2xl p-6 w-[90%] max-w-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]
                       relative animate-fadeInUp transition-all duration-300"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-3 right-4 text-gray-300 hover:text-[#3EA8FF] transition-colors text-xl font-bold"
            >
              ✕
            </button>

            {/* Illustration */}
            <img
              src={ThoughtProcess}
              alt="Auth Illustration"
              className="w-32 h-auto mx-auto mb-4 opacity-90 drop-shadow-lg"
            />

            {/* Header */}
            <div className="text-center mb-4">
              <AuthHeader authMode="login" />
            </div>

            {/* Form */}
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-inner mb-4">
              <AuthForm
                authMode="login"
                formData={formData}
                handleChange={handleChange}
                handleAuth={handleLogin}
                loading={loading}
              />
            </div>

            {/* Social Logins */}
            <div className="mt-4">
              <AuthSocials />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AuthenticationWindow;
