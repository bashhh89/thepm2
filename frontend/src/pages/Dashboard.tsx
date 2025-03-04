import React from "react";
import AuthGuard from "../components/AuthGuard";
import { DashboardOverview } from "../components/DashboardOverview";
import { Outlet, useLocation } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();
  
  // No longer wrapping with DashboardMainLayout since it's already in the parent route
  return location.pathname === "/dashboard" ? <DashboardOverview /> : <Outlet />;
}
