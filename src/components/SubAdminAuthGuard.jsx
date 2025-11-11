import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const SubAdminAuthGuard = () => {
  const token = localStorage.getItem("sub_admin_token");

  // If no sub-admin token, redirect to sub-admin login
  if (!token) {
    return <Navigate to="/subadmin/login" replace />;
  }

  return <Outlet />;
};

export default SubAdminAuthGuard;
