import { useState } from "react";
import GovernmentSidebar from "../components/generalComponents/GovernmentSidebar";
import AuthenticationWindow from "../components/loginModule/AuthenticationWindow";

const HomePage = () => {
  const [showLoginModal, setShowLoginModal] = useState(true);

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden 
                 bg-linear-to-b from-[#0B1725] via-[#0E2439] to-[#142E4D] 
                 flex items-center justify-center text-gray-100"
    >
      {/* Subtle background pattern overlay */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#1A3554_1px,transparent_1px)] 
                   bg-size-[20px_20px] opacity-20"
      />

      {/* Soft spotlight effect */}
      <div className="absolute inset-0 bg-linear-to-t from-black/40 via-transparent to-transparent" />


      {/* Authentication Modal */}
      <AuthenticationWindow
        showLoginModal={showLoginModal}
        setShowLoginModal={setShowLoginModal}
      />

    </div>
  );
};

export default HomePage;
