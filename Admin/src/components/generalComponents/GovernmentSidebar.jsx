import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import userAvatar from "../../assets/user-avatar.png";

const GovernmentSidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  /* ================= Scroll Lock ================= */
  useEffect(() => {
    if (sidebarOpen) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    }

    return () => {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  /* ================= Close avatar dropdown ================= */
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
      {/* ================= Mobile Topbar ================= */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#0E2439] md:hidden border-b border-white/10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((prev) => !prev)}
              className="p-2 rounded-md text-gray-300 hover:bg-blue-600/20 active:bg-blue-600/30"
            >
              <FiMenu className="text-2xl" />
            </button>

            <Link to="/government/dashboard" className="flex items-center gap-2">
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8"
                alt="Logo"
              />
              <span className="text-xl font-semibold text-gray-100">
                SnapFix
              </span>
            </Link>
          </div>

          {/* Avatar */}
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="relative"
          >
            <img
              className="w-8 h-8 rounded-full"
              src={userAvatar}
              alt="user"
            />
            {dropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-40 bg-[#142E4D] border border-white/10 rounded-lg shadow-md"
              >
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-sm text-gray-300 hover:bg-blue-600/20 text-left"
                >
                  Logout
                </button>
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* ================= Sidebar ================= */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen overflow-y-auto overscroll-contain
        transition-transform duration-300 transform border-r border-white/10
        bg-gradient-to-b from-[#0B1725] via-[#0E2439] to-[#142E4D]
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col h-full">
          {/* ===== Header ===== */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
            <Link
              to="/government/dashboard"
              className="flex items-center gap-3"
            >
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                alt="Gov Logo"
                className="h-8 w-8"
              />
              <span className="text-lg font-semibold text-gray-100">
                SnapFix Gov
              </span>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-md text-gray-300 hover:bg-blue-600/20 md:hidden"
            >
              <IoClose className="text-2xl" />
            </button>
          </div>

          {/* ===== Navigation ===== */}
          <div className="flex-1 px-3 py-6 space-y-2">
            {[
              { label: "Dashboard", to: "/government/dashboard" },
              { label: "Reports", to: "/government/reports" },
              { label: "Fund Release", to: "/government/funds" },
            ].map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setSidebarOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? "bg-blue-600/30 text-[#3EA8FF] font-semibold border-l-4 border-[#3EA8FF]" 
                      : "text-gray-400 hover:bg-blue-600/10 hover:text-gray-200"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* ===== Footer ===== */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center gap-3">
              <img
                src={userAvatar}
                alt="user"
                className="w-10 h-10 rounded-full border border-white/20"
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
        </div>
      </aside>

      {/* ================= Mobile Overlay ================= */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 md:hidden overscroll-contain"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default GovernmentSidebar;
