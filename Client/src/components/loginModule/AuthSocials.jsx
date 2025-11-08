import React from "react";
import { FiGithub, FiLinkedin, FiTwitter } from "react-icons/fi";

const AuthSocials = () => (
  <div className="mt-4 flex justify-center gap-3">
    {[FiGithub, FiLinkedin, FiTwitter].map((Icon, idx) => (
      <button
        key={idx}
        className="p-2.5 rounded-full bg-white/10 hover:bg-indigo-500/20 transition transform hover:scale-110 text-gray-200"
      >
        <Icon size={18} />
      </button>
    ))}
  </div>
);

export default AuthSocials;
