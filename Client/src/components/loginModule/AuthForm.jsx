import React from "react";

const AuthForm = ({ authMode, formData, handleChange, handleAuth, loading }) => (
  <form
    onSubmit={(e) => {
      e.preventDefault();
      handleAuth();
    }}
  >
    {/* Name input for registration */}
    {authMode === "register" && (
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        type="text"
        placeholder="Full Name"
        className="w-full border border-white/30 bg-white/10 placeholder-gray-300 px-3 py-2 rounded-lg mb-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
        required
      />
    )}

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

    {/* Role selection */}
    <div className="relative mb-3">
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full appearance-none border border-white/30 bg-white/10 text-gray-100 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition backdrop-blur-sm cursor-pointer pr-8"
        required
      >
        <option value="citizen">Citizen</option>
        <option value="gigworker">Gig Worker</option>
        {/* {authMode === "login" && <option value="government">Government</option>} */}
      </select>

      <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-indigo-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>

    {/* Additional fields for gigworker registration */}
    {authMode === "register" && formData.role === "gigworker" && (
      <>
        <input
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          type="text"
          placeholder="Phone Number"
          className="w-full border border-white/30 bg-white/10 placeholder-gray-300 px-3 py-2 rounded-lg mb-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
        <input
          name="skills"
          value={formData.skills || ""}
          onChange={handleChange}
          type="text"
          placeholder="Skills (comma separated)"
          className="w-full border border-white/30 bg-white/10 placeholder-gray-300 px-3 py-2 rounded-lg mb-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
          required
        />
      </>
    )}

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
