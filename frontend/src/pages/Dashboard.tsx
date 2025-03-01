import React from "react";
import AuthGuard from "../components/AuthGuard";
import { DashboardMainLayout } from "../components/DashboardMainLayout";
import { DashboardOverview } from "../components/DashboardOverview";
import { Outlet, useLocation } from "react-router-dom";

export default function Dashboard() {
  const location = useLocation();
  
  return (
    <AuthGuard>
      <DashboardMainLayout>
        {location.pathname === "/dashboard" ? <DashboardOverview /> : <Outlet />}
      </DashboardMainLayout>
    </AuthGuard>
  );
}
