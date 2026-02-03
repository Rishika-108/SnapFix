import CitizenNavbar from "../components/generalComponents/Navbars/CitizenNavbar";
import ReportFeed from "../components/reportingModule/ReportFeed";
import AppBG from "../assets/B-g.jpg"; // background image

const CitizenPage = () => {
  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundImage: `url(${AppBG})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed", // optional: keeps background fixed on scroll
      }}
    >
      {/* White Tint Overlay */}
      <div className="absolute inset-0 bg-white/40 pointer-events-none"></div>

      {/* Page Content */}
      <div className="relative z-10">
        <CitizenNavbar />
        <ReportFeed />
      </div>
    </div>
  );
};

export default CitizenPage;
