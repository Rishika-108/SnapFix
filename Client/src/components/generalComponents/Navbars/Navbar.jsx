// import React, { useState, useEffect, createContext, useContext } from "react";
// import AuthenticationWindow from "../../loginModule/AuthenticationWindow";
// import CitizenNavbar from "./CitizenNavbar";
// import GigworkerNavbar from "./GigworkerNavbar";

// // ✅ Create context inside Navbar file
// const AuthContext = createContext();
// export const useAuth = () => useContext(AuthContext);

// const Navbar = () => {
//   const [showLoginModal, setShowLoginModal] = useState(false);
//   const [auth, setAuth] = useState({
//     token: localStorage.getItem("token"),
//     user: JSON.parse(localStorage.getItem("user") || "{}"),
//   });

//   // 🔄 Keep auth state synced with localStorage
//   useEffect(() => {
//     const handleStorageChange = () => {
//       setAuth({
//         token: localStorage.getItem("token"),
//         user: JSON.parse(localStorage.getItem("user") || "{}"),
//       });
//     };

//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   // Function to manually update state after login/logout
//   const updateAuth = (newAuth) => {
//     setAuth(newAuth);
//   };

//   // ✅ Wrap entire navbar area with AuthContext
//   return (
//     <AuthContext.Provider value={{ auth, updateAuth, setShowLoginModal }}>
//       {auth.token && auth.user.role === "citizen" ? (
//         <CitizenNavbar />
//       ) : auth.token && auth.user.role === "gigworker" ? (
//         <GigworkerNavbar />
//       ) : (
//         <nav className="bg-white border-gray-200 dark:bg-gray-900 fixed top-0 left-0 w-full z-50 shadow-sm">
//           <div className="max-w-7xl flex flex-wrap items-center justify-between mx-auto p-4">
//             {/* Logo */}
//             <a
//               href="/gigworker"
//               className="flex items-center space-x-3 rtl:space-x-reverse"
//             >
//               <img
//                 src="https://flowbite.com/docs/images/logo.svg"
//                 className="h-8"
//                 alt="Flowbite Logo"
//               />
//               <span className="self-center text-2xl font-semibold text-white">
//                 SnapFix
//               </span>
//             </a>

//             {/* Right Section */}
//             <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
//               {/* Login Button */}
//               <button
//                 type="button"
//                 onClick={() => setShowLoginModal(true)}
//                 className="text-blue-700 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2 text-center"
//               >
//                 Login
//               </button>

//               <AuthenticationWindow
//                 showLoginModal={showLoginModal}
//                 setShowLoginModal={setShowLoginModal}
//               />
//             </div>
//           </div>
//         </nav>
//       )}
//     </AuthContext.Provider>
//   );
// };

// export default Navbar;

import React, { useState, useEffect, createContext, useContext } from "react";
import AuthenticationWindow from "../../loginModule/AuthenticationWindow";
import CitizenNavbar from "./CitizenNavbar";
import GigworkerNavbar from "./GigworkerNavbar";

// ✅ Create Auth Context
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

  // 🔄 Sync auth state if localStorage changes (other tabs)
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

  // ✅ Update auth state manually after login/logout
  const updateAuth = (newAuth) => {
    setAuth(newAuth);
  };

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setAuth({ token: null, user: null });
  };

  // ✅ Determine which navbar to show
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

// ✅ Simple guest navbar if not logged in
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
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-200 font-medium rounded-lg text-sm px-4 py-2"
          >
            Login
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
