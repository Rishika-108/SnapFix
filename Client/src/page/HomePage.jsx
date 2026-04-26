import Navbar from "../components/generalComponents/Navbars/Navbar";
import Hero from "../components/homeComponents/Hero";
import About from "../components/homeComponents/About";
import FeatureHighlights from "../components/homeComponents/FeatureHighlights";
import Footer from "../components/generalComponents/Footer";
import HomeBG from "../assets/SubtleBlue.jpg"; 
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { user } = useAuth();
  const isGigWorker = user?.role === "gigworker";

  return (
    <div
      className={`transition-colors duration-500 ${
        isGigWorker 
          ? "bg-gradient-to-br from-gray-900 to-black text-white" 
          : ""
      }`}
      style={!isGigWorker ? {
        backgroundImage: `url(${HomeBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      } : {}}
    >
      <Navbar/>
      <Hero isDark={isGigWorker} />
      <FeatureHighlights isDark={isGigWorker} />
      <About isDark={isGigWorker} />
      <Footer isDark={isGigWorker} /> 
    </div>
  );
};

export default HomePage;
