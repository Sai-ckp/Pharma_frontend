import { Navigate, Outlet, useLocation } from "react-router-dom";

const SESSION_TOKEN_KEY = "session_token";

export default function PrivateRoute() {
  const token = sessionStorage.getItem(SESSION_TOKEN_KEY);
  const location = useLocation();

  return token
    ? <Outlet />
    : <Navigate to="/login" replace state={{ from: location }} />;
}
