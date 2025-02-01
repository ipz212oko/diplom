import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/providers/AuthProvider.jsx";

export function ProtectedRoute({ allowedRoles, redirectPath = "/not-found" }) {
  const { user, token, hasPermission } = useAuth();

  if(token && !user) return null;

  return hasPermission(allowedRoles)
    ? <Outlet/>
    : <Navigate to={redirectPath} replace />;
}