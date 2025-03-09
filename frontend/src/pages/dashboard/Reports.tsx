import React from 'react';

export default function Reports() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>
      <p className="text-muted-foreground">Generate and manage recruitment reports.</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Available Reports</h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
              <span>Hiring Pipeline Overview</span>
              <span className="text-sm text-muted-foreground">Updated daily</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
              <span>Source Performance</span>
              <span className="text-sm text-muted-foreground">Updated weekly</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
              <span>Time-to-Hire Analysis</span>
              <span className="text-sm text-muted-foreground">Updated monthly</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
              <span>Cost per Hire Breakdown</span>
              <span className="text-sm text-muted-foreground">Updated monthly</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Scheduled Reports</h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
              <span>Weekly Performance Summary</span>
              <span className="text-sm text-muted-foreground">Every Monday</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
              <span>Monthly Analytics Report</span>
              <span className="text-sm text-muted-foreground">1st of month</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
              <span>Quarterly Business Review</span>
              <span className="text-sm text-muted-foreground">End of quarter</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}