import React from 'react';

export default function DashboardHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome to your recruitment agency dashboard.</p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Active Jobs</h3>
          <div className="mt-2 text-3xl font-bold">12</div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Total Candidates</h3>
          <div className="mt-2 text-3xl font-bold">156</div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Active Applications</h3>
          <div className="mt-2 text-3xl font-bold">48</div>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Upcoming Interviews</h3>
          <div className="mt-2 text-3xl font-bold">8</div>
        </div>
      </div>
    </div>
  );
}