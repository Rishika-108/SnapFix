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
            : "bg-black/5 text-gray-700 hover:bg-black/10"
        }`}
      >
        {mode === "login" ? "Login" : "Register"}
      </button>
    ))}
  </div>
);

export default AuthToggle;
