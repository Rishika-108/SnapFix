import React from "react";

const AuthToggle = ({ authMode, setAuthMode }) => (
  <div className="flex justify-center gap-3 mb-3">
    {["login", "register"].map((mode) => (
      <button
        key={mode}
        onClick={() => setAuthMode(mode)}
        className={`px-3 py-1 rounded-md text-sm transition ${
          authMode === mode
            ? "bg-indigo-600 text-white"
            : "bg-white/10 text-gray-300 hover:bg-white/20"
        }`}
      >
        {mode === "login" ? "Login" : "Register"}
      </button>
    ))}
  </div>
);

export default AuthToggle;
