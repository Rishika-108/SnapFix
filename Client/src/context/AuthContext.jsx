import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { saveAuthData } from "../api/api";

// 1 Create Context
const AuthContext = createContext(null);

// 2️ Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context; 
};

// 3 Provider Component
export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return {
      token,
      user: user ? JSON.parse(user) : null,
      isAuthenticated: !!token,
    };
  });

  //  Sync auth if localStorage changes (multi-tab safety)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");

      setAuth({
        token,
        user: user ? JSON.parse(user) : null,
        isAuthenticated: !!token,
      });
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Login handler (used after API login success)
  const login = (token, user, redirect = true) => {
    saveAuthData(token, user);

    setAuth({
      token,
      user,
      isAuthenticated: true,
    });

    if (!redirect) return;

    //  Role-based redirect
    if (user.role === "citizen") navigate("/");
    else if (user.role === "gigworker") navigate("/gigworker");
    else navigate("/");
  };

  //  Logout handler (NO page reload)
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setAuth({
      token: null,
      user: null,
      isAuthenticated: false,
    });

    navigate("/");
  };

  const [language, setLanguage] = useState(localStorage.getItem("lang") || "en");

  const toggleLanguage = () => {
    const newLang = language === "en" ? "hi" : "en";
    setLanguage(newLang);
    localStorage.setItem("lang", newLang);
  };


  return (
    <AuthContext.Provider
      value={{
        auth,
        user: auth.user,
        token: auth.token,
        isAuthenticated: auth.isAuthenticated,
        language,
        toggleLanguage,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
