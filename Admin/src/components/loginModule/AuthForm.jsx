import React from "react";

const AuthForm = ({ authMode, formData, handleChange, handleAuth, loading }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleAuth();
    }}
  >
    {/* Name input for registration */}
    {/* {authMode === "register" && (
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        type="text"
        placeholder="Full Name"
        className="w-full border border-white/30 bg-white/10 placeholder-gray-300 px-3 py-2 rounded-lg mb-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />
    )} */}

    {/* Email */}
    <input
      name="email"
      value={formData.email}
      onChange={handleChange}
      type="email"
      placeholder="Email"
      className="w-full border border-white/30 bg-white/10 placeholder-gray-300 px-3 py-2 rounded-lg mb-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      required
    />

    {/* Password */}
    <input
      name="password"
      value={formData.password}
      onChange={handleChange}
      type="password"
      placeholder="Password"
      className="w-full border border-white/30 bg-white/10 placeholder-gray-300 px-3 py-2 rounded-lg mb-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
      required
    />

    {/* Submit button */}
    <button
      type="submit"
      disabled={loading}
      className={`w-full py-2.5 rounded-lg font-semibold text-white bg-linear-to-r from-indigo-500 to-purple-500 hover:from-purple-500 hover:to-indigo-500 shadow-md transition-all transform hover:scale-105 text-sm ${
        loading ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {loading
        ? "Processing..."
        : authMode === "login"
        ? "Login"
        : "Register"}
    </button>
  </form>
);

export default AuthForm;
