import { Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import CitizenPage from "./page/CitizenPage";
// import GigWorkerPage from "./page/GigWorkerPage";
import Navbar from "./components/generalComponents/Navbars/Navbar";
import MyReports from "./components/reportingModule/MyReports";
import ReportForm from "./components/reportingModule/ReportForm";
import ReportFeed from "./components/reportingModule/ReportFeed";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Citizen routes */}
        <Route path="/citizen" element={<CitizenPage />} />
        <Route path="/citizen/my-reports" element={<MyReports />} />
        <Route path="/citizen/new-report" element={<ReportForm />} />
        <Route path="/citizen/feed" element={<ReportFeed />} />

        {/* <Route path="/gigworker" element={<GigWorkerPage />} /> */}
      </Routes>
    </>
  );
}

export default App;
