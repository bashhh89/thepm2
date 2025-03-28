'use client';

import AgentList from "@/components/agents/AgentList";

export default function AgentsPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Agent Builder</h1>
      <AgentList />
    </div>
  );
}