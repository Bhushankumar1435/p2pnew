import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminAuthGuard = ({ children }) => {
  const token = localStorage.getItem("admin_token");

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  // Works with both `<Outlet />` and `<AdminAuthGuard><Page /></AdminAuthGuard>`
  return children || <Outlet />;
};

export default AdminAuthGuard;
