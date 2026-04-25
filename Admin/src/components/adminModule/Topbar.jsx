import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiChevronDown, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import userAvatar from "../../assets/user-avatar.png";

import AdminNotificationDropdown from "./AdminNotificationDropdown";

const Topbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <header
      className="
        sticky top-0 z-40
        bg-[#0E2439]/90 backdrop-blur-md
        border-b border-white/10
        px-6 py-3
      "
    >
      {/* ===== Right-Aligned Actions ===== */}
      <div className="flex justify-end items-center gap-4 relative">
        {/* Notifications */}
        <AdminNotificationDropdown />

        {/* Profile Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-blue-600/10 transition"
          >
            <img
              src={userAvatar}
              alt="User Avatar"
              className="w-8 h-8 rounded-full border border-white/20"
            />
            <FiChevronDown className="text-gray-300 text-sm" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-[#142E4D] border border-white/10 rounded-xl shadow-md z-50 animate-fadeIn">
              <ul className="py-2 text-sm text-gray-200">
                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-blue-600/20 transition"
                  >
                    My Profile
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 hover:bg-blue-600/20 transition"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-blue-600/20 flex items-center gap-2 text-red-400"
                  >
                    <FiLogOut className="text-red-400" /> Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
