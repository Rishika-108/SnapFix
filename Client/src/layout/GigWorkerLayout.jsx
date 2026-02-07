import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import GigworkerNavbar from "../components/generalComponents/Navbars/GigworkerNavbar";

const GigWorkerLayout = () => {
  const { auth } = useAuth();

  if (!auth.user || auth.user.role !== "gigworker") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <GigworkerNavbar />
      <div className="pt-16">
        <Outlet />
      </div>
    </>
  );
};

export default GigWorkerLayout;
