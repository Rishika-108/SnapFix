import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import userAvatar from "../../../assets/user-avatar.png";

const HomeNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

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

  // ✅ Handle Logout
  const handleLogout = () => {
    localStorage.clear(); // remove all locally stored data
    setDropdownOpen(false);
    navigate("/"); // redirect to home or login page
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed top-0 left-0 w-full z-50 shadow-sm">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link to="/citizen" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="App Logo"
          />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            CitizenConnect
          </span>
        </Link>

        {/* Right side buttons */}
        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {/* Login button */}
          <button
            type="button"
            onClick={() => setShowLoginModal(true)}
            className="text-blue-700 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2 text-center"
          >
            Login
          </button>

          {/* Dropdown menu */}
          {/* {dropdownOpen && (
            <div
              ref={dropdownRef}
              className="z-50 absolute top-14 right-4 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow-md dark:bg-gray-700 dark:divide-gray-600"
            >
              <ul className="py-2">
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )} */}

          {/* Mobile menu toggle */}
          {/* <button
            onClick={() => setMenuOpen(!menuOpen)}
            type="button"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbar-user"
            aria-expanded={menuOpen}
          >
            <span className="sr-only">Open main menu</span>
            <FiMenu className="w-5 h-5" />
          </button> */}
        </div>

        {/* Navbar links
        <div
          className={`items-center justify-between w-full md:flex md:w-auto md:order-1 ${
            menuOpen ? "" : "hidden"
          }`}
          id="navbar-user"
        >
          <ul
            className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 
              md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white 
              dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700"
          >
            <li>
              <Link
                to="/citizen/my-reports"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 
                md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white 
                md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white 
                md:dark:hover:bg-transparent dark:border-gray-700"
              >
                My Reports
              </Link>
            </li>
            <li>
              <Link
                to="/citizen/reports-feed"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 
                md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white 
                md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white 
                md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Reports Feed
              </Link>
            </li>
            <li>
              <Link
                to="/citizen/report-issue"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 
                md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white 
                md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white 
                md:dark:hover:bg-transparent dark:border-gray-700"
              >
                Report Issue
              </Link>
            </li>
          </ul>
        </div> */}
      </div>
    </nav>
  );
};

export default HomeNavbar;
