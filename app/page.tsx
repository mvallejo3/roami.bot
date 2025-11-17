"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Agent } from "@/lib/types/agent";
import { getAgents, createAgent, deleteAgent } from "@/lib/services/agentService";
import { useStandalone } from "@/lib/hooks/useStandalone";

export default function DashboardPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const router = useRouter();
  const isStandalone = useStandalone();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    instructions: "",
    openaiApiUrl: "https://bzpljqculh65vdorw47xiqgg.agents.do-ai.run/api/v1",
    openaiApiKey: "0CjOl_WmssRXDLNVkqjRHnrg0X4jsk5g",
    openaiModel: "llama3.3-70b-instruct",
    knowledgeBaseUuid: "",
  });

  useEffect(() => {
    loadAgents();
  }, []);

  const loadAgents = () => {
    try {
      const loadedAgents = getAgents();
      setAgents(loadedAgents);
    } catch (error) {
      console.error("Error loading agents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.openaiApiUrl.trim() || 
        !formData.openaiApiKey.trim() || !formData.openaiModel.trim()) {
      alert("Please fill in all required fields (Name, API URL, API Key, Model)");
      return;
    }

    setIsCreating(true);
    try {
      const newAgent = createAgent({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        instructions: formData.instructions.trim() || undefined,
        openaiApiUrl: formData.openaiApiUrl.trim(),
        openaiApiKey: formData.openaiApiKey.trim(),
        openaiModel: formData.openaiModel.trim(),
        knowledgeBaseUuid: formData.knowledgeBaseUuid.trim() || undefined,
      });

      setAgents([...agents, newAgent]);
      setShowCreateForm(false);
      setFormData({
        name: "",
        description: "",
        instructions: "",
        openaiApiUrl: "https://bzpljqculh65vdorw47xiqgg.agents.do-ai.run/api/v1",
        openaiApiKey: "0CjOl_WmssRXDLNVkqjRHnrg0X4jsk5g",
        openaiModel: "llama3.3-70b-instruct",
        knowledgeBaseUuid: "",
      });
    } catch (error) {
      console.error("Error creating agent:", error);
      alert("Failed to create agent. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAgent = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      deleteAgent(id);
      setAgents(agents.filter((agent) => agent.id !== id));
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
      <header className="border-b border-divider px-4 py-3 sm:px-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-accent-primary">
              Roami
            </h1>
            <p className="text-sm text-foreground-secondary mt-1">
              AI Agent Dashboard
            </p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-accent-primary text-foreground-bright px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium text-sm sm:text-base"
          >
            + New Agent
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="flex space-x-2 justify-center mb-4">
                  <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-accent-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-accent-primary rounded-full animate-bounce"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
                <p className="text-foreground-secondary">Loading agents...</p>
              </div>
            </div>
          ) : agents.length === 0 ? (
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
                  key={agent.id}
                  className="bg-background-secondary border border-divider rounded-lg p-4 hover:border-accent-primary transition-colors cursor-pointer"
                  onClick={() => handleAgentClick(agent.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-foreground flex-1">
                      {agent.name}
                    </h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAgent(agent.id, agent.name);
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
                      {agent.openaiModel}
                    </span>
                    {agent.knowledgeBaseUuid && (
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
      {showCreateForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-secondary border border-divider rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Create New Agent
              </h2>
              <button
                onClick={() => setShowCreateForm(false)}
                className="text-foreground-secondary hover:text-foreground transition-colors"
                aria-label="Close"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateAgent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Name <span className="text-accent-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  placeholder="My AI Agent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent resize-none"
                  placeholder="A brief description of your agent"
                  rows={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Agent Instructions
                </label>
                <textarea
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent resize-none"
                  placeholder="System instructions for the agent"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  OpenAI API URL <span className="text-accent-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.openaiApiUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, openaiApiUrl: e.target.value })
                  }
                  className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  placeholder="https://api.openai.com/v1"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  OpenAI API Key <span className="text-accent-error">*</span>
                </label>
                <input
                  type="password"
                  value={formData.openaiApiKey}
                  onChange={(e) =>
                    setFormData({ ...formData, openaiApiKey: e.target.value })
                  }
                  className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  placeholder="sk-..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  OpenAI Model <span className="text-accent-error">*</span>
                </label>
                <input
                  type="text"
                  value={formData.openaiModel}
                  onChange={(e) =>
                    setFormData({ ...formData, openaiModel: e.target.value })
                  }
                  className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  placeholder="gpt-4"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Knowledge Base UUID
                </label>
                <input
                  type="text"
                  value={formData.knowledgeBaseUuid}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      knowledgeBaseUuid: e.target.value,
                    })
                  }
                  className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                  placeholder="Optional: Knowledge base UUID"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 bg-background-deep text-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="flex-1 bg-accent-primary text-foreground-bright px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium"
                >
                  {isCreating ? "Creating..." : "Create Agent"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
