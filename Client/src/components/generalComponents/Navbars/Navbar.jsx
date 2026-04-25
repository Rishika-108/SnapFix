import React, { useState, useEffect, createContext, useContext } from "react";
import AuthenticationWindow from "../../loginModule/AuthenticationWindow";
import CitizenNavbar from "./CitizenNavbar";
import GigworkerNavbar from "./GigworkerNavbar";

//  Create Auth Context
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : null;
    return { token, user };
  });

  //  Sync auth state if localStorage changes (other tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");
      const user = userStr ? JSON.parse(userStr) : null;
      setAuth({ token, user });
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  //  Update auth state manually after login/logout
  const updateAuth = (newAuth) => {
    setAuth(newAuth);
  };

  //  Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
  };

  //  Determine which navbar to show
  const renderNavbar = () => {
    if (auth.token && auth.user) {
      if (auth.user.role === "citizen") {
        return <CitizenNavbar user={auth.user} />;
      } else if (auth.user.role === "gigworker") {
        return <GigworkerNavbar user={auth.user} />;
      } else {
        return <GuestNavbar />;
      }
    } else {
      return <GuestNavbar />;
    }
  };

  return (
    <AuthContext.Provider value={{ auth, updateAuth, setShowLoginModal, handleLogout }}>
      {renderNavbar()}

      {/* Login Modal */}
      <AuthenticationWindow
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
      />
    </AuthContext.Provider>
  );
};

//  Simple guest navbar if not logged in
const GuestNavbar = () => {
  const { setShowLoginModal } = useAuth();

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed top-0 left-0 w-full z-50 shadow-sm">
      <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="https://flowbite.com/docs/images/logo.svg"
            className="h-8"
            alt="SnapFix Logo"
          />
          <span className="self-center text-2xl font-semibold text-gray-900 dark:text-white">
            SnapFix
          </span>
        </a>

        {/* Login Button */}
        <div className="flex space-x-3 rtl:space-x-reverse">
          <button
            type="button"
            onClick={() => setShowLoginModal(true)}
            className="text-white bg-linear-to-r from-[#3EA8FF] to-[#0E72C2] hover:scale-105 transform transition-all duration-300 font-semibold rounded-xl text-sm px-5 py-2 shadow-md"
          >
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
