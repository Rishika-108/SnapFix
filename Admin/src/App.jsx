import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import AuthenticationWindow from "./components/loginModule/AuthenticationWindow"
import HomePage from "./page/Homepage";
import Dashboard from "./page/Dashboard";
import Reports from "./page/Reports";
import FundRelease from "./page/FundRelease"

function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      {/* <Navbar /> */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/government/dashboard" element={<Dashboard/>} />
        <Route path="/government/reports" element={<Reports/>} />
        <Route path="/government/funds" element={<FundRelease/>} />
      </Routes>
    </>
  );
}

export default App;
