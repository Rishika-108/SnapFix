// import React, { useState } from "react";
// import AuthenticationWindow from "../../loginModule/AuthenticationWindow";
// import CitizenNavbar from "./CitizenNavbar";
// import GigworkerNavbar from "./GigworkerNavbar";

// const Navbar = () => {
//   const [showLoginModal, setShowLoginModal] = useState(false);

//   const token = localStorage.getItem("token");
//   const user = JSON.parse(localStorage.getItem("user") || "{}");

//   // If logged in, show the appropriate navbar
//   if (token && user.role === "citizen") {
//     return <CitizenNavbar />;
//   } else if (token && user.role === "gigworker") {
//     return <GigworkerNavbar />;
//   }

//   // If not logged in, show default navbar with login
//   return (
//     <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed top-0 left-0 w-full z-50 shadow-sm">
//       <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
//         {/* Logo */}
//         <a
//           href="https://flowbite.com/"
//           className="flex items-center space-x-3 rtl:space-x-reverse"
//         >
//           <img
//             src="https://flowbite.com/docs/images/logo.svg"
//             className="h-8"
//             alt="Flowbite Logo"
//           />
//           <span className="self-center text-2xl font-semibold text-white">
//             SnapFix
//           </span>
//         </a>

//         {/* Right Section */}
//         <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
//           {/* Login Button */}
//           <button
//             type="button"
//             onClick={() => setShowLoginModal(true)}
//             className="text-blue-700 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2 text-center"
//           >
//             Login
//           </button>

//           <AuthenticationWindow
//             showLoginModal={showLoginModal}
//             setShowLoginModal={setShowLoginModal}
//           />
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
// Navbar.js
import React, { useState, useEffect, createContext, useContext } from "react";
import AuthenticationWindow from "../../loginModule/AuthenticationWindow";
import CitizenNavbar from "./CitizenNavbar";
import GigworkerNavbar from "./GigworkerNavbar";

// ✅ Create AuthContext
const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const Navbar = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token"),
    user: JSON.parse(localStorage.getItem("user") || "{}"),
  });

  // Keep auth state in sync with localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      setAuth({
        token: localStorage.getItem("token"),
        user: JSON.parse(localStorage.getItem("user") || "{}"),
      });
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Function to update auth after login/logout
  const updateAuth = (newAuth) => setAuth(newAuth);

  return (
    <AuthContext.Provider value={{ auth, updateAuth, setShowLoginModal }}>
      {/* Show the appropriate navbar based on role */}
      {auth.token && auth.user.role === "citizen" ? (
        <CitizenNavbar />
      ) : auth.token && auth.user.role === "gigworker" ? (
        <GigworkerNavbar user={auth.user} />
      ) : (
        // Default navbar when not logged in
        <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed top-0 left-0 w-full z-50 shadow-sm">
          <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
            {/* Logo */}
            <a
              href="/"
              className="flex items-center space-x-3 rtl:space-x-reverse"
            >
              <img
                src="https://flowbite.com/docs/images/logo.svg"
                className="h-8"
                alt="SnapFix Logo"
              />
              <span className="self-center text-2xl font-semibold text-white">
                SnapFix
              </span>
            </a>

            {/* Right Section */}
            <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              {/* Login Button */}
              <button
                type="button"
                onClick={() => setShowLoginModal(true)}
                className="text-blue-700 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2 text-center"
              >
                Login
              </button>

              <AuthenticationWindow
                showLoginModal={showLoginModal}
                setShowLoginModal={setShowLoginModal}
              />
            </div>
          </div>
        </nav>
      )}
    </AuthContext.Provider>
  );
};

export default Navbar;
