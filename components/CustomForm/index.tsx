"use client";

import { useState } from "react";
import type { CreateAgentInput } from "@/lib/types/agent";

export interface CustomFormProps {
  onSubmit: (data: CreateAgentInput) => Promise<void>;
  onClose: () => void;
  isSubmitting: boolean;
}

interface CustomFormData {
  name: string;
  description: string;
  openaiApiUrl: string;
  openaiApiKey: string;
}

export default function CustomForm({
  onSubmit,
  onClose,
  isSubmitting,
}: CustomFormProps) {
  const [formData, setFormData] = useState<CustomFormData>({
    name: "",
    description: "",
    openaiApiUrl: "",
    openaiApiKey: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please fill in the agent name");
      return;
    }
    if (!formData.openaiApiUrl.trim()) {
      alert("Please fill in the AI Model API URL");
      return;
    }
    if (!formData.openaiApiKey.trim()) {
      alert("Please fill in the AI Model API Key");
      return;
    }

    const submitData: CreateAgentInput = {
      name: formData.name.trim(),
      agentType: "custom",
      description: formData.description.trim() || undefined,
      openaiApiUrl: formData.openaiApiUrl.trim(),
      openaiApiKey: formData.openaiApiKey.trim(),
    };

    await onSubmit(submitData);

    // Reset form
    setFormData({
      name: "",
      description: "",
      openaiApiUrl: "",
      openaiApiKey: "",
    });
  };

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      openaiApiUrl: "",
      openaiApiKey: "",
    });
    onClose();
  };

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
          placeholder="My Custom Agent"
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
          AI Model API URL <span className="text-accent-error">*</span>
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
          AI Model API Key <span className="text-accent-error">*</span>
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

