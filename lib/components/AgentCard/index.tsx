"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useDeleteAgentMutation } from "@/store/features/agents/agentApi";
import { useListModelsQuery } from "@/store/features/models/modelApi";
import type { ApiAgent } from "@/lib/types/agent";

interface AgentCardProps {
  agent: ApiAgent;
}

export default function AgentCard({ agent }: AgentCardProps) {
  const router = useRouter();
  const { data: modelsData } = useListModelsQuery();
  const [deleteAgent] = useDeleteAgentMutation();

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

  const handleClick = () => {
    router.push(`/agent/${agent.uuid}`);
  };

  const handleDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!confirm(`Are you sure you want to delete "${agent.name}"?`)) {
      return;
    }

    try {
      await deleteAgent(agent.uuid).unwrap();
    } catch (error) {
      console.error("Error deleting agent:", error);
      alert("Failed to delete agent. Please try again.");
    }
  };

  return (
    <div
      className="bg-background-secondary border border-divider rounded-lg p-4 hover:border-accent-primary transition-colors cursor-pointer"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-foreground flex-1">
          {agent.name}
        </h3>
        <button
          onClick={handleDelete}
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
  );
}

