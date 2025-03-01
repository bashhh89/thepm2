import React from "react";
import AuthGuard from "../components/AuthGuard";

export default function ChatHistoryPage() {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Chat History</h2>
        <p className="text-muted-foreground">Review past conversations with your customers and leads.</p>
      </div>
      
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <div className="flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-2">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md">
              The Chat History system is currently under development. 
              You'll soon be able to access and review all past conversations with your customers.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
