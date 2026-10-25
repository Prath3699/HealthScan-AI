import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectAuth } from "../../redux/rootSlice";

const safeParse = (raw) => {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem("userData"); // clean up corrupt session
    return null;
  }
};

const RoleProtectRoute = ({ children, allowedRole }) => {
  const { user } = useSelector(selectAuth);
  // Redux is the source of truth; fall back to storage only on a fresh page load.
  const userData = user ?? safeParse(localStorage.getItem("userData"));
  if (!userData) {
    return <Navigate to="/login" replace />; //no token redirect to login
  }

  if (userData.role !== allowedRole) {
    return <Navigate to="/login" replace />; //login but role not matched
  }
  return children;
};

export default RoleProtectRoute;
