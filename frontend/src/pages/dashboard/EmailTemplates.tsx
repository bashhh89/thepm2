import React from 'react';

export default function EmailTemplates() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Email Templates</h1>
      <p className="text-muted-foreground">Manage your recruitment email templates.</p>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Candidate Templates</h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
              <span>Application Received</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
              <span>Interview Invitation</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
              <span>Job Offer</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
              <span>Application Status Update</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Active</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-card p-6">
          <h3 className="font-semibold">Client Templates</h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
              <span>Candidate Introduction</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
              <span>Interview Schedule</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
              <span>Feedback Request</span>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">Active</span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-accent rounded-md cursor-pointer">
              <span>Progress Report</span>
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">Draft</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}