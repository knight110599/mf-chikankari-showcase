import { Navigate, Outlet, useLocation } from "react-router-dom";

type AdminUser = {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
};

export default function AdminProtectedRoute() {
  const location = useLocation();

  const token = localStorage.getItem("adminAccessToken");
  const storedUser = localStorage.getItem("adminUser");

  let adminUser: AdminUser | null = null;

  if (storedUser) {
    try {
      adminUser = JSON.parse(storedUser) as AdminUser;
    } catch {
      localStorage.removeItem("adminUser");
      localStorage.removeItem("adminAccessToken");
    }
  }

  const isAdmin =
    Boolean(token) &&
    Boolean(adminUser) &&
    adminUser?.role?.toUpperCase() === "ADMIN";

  if (!isAdmin) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <Outlet />;
}