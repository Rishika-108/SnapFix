import React, { useState, useRef, useEffect } from "react";
import { FiBell, FiChevronDown, FiLogOut } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import userAvatar from "../../assets/user-avatar.png";

const Topbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setDropdownOpen(false);
      if (notifRef.current && !notifRef.current.contains(event.target))
        setNotifOpen(false);
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
        <div ref={notifRef} className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-full hover:bg-blue-600/20 text-gray-300 hover:text-blue-400 transition"
          >
            <FiBell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-72 bg-[#142E4D] border border-white/10 rounded-xl shadow-lg p-3 z-50 animate-fadeIn">
              <p className="text-xs text-gray-400 mb-2 font-medium">
                Recent Notifications
              </p>
              <ul className="divide-y divide-white/10 text-sm text-gray-200">
                <li className="py-2 hover:bg-blue-600/10 rounded-md px-2 cursor-pointer">
                  12 new issues reported in Ward 5
                </li>
                <li className="py-2 hover:bg-blue-600/10 rounded-md px-2 cursor-pointer">
                  3 issues resolved in Zone 2
                </li>
                <li className="py-2 hover:bg-blue-600/10 rounded-md px-2 cursor-pointer">
                  Budget approval pending for 2 projects
                </li>
              </ul>
            </div>
          )}
        </div>

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
