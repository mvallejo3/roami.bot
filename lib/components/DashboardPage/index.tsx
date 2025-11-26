"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useStandalone } from "@/lib/hooks/useStandalone";
import {
  useCreateAgentMutation,
  useDeleteAgentMutation,
} from "@/store/features/agents/agentApi";
import { useListModelsQuery } from "@/store/features/models/modelApi";
import NewAgentForm from "@/components/NewAgentForm";
import PageHeader from "@/lib/components/PageHeader";
import type { CreateAgentInput, ApiAgent } from "@/lib/types/agent";

interface DashboardPageProps {
  agents: ApiAgent[];
}

export default function DashboardPage({ agents }: DashboardPageProps) {
  const { data: modelsData } = useListModelsQuery();
  const [createAgent] = useCreateAgentMutation();
  const [deleteAgent] = useDeleteAgentMutation();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const isStandalone = useStandalone();

  // Create a mapping from model UUID to model name
  const modelNameMap = useMemo(() => {
    const map = new Map<string, string>();
    if (modelsData?.models) {
      modelsData.models.forEach((model) => {
        map.set(model.uuid, model.name);
      });
    }
    return map;
  }, [modelsData]);

  // Helper function to get model name from UUID
  const getModelName = (modelUuid: string) => {
    return modelNameMap.get(modelUuid) || modelUuid;
  };

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

  const handleDeleteAgent = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await deleteAgent(id).unwrap();
    } catch (error) {
      console.error("Error deleting agent:", error);
      alert("Failed to delete agent. Please try again.");
    }
  };

  const handleAgentClick = (agentId: string) => {
    router.push(`/agent/${agentId}`);
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
                <div
                  key={agent.uuid}
                  className="bg-background-secondary border border-divider rounded-lg p-4 hover:border-accent-primary transition-colors cursor-pointer"
                  onClick={() => handleAgentClick(agent.uuid)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground flex-1">
                      {agent.name}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAgent(agent.uuid, agent.name);
                      }}
                      className="text-accent-error hover:opacity-80 transition-opacity ml-2"
                      aria-label={`Delete ${agent.name}`}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                  {agent.description && (
                    <p className="text-sm text-foreground-secondary mb-3 line-clamp-2">
                      {agent.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-foreground-secondary">
                    <span className="bg-background-deep px-2 py-1 rounded">
                      {getModelName(agent.model.uuid)}
                    </span>
                    {agent.retrieval_method && agent.retrieval_method !== "none" && (
                      <span className="bg-background-deep px-2 py-1 rounded">
                        KB
                      </span>
                    )}
                  </div>
                </div>
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

