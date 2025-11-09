import { Routes, Route } from "react-router-dom";
import HomePage from "./page/HomePage";
import CitizenPage from "./page/CitizenPage";
import GigWorkerPage from "./page/GigWorkerPage";
import Navbar from "./components/generalComponents/Navbars/Navbar";
import MyReports from "./components/reportingModule/MyReports";
import ReportForm from "./components/reportingModule/ReportForm";
import ReportFeed from "./components/reportingModule/ReportFeed";
import ViewReports from "./components/WorkerModule/ViewReports";
import TaskAssigned from "./components/WorkerModule/TaskAssigned";
import UploadProof from "./components/WorkerModule/UploadProof";
import ViewProfile from "./components/WorkerModule/ViewProfile";
import Home from "./page/Home";
import Module from "./page/Module";
import Profile from "./page/Profile";



function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />

        
        <Route path="/citizen" element={<CitizenPage />} />
        <Route path="/citizen/my-reports" element={<MyReports />} />
        <Route path="/citizen/new-report" element={<ReportForm />} />
        <Route path="/citizen/feed" element={<ReportFeed />} />
        <Route path="/learn" element={<Home/>} />
        <Route path="/module/:id" element={<Module />} />
        <Route path="/profile" element={<Profile />} />
      
       

       <Route path="/gigworker" element={<GigWorkerPage />} />
        <Route path="/gigworker/feed" element={<ViewReports />} />
        <Route path="/gigworker/current-work" element={<TaskAssigned />} />
        <Route path="/gigworker/upload-proof/:taskId" element={<UploadProof />} />
        <Route path="/gigworker/profile" element={<ViewProfile />} />
        
      </Routes>
    </>
  );
}

export default App;
