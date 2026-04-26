import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import { useTranslation } from "../../../hooks/useTranslation";
import defaultAvatar from "../../../assets/user-avatar.png";
import NotificationDropdown from "../NotificationDropdown";
import { Globe } from "lucide-react";

const CitizenNavbar = ({ user }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { logout, toggleLanguage } = useAuth();
  const { t, language } = useTranslation();

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
              {t('reportIssue')}
            </Link>
            <Link to="/citizen/feed" className="text-gray-700 hover:text-[#3EA8FF] px-2 py-1 rounded-md font-medium transition-colors">
              {t('reportsFeed')}
            </Link>
            <Link to="/citizen/my-reports" className="text-gray-700 hover:text-[#3EA8FF] px-2 py-1 rounded-md font-medium transition-colors">
              {t('myReports')}
            </Link>
            <Link to="/learn" className="text-gray-700 hover:text-[#3EA8FF] px-2 py-1 rounded-md font-medium transition-colors">
              {t('learn')}
            </Link>
          </div>

          {/* Right section */}
          <div className="hidden md:flex md:space-x-4 items-center">
            {/* Notification Bell */}
            <NotificationDropdown />

            {/* Custom Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-[#3EA8FF] hover:bg-blue-50 transition-all group"
              title="Switch Language"
            >
              <Globe size={18} className="text-gray-500 group-hover:text-[#3EA8FF]" />
              <span className="text-sm font-semibold text-gray-700 uppercase">
                {language === "en" ? "HI" : "EN"}
              </span>
            </button>

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
                      {t('profile')}
                    </Link>
                    <button
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      {t('logout')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FiMenu className="w-6 h-6 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden mt-1 bg-white shadow-md border-t border-gray-100">
            <ul className="space-y-1 px-4 py-3">
              <li>
                <Link
                  to="/citizen/new-report"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-[#3EA8FF] hover:bg-[#3EA8FF]/10 transition-all font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('reportIssue')}
                </Link>
              </li>
              <li>
                <Link
                  to="/citizen/feed"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-[#3EA8FF] hover:bg-[#3EA8FF]/10 transition-all font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('reportsFeed')}
                </Link>
              </li>
              <li>
                <Link
                  to="/citizen/my-reports"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-[#3EA8FF] hover:bg-[#3EA8FF]/10 transition-all font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                   {t('myReports')}
                </Link>
              </li>
              <li>
                <Link
                  to="/learn"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:text-[#3EA8FF] hover:bg-[#3EA8FF]/10 transition-all font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('learn')}
                </Link>
              </li>

              {/* Mobile Navbar Elements */}
              <li className="pt-4 mt-2 border-t border-gray-200 flex flex-col space-y-4">
                <div className="flex items-center justify-between px-3">
                  <NotificationDropdown />
                  <button
                    onClick={toggleLanguage}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-[#3EA8FF] hover:bg-blue-50 transition-all group"
                  >
                    <Globe size={18} className="text-gray-500 group-hover:text-[#3EA8FF]" />
                    <span className="text-sm font-semibold text-gray-700 uppercase">
                      {language === "en" ? "HI" : "EN"}
                    </span>
                  </button>
                </div>
                <div className="flex items-center gap-3 px-3 py-2">
                  <img
                    className="w-8 h-8 rounded-full"
                    src={user?.avatar || defaultAvatar}
                    alt={user?.name || "User avatar"}
                  />
                  <span className="text-sm font-medium text-gray-900">{user?.name || t('profile')}</span>
                </div>
                <Link
                  to="/profile"
                  className="block px-3 text-sm text-gray-700 hover:text-[#3EA8FF] font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('profile')}
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-3 text-sm text-red-600 font-medium"
                >
                  {t('logout')}
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default CitizenNavbar;

