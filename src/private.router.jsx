// PrivateRoutes.js
import { Navigate, Outlet } from "react-router-dom";
import login from "./Auth";

const PrivateRoutes = () => {
  if (login.authenticated) {
    return <Outlet />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default PrivateRoutes;
