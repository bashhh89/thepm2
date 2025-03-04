import React from "react";
import AuthGuard from "../components/AuthGuard";
import { DashboardOverview } from "../components/DashboardOverview";
import { Outlet, useLocation } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();
  
  return location.pathname === "/dashboard" ? <DashboardOverview /> : <Outlet />;
}
