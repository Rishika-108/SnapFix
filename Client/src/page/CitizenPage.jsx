import CitizenNavbar from "../components/generalComponents/Navbars/CitizenNavbar"
import ReportFeed from "../components/reportingModule/ReportFeed"

const CitizenPage = () => {

  return (<>
    <Navbar />
      <Routes>
        <Route path="/citizen/my-reports" element={<MyReports />} />
        <Route path="/citizen/new-report" element={<ReportForm />} />
        <Route path="/citizen/feed" element={<ReportFeed />} />
      </Routes>
      </>
  );
};
export default CitizenPage;