import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ roles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  // not logged in → go to login, remember where we came from
  if (!user)
    return <Navigate to="/login" state={{ from: location }} replace />;

  // logged in but wrong role → 403
  if (roles && !roles.some((r) => user.roles.includes(r)))
    return <h1>403 — Access Denied</h1>;

  return children;
}