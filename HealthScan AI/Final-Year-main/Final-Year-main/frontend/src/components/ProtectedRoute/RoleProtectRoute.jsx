import React from "react";
import { Navigate } from "react-router-dom";

const RoleProtectRoute = ({ children, allowedRole }) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  if (!userData) {
    return <Navigate to="/login" replace />; //no token redirect to login
  }

  if (userData.role !== allowedRole) {
    return <Navigate to="/login" replace />; //login but role not matched
  }
  return children;
};

export default RoleProtectRoute;
