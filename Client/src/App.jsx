import { Routes, Route } from "react-router-dom";

import GuestLayout from "./layout/GuestLayout";
import CitizenLayout from "./layout/CitizenLayout";
import GigWorkerLayout from "./layout/GigWorkerLayout";

import HomePage from "./page/HomePage";
import CitizenPage from "./page/CitizenPage";
import GigWorkerPage from "./page/GigWorkerPage";
import Learn from "./page/Learn";
import Module from "./page/Module";
import Profile from "./page/Profile";

import MyReports from "./components/reportingModule/MyReports";
import ReportForm from "./components/reportingModule/ReportForm";
import ReportFeed from "./components/reportingModule/ReportFeed";

import ViewReports from "./components/WorkerModule/ViewReports";
import TaskAssigned from "./components/WorkerModule/TaskAssigned";
import UploadProof from "./components/WorkerModule/UploadProof";
import ViewProfile from "./components/WorkerModule/ViewProfile";

function App() {
  return (
    <Routes>

      {/* ================== GUEST ROUTES ================== */}
      <Route element={<GuestLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>

      {/* ================== CITIZEN ROUTES ================== */}
      <Route element={<CitizenLayout />}>
        <Route path="/citizen" element={<CitizenPage />} />
        <Route path="/citizen/my-reports" element={<MyReports />} />
        <Route path="/citizen/new-report" element={<ReportForm />} />
        <Route path="/citizen/feed" element={<ReportFeed />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/module/:id" element={<Module />} />
      </Route>

      {/* ================== GIG WORKER ROUTES ================== */}
      <Route element={<GigWorkerLayout />}>
        <Route path="/gigworker" element={<GigWorkerPage />} />
        <Route path="/gigworker/feed" element={<ViewReports />} />
        <Route path="/gigworker/current-work" element={<TaskAssigned />} />
        <Route
          path="/gigworker/upload-proof/:taskId"
          element={<UploadProof />}
        />
        <Route path="/gigworker/profile" element={<ViewProfile />} />
      </Route>

    </Routes>
  );
}

export default App;
