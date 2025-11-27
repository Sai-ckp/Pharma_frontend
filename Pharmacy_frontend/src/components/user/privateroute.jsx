import { Navigate, Outlet, useLocation } from "react-router-dom";
import { getAccessToken } from "../../api/auth";

export default function PrivateRoute() {
  const token = getAccessToken();
  const location = useLocation();

  return token
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />;
}
