"use client";

import { useDispatch } from "react-redux";
import { openForm } from "@/store/features/agentForm/agentFormSlice";
import PageHeader from "@/lib/components/PageHeader";
import AgentCard from "@/lib/components/AgentCard";
import NoAgents from "@/lib/components/NoAgents";
import type { ApiAgent } from "@/lib/types/agent";

interface DashboardPageProps {
  agents: ApiAgent[];
}

export default function DashboardPage({ agents }: DashboardPageProps) {
  const dispatch = useDispatch();

  return (
    <div
      className="flex flex-col h-screen bg-background text-foreground pt-16"
    >
      {/* Header */}
      <PageHeader
        title="Roami"
        description="AI Agent Dashboard"
        rightAction={
          <button
            onClick={() => dispatch(openForm())}
            className="bg-accent-primary text-foreground-bright px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium text-sm sm:text-base"
          >
            + New Agent
          </button>
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {agents.length === 0 ? (
            <NoAgents onCreateClick={() => dispatch(openForm())} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <AgentCard key={agent.uuid} agent={agent} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

