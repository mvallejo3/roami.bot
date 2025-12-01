"use client";

import { useState } from "react";
import type { CreateKnowledgeBaseInput } from "@/lib/types/knowledgebase";
import { EMBEDDING_MODEL_UUID, DATABASE_ID } from "@/lib/utils/api-config";

export interface NewKnowledgeBaseFormProps {
  onSubmit: (data: CreateKnowledgeBaseInput) => Promise<void>;
  onCancel: () => void;
  isSubmitting: boolean;
}

interface NewKnowledgeBaseFormData {
  name: string;
  description: string;
  region: string;
}

const REGIONS = [
  { value: "tor1", label: "Toronto (tor1)" },
  { value: "nyc1", label: "New York 1 (nyc1)" },
  { value: "nyc3", label: "New York 3 (nyc3)" },
];

export default function NewKnowledgeBaseForm({
  onSubmit,
  onCancel,
  isSubmitting,
}: NewKnowledgeBaseFormProps) {
  const [formData, setFormData] = useState<NewKnowledgeBaseFormData>({
    name: "",
    description: "",
    region: "tor1", // Default to tor1
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Please fill in the knowledge base name");
      return;
    }

    try {
      const submitData: CreateKnowledgeBaseInput = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        // project_id: undefined,
        embedding_model_uuid: EMBEDDING_MODEL_UUID,
        database_id: DATABASE_ID,
        datasources: [
          {
            spaces_data_source: {
              bucket_name: formData.name.trim(),
              region: formData.region,
            },
          },
        ],
      };

      await onSubmit(submitData);

      // Reset form
      setFormData({
        name: "",
        description: "",
        region: "tor1",
      });
    } catch (error) {
      console.error("Error creating knowledge base:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to create knowledge base. Please try again."
      );
    }
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
          placeholder="My Knowledge Base"
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
          placeholder="A brief description of your knowledge base"
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground mb-1">
          Region <span className="text-accent-error">*</span>
        </label>
        <select
          value={formData.region}
          onChange={(e) =>
            setFormData({ ...formData, region: e.target.value })
          }
          className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
          required
        >
          {REGIONS.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 bg-background-deep text-foreground px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 bg-accent-primary text-foreground-bright px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium"
        >
          {isSubmitting ? "Creating..." : "Create Knowledge Base"}
        </button>
      </div>
    </form>
  );
}

