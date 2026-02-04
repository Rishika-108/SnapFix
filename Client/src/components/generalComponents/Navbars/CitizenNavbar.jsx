import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import defaultAvatar from "../../../assets/user-avatar.png";

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
    <nav className="bg-white border-gray-200 fixed top-0 left-0 w-full z-50 shadow-sm">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="SnapFix Logo"
          />
          <span className="text-2xl font-semibold text-gray-900">
            SnapFix
          </span>
        </Link>

        {/* Right section */}
        <div className="flex items-center space-x-3 md:order-2">
          
          {/* User avatar */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex rounded-full focus:ring-4 focus:ring-gray-300"
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
              className="absolute top-14 right-4 bg-white rounded-lg shadow-md divide-y z-50"
            >
              <ul className="py-2 text-sm">
                <li>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <FiMenu className="w-5 h-5" />
          </button>
        </div>

        {/* Nav links */}
        <div className={`${menuOpen ? "" : "hidden"} w-full md:flex md:w-auto md:order-1`}>
          <ul className="flex flex-col md:flex-row md:space-x-8 font-medium mt-4 md:mt-0">
            <li>
              <Link to="/citizen/new-report" className="block py-2 px-3 hover:text-blue-700">
                Report Issue
              </Link>
            </li>
            <li>
              <Link to="/citizen/feed" className="block py-2 px-3 hover:text-blue-700">
                Reports Feed
              </Link>
            </li>
            <li>
              <Link to="/citizen/my-reports" className="block py-2 px-3 hover:text-blue-700">
                My Reports
              </Link>
            </li>
            <li>
              <Link to="/learn" className="block py-2 px-3 hover:text-blue-700">
                Learn
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </nav>
  );
};

export default CitizenNavbar;
