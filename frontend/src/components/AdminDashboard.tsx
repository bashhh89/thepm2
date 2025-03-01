import React from 'react';
import { DashboardCard } from './DashboardCard';
import { useNavigate } from 'react-router-dom';
import { Card } from './Card';

export function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="space-y-2">
              <div className="text-2xl font-bold">25</div>
              <div className="text-sm text-muted-foreground">Total Users</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <div className="text-2xl font-bold">142</div>
              <div className="text-sm text-muted-foreground">Active Conversations</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <div className="text-2xl font-bold">89%</div>
              <div className="text-sm text-muted-foreground">System Uptime</div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <div className="text-2xl font-bold">12</div>
              <div className="text-sm text-muted-foreground">Pending Approvals</div>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="User Management"
            description="Manage user accounts and permissions"
            icon={(
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            )}
            buttonText="Manage Users"
            onClick={() => navigate('/admin/users')}
          />

          <DashboardCard
            title="System Settings"
            description="Configure system-wide settings and preferences"
            icon={(
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            )}
            buttonText="Settings"
            onClick={() => navigate('/admin/settings')}
          />

          <DashboardCard
            title="Analytics"
            description="View system analytics and usage statistics"
            icon={(
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6" y1="20" x2="6" y2="14" />
              </svg>
            )}
            buttonText="View Analytics"
            onClick={() => navigate('/admin/analytics')}
          />
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;