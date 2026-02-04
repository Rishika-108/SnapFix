import { Outlet, Navigate } from "react-router-dom";
import CitizenNavbar from "../components/generalComponents/Navbars/CitizenNavbar";
import { useAuth } from "../context/AuthContext";

const CitizenLayout = () => {
  const { auth } = useAuth();

  if (!auth.user || auth.user.role !== "citizen") {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <CitizenNavbar />
      <Outlet />
    </>
  );
};

export default CitizenLayout;
