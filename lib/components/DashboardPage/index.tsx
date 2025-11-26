"use client";

import { useState } from "react";
import { useStandalone } from "@/lib/hooks/useStandalone";
import { useCreateAgentMutation } from "@/store/features/agents/agentApi";
import NewAgentForm from "@/components/NewAgentForm";
import PageHeader from "@/lib/components/PageHeader";
import AgentCard from "@/lib/components/AgentCard";
import type { CreateAgentInput, ApiAgent } from "@/lib/types/agent";

interface DashboardPageProps {
  agents: ApiAgent[];
}

export default function DashboardPage({ agents }: DashboardPageProps) {
  const [createAgent] = useCreateAgentMutation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const isStandalone = useStandalone();

  const handleCreateAgent = async (data: CreateAgentInput) => {
    setIsCreating(true);
    try {
      await createAgent(data).unwrap();
      setShowCreateForm(false);
    } catch (error) {
      console.error("Error creating agent:", error);
      alert("Failed to create agent. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-background text-foreground"
      style={{ paddingTop: isStandalone ? "36px" : "0" }}
    >
      {/* Header */}
      <PageHeader
        title="Roami"
        description="AI Agent Dashboard"
        rightAction={
          <button
            onClick={() => setShowCreateForm(true)}
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
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2 text-accent-primary">
                  No agents yet
                </h2>
                <p className="text-foreground-secondary mb-4">
                  Create your first AI agent to get started
                </p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-accent-primary text-foreground-bright px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  Create Agent
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agents.map((agent) => (
                <AgentCard key={agent.uuid} agent={agent} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Agent Modal */}
      <NewAgentForm
        isOpen={showCreateForm}
        onClose={() => setShowCreateForm(false)}
        onSubmit={handleCreateAgent}
        isSubmitting={isCreating}
      />
    </div>
  );
}

