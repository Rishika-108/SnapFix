import React from "react";

const AuthHeader = ({ authMode }) => (
  <>
    <h2 className="text-xl font-semibold mb-1 text-white text-center">
      {authMode === "login" ? "Welcome Back!" : "Create Account"}
    </h2>
    <p className="text-xs text-gray-300 mb-3 text-center">
      {authMode === "login"
        ? "Log in to make the Change"
        : "Register to start your journey"}
    </p>
  </>
);

export default AuthHeader;
