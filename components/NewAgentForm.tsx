"use client";

import { useState, useEffect } from "react";
import Tabs from "./Tabs";
import { useListModelsQuery } from "@/store/features/models/modelApi";
import type { CreateAgentInput } from "@/lib/types/agent";

interface NewAgentFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAgentInput) => Promise<void>;
  isSubmitting?: boolean;
}

type AgentType = "roami-bot" | "custom-agent";

interface RoamiBotFormData {
  name: string;
  description: string;
  instructions: string;
  openaiModel: string;
}

interface CustomAgentFormData {
  name: string;
  description: string;
  instructions: string;
  openaiApiUrl: string;
  openaiApiKey: string;
  openaiModel: string;
  // OAuth fields (optional)
  oauthClientId?: string;
  oauthClientSecret?: string;
  oauthRedirectUri?: string;
}

export default function NewAgentForm({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: NewAgentFormProps) {
  const { data: modelsData } = useListModelsQuery();
  const [agentType, setAgentType] = useState<AgentType>("roami-bot");

  const [roamiBotData, setRoamiBotData] = useState<RoamiBotFormData>({
    name: "",
    description: "",
    instructions: "",
    openaiModel: "",
  });

  const [customAgentData, setCustomAgentData] = useState<CustomAgentFormData>({
    name: "",
    description: "",
    instructions: "",
    openaiApiUrl: "",
    openaiApiKey: "",
    openaiModel: "",
    oauthClientId: "",
    oauthClientSecret: "",
    oauthRedirectUri: "",
  });

  const [showOAuthFields, setShowOAuthFields] = useState(false);

  // Set default AI Model to first option when models are loaded and form is open
  useEffect(() => {
    if (
      isOpen &&
      modelsData?.models &&
      modelsData.models.length > 0 &&
      !roamiBotData.openaiModel
    ) {
      setRoamiBotData((prev) => ({
        ...prev,
        openaiModel: modelsData.models[0].uuid,
      }));
    }
  }, [isOpen, modelsData, roamiBotData.openaiModel]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (agentType === "roami-bot") {
      if (!roamiBotData.name.trim()) {
        alert("Please fill in the agent name");
        return;
      }
      if (!roamiBotData.instructions.trim()) {
        alert("Please fill in the agent instructions");
        return;
      }

      await onSubmit({
        name: roamiBotData.name.trim(),
        description: roamiBotData.description.trim() || undefined,
        instructions: roamiBotData.instructions.trim(),
        openaiModel: roamiBotData.openaiModel.trim() || undefined,
      });
    } else {
      if (!customAgentData.name.trim()) {
        alert("Please fill in the agent name");
        return;
      }
      if (!customAgentData.openaiApiUrl.trim()) {
        alert("Please fill in the OpenAI API URL");
        return;
      }
      if (!customAgentData.openaiApiKey.trim()) {
        alert("Please fill in the OpenAI API Key");
        return;
      }
      if (!customAgentData.instructions.trim()) {
        alert("Please fill in the agent instructions");
        return;
      }

      const submitData: CreateAgentInput = {
        name: customAgentData.name.trim(),
        description: customAgentData.description.trim() || undefined,
        instructions: customAgentData.instructions.trim(),
        openaiApiUrl: customAgentData.openaiApiUrl.trim(),
        openaiApiKey: customAgentData.openaiApiKey.trim(),
      };

      // Add OAuth fields if provided
      if (showOAuthFields) {
        if (customAgentData.oauthClientId?.trim()) {
          // Note: OAuth fields might need to be added to CreateAgentInput type
          // For now, we'll skip them as they're not in the current type definition
        }
      }

      await onSubmit(submitData);
    }

    // Reset form
    const defaultModel = modelsData?.models?.[0]?.uuid || "";
    setRoamiBotData({
      name: "",
      description: "",
      instructions: "",
      openaiModel: defaultModel,
    });
    setCustomAgentData({
      name: "",
      description: "",
      instructions: "",
      openaiApiUrl: "",
      openaiApiKey: "",
      openaiModel: "",
      oauthClientId: "",
      oauthClientSecret: "",
      oauthRedirectUri: "",
    });
    setShowOAuthFields(false);
    setAgentType("roami-bot");
  };

  const handleClose = () => {
    // Reset form when closing
    const defaultModel = modelsData?.models?.[0]?.uuid || "";
    setRoamiBotData({
      name: "",
      description: "",
      instructions: "",
      openaiModel: defaultModel,
    });
    setCustomAgentData({
      name: "",
      description: "",
      instructions: "",
      openaiApiUrl: "",
      openaiApiKey: "",
      openaiModel: "",
      oauthClientId: "",
      oauthClientSecret: "",
      oauthRedirectUri: "",
    });
    setShowOAuthFields(false);
    setAgentType("roami-bot");
    onClose();
  };

  if (!isOpen) return null;

  const roamiBotTab = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Name <span className="text-accent-error">*</span>
        </label>
        <input
          type="text"
          value={roamiBotData.name}
          onChange={(e) =>
            setRoamiBotData({ ...roamiBotData, name: e.target.value })
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
          value={roamiBotData.description}
          onChange={(e) =>
            setRoamiBotData({ ...roamiBotData, description: e.target.value })
          }
          className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent resize-none"
          placeholder="A brief description of your agent"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Agent Instructions <span className="text-accent-error">*</span>
        </label>
        <textarea
          value={roamiBotData.instructions}
          onChange={(e) =>
            setRoamiBotData({ ...roamiBotData, instructions: e.target.value })
          }
          className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent resize-none"
          placeholder="System instructions for the agent"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          AI Model
        </label>
        <select
          value={roamiBotData.openaiModel}
          onChange={(e) =>
            setRoamiBotData({ ...roamiBotData, openaiModel: e.target.value })
          }
          className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
        >
          <option value="">Select a model</option>
          {modelsData?.models?.map((model) => (
            <option key={model.uuid} value={model.uuid}>
              {model.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 bg-background-deep text-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-accent-primary text-foreground-bright px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium"
        >
          {isSubmitting ? "Creating..." : "Create Agent"}
        </button>
      </div>
    </form>
  );

  const customAgentTab = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Name <span className="text-accent-error">*</span>
        </label>
        <input
          type="text"
          value={customAgentData.name}
          onChange={(e) =>
            setCustomAgentData({ ...customAgentData, name: e.target.value })
          }
          className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
          placeholder="My Custom Agent"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Description
        </label>
        <textarea
          value={customAgentData.description}
          onChange={(e) =>
            setCustomAgentData({
              ...customAgentData,
              description: e.target.value,
            })
          }
          className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent resize-none"
          placeholder="A brief description of your agent"
          rows={2}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Agent Instructions <span className="text-accent-error">*</span>
        </label>
        <textarea
          value={customAgentData.instructions}
          onChange={(e) =>
            setCustomAgentData({
              ...customAgentData,
              instructions: e.target.value,
            })
          }
          className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent resize-none"
          placeholder="System instructions for the agent"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          OpenAI API URL <span className="text-accent-error">*</span>
        </label>
        <input
          type="text"
          value={customAgentData.openaiApiUrl}
          onChange={(e) =>
            setCustomAgentData({
              ...customAgentData,
              openaiApiUrl: e.target.value,
            })
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
          value={customAgentData.openaiApiKey}
          onChange={(e) =>
            setCustomAgentData({
              ...customAgentData,
              openaiApiKey: e.target.value,
            })
          }
          className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
          placeholder="sk-..."
          required
        />
      </div>

      {/* OAuth Fields Toggle */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => setShowOAuthFields(!showOAuthFields)}
          className="text-sm text-accent-primary hover:opacity-80 transition-opacity"
        >
          {showOAuthFields ? "−" : "+"} OAuth Configuration (Optional)
        </button>
      </div>

      {showOAuthFields && (
        <div className="space-y-4 pl-4 border-l-2 border-divider">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              OAuth Client ID
            </label>
            <input
              type="text"
              value={customAgentData.oauthClientId || ""}
              onChange={(e) =>
                setCustomAgentData({
                  ...customAgentData,
                  oauthClientId: e.target.value,
                })
              }
              className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              placeholder="Client ID"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              OAuth Client Secret
            </label>
            <input
              type="password"
              value={customAgentData.oauthClientSecret || ""}
              onChange={(e) =>
                setCustomAgentData({
                  ...customAgentData,
                  oauthClientSecret: e.target.value,
                })
              }
              className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              placeholder="Client Secret"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">
              OAuth Redirect URI
            </label>
            <input
              type="text"
              value={customAgentData.oauthRedirectUri || ""}
              onChange={(e) =>
                setCustomAgentData({
                  ...customAgentData,
                  oauthRedirectUri: e.target.value,
                })
              }
              className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
              placeholder="https://example.com/callback"
            />
          </div>
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={handleClose}
          className="flex-1 bg-background-deep text-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-accent-primary text-foreground-bright px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium"
        >
          {isSubmitting ? "Creating..." : "Create Agent"}
        </button>
      </div>
    </form>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background-secondary border border-divider rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-foreground">
            Create New Agent
          </h2>
          <button
            onClick={handleClose}
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

        <Tabs
          tabs={[
            {
              id: "roami-bot",
              label: "Roami Bot",
              content: roamiBotTab,
            },
            {
              id: "custom-agent",
              label: "Custom Agent",
              content: customAgentTab,
            },
          ]}
          defaultTab="roami-bot"
          onTabChange={(tabId) => setAgentType(tabId as AgentType)}
        />
      </div>
    </div>
  );
}

