import { Outlet } from "react-router-dom";
import Navbar from "../components/generalComponents/Navbars/Navbar";

const GuestLayout = () => {
  return (
    <>
      <Navbar/>
      <Outlet />
    </>
  );
};

export default GuestLayout;
