// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import ThoughtProcess from "../../assets/ThoughtProcess.svg";
// import AuthHeader from "./AuthHeader";
// import AuthToggle from "./AuthToggle";
// import AuthForm from "./AuthForm";
// import AuthSocials from "./AuthSocials";
// import { AuthAPI, saveAuthData } from "../../api/api";

// const AuthenticationWindow = ({ showLoginModal, setShowLoginModal }) => {
//   const navigate = useNavigate();

//   const [authMode] = useState("login");
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAuth = async () => {
//     setLoading(true);
//     const USE_DUMMY_LOGIN = false;

//     try {
//       if (authMode === "login") {
//         console.log("Attempting government login:", formData);
//         let response;

//         if (USE_DUMMY_LOGIN) {
//           response = {
//             success: true,
//             message: "Login successful (mock)",
//             token: "dummy-jwt-token-123",
//             admin: {
//               _id: "admin-001",
//               name: "Mock Admin",
//               email: formData.email,
//             },
//           };
//         } else {
//           response = await AuthAPI.loginAdmin({
//             email: formData.email,
//             password: formData.password,
//           });
//         }

//         if (!response || !response.success) {
//           throw new Error(response?.message || "Login failed");
//         }

//         saveAuthData(response.token, response.admin);
//         setIsLoggedIn(true);
//         alert(`✅ Logged in successfully as ${response.admin?.name || formData.email}!`);
//       } else {
//         if (formData.role === "government") {
//           alert("🛑 Admin registration is restricted to backend.");
//           return;
//         }

//         let response;
//         if (USE_DUMMY_LOGIN) {
//           response = {
//             success: true,
//             message: "Registered successfully (mock)",
//             token: "dummy-jwt-token-123",
//             user: {
//               _id: "user-001",
//               name: formData.email,
//               role: formData.role,
//             },
//           };
//         } else {
//           response = await AuthAPI.registerUser?.({
//             email: formData.email,
//             password: formData.password,
//             role: formData.role,
//           });
//         }

//         if (!response || !response.success) {
//           throw new Error(response?.message || "Registration failed");
//         }

//         alert(`✅ Registered successfully as ${formData.role}!`);
//         saveAuthData(response.token, response.user);
//         setIsLoggedIn(true);
//       }

//       if (authMode === "login") {
//         navigate("/government/dashboard");
//       } else if (formData.role === "gigworker") {
//         navigate("/gigworker/feed");
//       }

//       setShowLoginModal(false);
//     } catch (err) {
//       console.error("Auth Error:", err.message || err);
//       alert(err.message || "Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <>
//       {showLoginModal && (
//         <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50 overflow-y-auto">
//           <div
//             className="bg-[#0E2439]/90 backdrop-blur-xl border border-white/10 
//                        rounded-2xl p-6 w-[90%] max-w-sm shadow-[0_0_30px_rgba(0,0,0,0.5)]
//                        relative animate-fadeInUp transition-all duration-300"
//           >
//             {/* Close Button */}
//             <button
//               onClick={() => setShowLoginModal(false)}
//               className="absolute top-3 right-4 text-gray-300 hover:text-[#3EA8FF] transition-colors text-xl font-bold"
//             >
//               ✕
//             </button>

//             {/* Illustration */}
//             <img
//               src={ThoughtProcess}
//               alt="Auth Illustration"
//               className="w-32 h-auto mx-auto mb-4 opacity-90 drop-shadow-lg"
//             />

//             {/* Header */}
//             <div className="text-center mb-4">
//               <AuthHeader authMode={authMode} />
//             </div>

//             {/* Toggle (if needed) */}
//             {/* <AuthToggle authMode={authMode} setAuthMode={setAuthMode} /> */}

//             {/* Form */}
//             <div className="bg-white/5 border border-white/10 rounded-xl p-4 shadow-inner mb-4">
//               <AuthForm
//                 authMode={authMode}
//                 formData={formData}
//                 handleChange={handleChange}
//                 handleAuth={handleAuth}
//                 loading={loading}
//               />
//             </div>

//             {/* Social Logins */}
//             <div className="mt-4">
//               <AuthSocials />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default AuthenticationWindow;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThoughtProcess from "../../assets/ThoughtProcess.svg";
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center z-50 overflow-y-auto">
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
