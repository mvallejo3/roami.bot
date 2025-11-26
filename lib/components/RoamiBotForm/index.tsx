"use client";

import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import type { CreateAgentInput } from "@/lib/types/agent";
import { getNoApiKeyRequiredModels } from "@/app/actions/models";
import { closeForm } from "@/store/features/agentForm/agentFormSlice";

export interface RoamiBotFormProps {
  onSubmit: (data: CreateAgentInput) => Promise<void>;
  isSubmitting: boolean;
  modelsData: { models: Array<{ uuid: string; name: string }> } | undefined;
}

interface RoamiBotFormData {
  name: string;
  description: string;
  instructions: string;
  model: string;
  // openaiApiKey: string;
}

export default function RoamiBotForm({
  onSubmit,
  isSubmitting,
  modelsData,
}: RoamiBotFormProps) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState<RoamiBotFormData>({
    name: "",
    description: "",
    instructions: "",
    model: "",
    // openaiApiKey: "",
  });
  const [noAPIKeyRequiredModelUUIDs, setNoAPIKeyRequiredModelUUIDs] =
    useState<string[]>([]);

  // Fetch the list of models that don't require API keys from the server
  useEffect(() => {
    async function fetchNoApiKeyRequiredModels() {
      try {
        const models = await getNoApiKeyRequiredModels();
        setNoAPIKeyRequiredModelUUIDs(models);
      } catch (error) {
        console.error("Error fetching no API key required models:", error);
        // Set empty array as fallback
        setNoAPIKeyRequiredModelUUIDs([]);
      }
    }
    fetchNoApiKeyRequiredModels();
  }, []);

  // Set default AI Model to first option when models are loaded
  useEffect(() => {
    if (
      modelsData?.models &&
      modelsData.models.length > 0 &&
      !formData.model
    ) {
      setFormData((prev) => ({
        ...prev,
        model: modelsData.models[0].uuid,
      }));
    }
  }, [modelsData, formData.model]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please fill in the agent name");
      return;
    }
    if (!formData.instructions.trim()) {
      alert("Please fill in the agent instructions");
      return;
    }

    const selectedModel = formData.model;
    const requiresApiKey =
      selectedModel &&
      !noAPIKeyRequiredModelUUIDs.includes(selectedModel);

    const submitData: CreateAgentInput = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      instructions: formData.instructions.trim(),
      model: formData.model.trim() || undefined,
    };

    // Only include API key if the model requires it
    // if (requiresApiKey && formData.openaiApiKey.trim()) {
    //   submitData.openaiApiKey = formData.openaiApiKey.trim();
    // }

    await onSubmit(submitData);

    // Reset form
    const defaultModel = modelsData?.models?.[0]?.uuid || "";
    setFormData({
      name: "",
      description: "",
      instructions: "",
      model: defaultModel,
      // openaiApiKey: "",
    });
  };

  const handleClose = () => {
    const defaultModel = modelsData?.models?.[0]?.uuid || "";
    setFormData({
      name: "",
      description: "",
      instructions: "",
      model: defaultModel,
      // openaiApiKey: "",
    });
    dispatch(closeForm());
  };

  const selectedModel = formData.model;
  const requiresApiKey =
    selectedModel && !noAPIKeyRequiredModelUUIDs.includes(selectedModel);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
          Instructions <span className="text-accent-error">*</span>
        </label>
        <textarea
          value={formData.instructions}
          onChange={(e) =>
            setFormData({ ...formData, instructions: e.target.value })
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
          value={formData.model}
          onChange={(e) =>
            setFormData({ ...formData, model: e.target.value })
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

      {/* {requiresApiKey && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            AI Model API Key
          </label>
          <input
            type="password"
            value={formData.openaiApiKey}
            onChange={(e) =>
              setFormData({ ...formData, openaiApiKey: e.target.value })
            }
            className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
            placeholder="sk-..."
          />
        </div>
      )} */}

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
}

