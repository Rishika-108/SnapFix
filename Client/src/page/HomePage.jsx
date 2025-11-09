import Navbar from "../components/generalComponents/Navbars/Navbar";
import Hero1 from "../components/homeComponents/Hero1";
import About from "../components/homeComponents/About";
import FeatureHighlights from "../components/homeComponents/FeatureHighlights";
import Footer from "../components/generalComponents/Footer";
import HomeBG from "../assets/SubtleBlue.jpg"; // <-- import background image

const HomePage = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${HomeBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Navbar />
      <Hero1 />
      <FeatureHighlights />
      <About />
      <Footer />
    </div>
  );
};

export default HomePage;
