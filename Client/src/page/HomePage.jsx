import Navbar from "../components/generalComponents/Navbars/Navbar"
import Hero1 from "../components/homeComponents/Hero1"
import About from "../components/homeComponents/About"
import FeatureHighlights from "../components/homeComponents/FeatureHighlights"
import Footer from "../components/generalComponents/Footer"

const HomePage = () => {

  return (
    <div>
    <Navbar/>
    <Hero1/>
    <FeatureHighlights/>
    <About/>
    <Footer/>
    </div>
  );
};
export default HomePage;