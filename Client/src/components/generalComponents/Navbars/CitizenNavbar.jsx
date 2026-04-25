import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import defaultAvatar from "../../../assets/user-avatar.png";
import NotificationDropdown from "../NotificationDropdown";
import GoogleTranslation from "../GoogleTranslation";

const CitizenNavbar = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 fixed top-0 left-0 w-full z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 flex-shrink-0">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8 w-auto"
              alt="SnapFix Logo"
            />
            <span className="text-xl font-semibold text-gray-900">
              SnapFix
            </span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex md:space-x-6">
            <Link to="/citizen/new-report" className="text-gray-700 hover:text-[#3EA8FF] px-2 py-1 rounded-md font-medium transition-colors">
              Report Issue
            </Link>
            <Link to="/citizen/feed" className="text-gray-700 hover:text-[#3EA8FF] px-2 py-1 rounded-md font-medium transition-colors">
              Reports Feed
            </Link>
            <Link to="/citizen/my-reports" className="text-gray-700 hover:text-[#3EA8FF] px-2 py-1 rounded-md font-medium transition-colors">
              My Reports
            </Link>
            <Link to="/learn" className="text-gray-700 hover:text-[#3EA8FF] px-2 py-1 rounded-md font-medium transition-colors">
              Learn
            </Link>
          </div>

          {/* Right section */}
          <div className="hidden md:flex md:space-x-4 items-center">
            {/* Notification Bell */}
            <NotificationDropdown />

            {/* Google Translate Widget */}
            <GoogleTranslation />

            {/* User avatar */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <img
                  className="w-8 h-8 rounded-full"
                  src={user?.avatar || defaultAvatar}
                  alt={user?.name || "User avatar"}
                />
              </button>

              {/* Dropdown */}
              {dropdownOpen && (
                <div
                  ref={dropdownRef}
                  className="absolute right-0 mt-2 w-44 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
                >
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-1">
            <ul className="space-y-1 px-2 pb-3">
              <li>
                <Link
                  to="/citizen/new-report"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-[#3EA8FF] hover:bg-[#3EA8FF]/10 transition-all font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Report Issue
                </Link>
              </li>
              <li>
                <Link
                  to="/citizen/feed"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-[#3EA8FF] hover:bg-[#3EA8FF]/10 transition-all font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Reports Feed
                </Link>
              </li>
              <li>
                <Link
                  to="/citizen/my-reports"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-[#3EA8FF] hover:bg-[#3EA8FF]/10 transition-all font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                   My Reports
                </Link>
              </li>
              <li>
                <Link
                  to="/learn"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-[#3EA8FF] hover:bg-[#3EA8FF]/10 transition-all font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  Learn
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CitizenNavbar;

