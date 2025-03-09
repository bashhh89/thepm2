import React from 'react';

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics</h1>
      <p className="text-muted-foreground">Track recruitment metrics and performance.</p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Time to Hire</h3>
          <div className="mt-2 text-3xl font-bold">24d</div>
          <p className="text-sm text-muted-foreground">Average days to fill a position</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Cost per Hire</h3>
          <div className="mt-2 text-3xl font-bold">$850</div>
          <p className="text-sm text-muted-foreground">Average cost per placement</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Application Rate</h3>
          <div className="mt-2 text-3xl font-bold">85%</div>
          <p className="text-sm text-muted-foreground">Applications completion rate</p>
        </div>
        
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Offer Acceptance</h3>
          <div className="mt-2 text-3xl font-bold">92%</div>
          <p className="text-sm text-muted-foreground">Offer acceptance rate</p>
        </div>
      </div>
    </div>
  );
}