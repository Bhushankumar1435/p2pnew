import React from "react";
import { Navigate } from "react-router-dom";

const SubAdminAuthGuard = ({ children }) => {
  const token = localStorage.getItem("sub_admin_token");

  if (!token) {
    return <Navigate to="/subadminauth/login" replace />;
  }

  return children;
};

export default SubAdminAuthGuard;
