import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import userAvatar from "../../assets/user-avatar.png";

const GovernmentSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <>
      {/* ===== Topbar for Mobile ===== */}
      <nav className="bg-[#0E2439] fixed top-0 left-0 w-full z-50 shadow-sm md:hidden border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-300 hover:bg-blue-600/20"
            >
              <FiMenu className="text-2xl" />
            </button>
            <Link to="/dashboard" className="flex items-center space-x-2">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8"
                alt="App Logo"
              />
              <span className="text-xl font-semibold text-gray-100">
                SnapFix
              </span>
            </Link>
          </div>

          {/* User Avatar */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative"
          >
            <img className="w-8 h-8 rounded-full" src={userAvatar} alt="user" />
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-40 bg-[#142E4D] border border-white/10 rounded-lg shadow-md"
              >
                <ul className="py-1">
                  <li>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-blue-600/20"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* ===== Sidebar ===== */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform bg-[#0E2439] border-r border-white/10 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
          {/* ===== Brand ===== */}
                <Link to="/government/dashboard" className="flex items-center gap-3">
                  <img
                    src="https://flowbite.com/docs/images/logo.svg"
                    alt="Gov Logo"
                    className="h-8 w-8"
                  />
                  <h1 className="text-lg font-semibold text-gray-100 tracking-tight">
                    SnapFix Gov Panel
                  </h1>
                </Link>

          {/* Close button (mobile only) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1 rounded-md text-gray-300 hover:bg-blue-600/20 md:hidden"
          >
            <IoClose className="text-2xl" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="px-3 py-6 space-y-2">
          {[
            { label: "Dashboard", to: "/government/dashboard" },
            { label: "Reports", to: "/government/reports" },
            { label: "Fund Release", to: "/government/funds" },
          ].map((item) => (
            <Link
              key={item.label}
              to={item.to}
              onClick={() => setSidebarOpen(false)}
              className="block px-4 py-2 text-gray-300 rounded-md hover:bg-blue-600/20 transition"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 w-full border-t border-white/10 p-4">
          <div className="flex items-center space-x-3">
            <img
              className="w-10 h-10 rounded-full border border-white/20"
              src={userAvatar}
              alt="User avatar"
            />
            <div>
              <p className="text-sm font-medium text-gray-100">
                Government User
              </p>
              <button
                onClick={handleLogout}
                className="text-xs text-red-400 hover:underline"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Background overlay (Mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
    </>
  );
};

export default GovernmentSidebar;
