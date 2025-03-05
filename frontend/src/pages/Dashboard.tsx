import React from "react";
import { DashboardOverview } from "../components/DashboardOverview";
import { Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../utils/auth-store";

export default function Dashboard() {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useAuthStore();
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return location.pathname === "/dashboard" ? <DashboardOverview /> : <Outlet />;
}
