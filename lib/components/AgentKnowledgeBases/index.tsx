"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/lib/components/PageHeader";
import NewKnowledgeBaseForm from "@/lib/components/NewKnowledgeBaseForm";
import { useListKnowledgeBasesQuery } from "@/store/features/knowledgebase/knowledgebaseApi";
import { useAttachKnowledgeBaseMutation } from "@/store/features/agents/agentApi";
import { useCreateKnowledgeBaseMutation } from "@/store/features/knowledgebase/knowledgebaseApi";
import type { ApiAgent, KnowledgeBase } from "@/lib/types/agent";
import type { KnowledgeBase as KnowledgeBaseType } from "@/lib/types/knowledgebase";
import type { CreateKnowledgeBaseInput } from "@/lib/types/knowledgebase";

interface AgentKnowledgeBasesProps {
  agent: ApiAgent;
  agentId: string;
  knowledgeBases: KnowledgeBase[];
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
};

type FormMode = "attach" | "create";

export default function AgentKnowledgeBases({
  agent,
  agentId,
  knowledgeBases,
}: AgentKnowledgeBasesProps) {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<FormMode>("attach");
  const [selectedKnowledgeBaseUuid, setSelectedKnowledgeBaseUuid] = useState<string>("");

  const { data: allKnowledgeBasesData, isLoading: isLoadingKnowledgeBases } =
    useListKnowledgeBasesQuery(undefined, { skip: !isModalOpen });
  const [attachKnowledgeBase, { isLoading: isAttaching }] =
    useAttachKnowledgeBaseMutation();
  const [createKnowledgeBase, { isLoading: isCreating }] =
    useCreateKnowledgeBaseMutation();

  // Filter out knowledge bases that are already attached to this agent
  const attachedKbUuids = new Set(knowledgeBases.map((kb) => kb.uuid));
  const availableKnowledgeBases =
    allKnowledgeBasesData?.knowledge_bases.filter(
      (kb: KnowledgeBaseType) => !attachedKbUuids.has(kb.uuid)
    ) || [];

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setFormMode("attach");
    setSelectedKnowledgeBaseUuid("");
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormMode("attach");
    setSelectedKnowledgeBaseUuid("");
  };

  const handleCreateNewKnowledgeBase = () => {
    setFormMode("create");
  };

  const handleAttachSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedKnowledgeBaseUuid) {
      alert("Please select a knowledge base");
      return;
    }

    try {
      await attachKnowledgeBase({
        agentId,
        knowledge_base_uuid: selectedKnowledgeBaseUuid,
      }).unwrap();
      handleCloseModal();
      // Refresh the page to show the updated knowledge bases
      router.refresh();
    } catch (error) {
      console.error("Error attaching knowledge base:", error);
      alert(
        error instanceof Error
          ? error.message
          : "Failed to attach knowledge base. Please try again."
      );
    }
  };

  const handleCreateSubmit = async (data: CreateKnowledgeBaseInput) => {
    try {
      const result = await createKnowledgeBase(data).unwrap();
      // After creating, attach it to the agent
      await attachKnowledgeBase({
        agentId,
        knowledge_base_uuid: result.knowledge_base.uuid,
      }).unwrap();
      handleCloseModal();
      // Refresh the page to show the updated knowledge bases
      router.refresh();
    } catch (error) {
      console.error("Error creating knowledge base:", error);
      throw error; // Let the form handle the error display
    }
  };

  return (
    <div
      className="flex flex-col h-screen bg-background text-foreground"
    >
      {/* Header */}
      <PageHeader
        title="Knowledge Base"
        description={`${agent.name} - Manage knowledge bases`}
        backHref={`/agent/${agentId}`}
        backAriaLabel="Back to Agent"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {knowledgeBases.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <h2 className="text-2xl font-semibold mb-2 text-accent-primary">
                  No knowledge bases yet
                </h2>
                <p className="text-foreground-secondary mb-6">
                  Attach a knowledge base to enhance your agent&apos;s capabilities with additional context and information.
                </p>
                <button
                  onClick={handleOpenModal}
                  className="bg-accent-primary text-foreground-bright px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium inline-flex items-center gap-2"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Knowledge Base
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Knowledge Bases ({knowledgeBases.length})
                </h2>
                <button
                  onClick={handleOpenModal}
                  className="bg-accent-primary text-foreground-bright px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium inline-flex items-center gap-2"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Add Knowledge Base
                </button>
              </div>

              <div className="bg-background-secondary border border-divider rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-divider">
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                          Name
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                          Status
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                          Added
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                          Last Indexed
                        </th>
                        <th className="text-right px-4 py-3 text-sm font-semibold text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {knowledgeBases.map((kb: KnowledgeBase, index: number) => (
                        <tr
                          key={kb.uuid}
                          className={`border-b border-divider ${
                            index === knowledgeBases.length - 1 ? "border-b-0" : ""
                          } hover:bg-background-deep transition-colors`}
                        >
                          <td className="px-4 py-3">
                            <span className="text-foreground font-medium">
                              {kb.name}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            {kb.last_indexing_job ? (
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                                  kb.last_indexing_job.status === "INDEX_JOB_STATUS_COMPLETED"
                                    ? "bg-accent-primary/20 text-accent-primary"
                                    : kb.last_indexing_job.status === "INDEX_JOB_STATUS_FAILED"
                                    ? "bg-accent-error/20 text-accent-error"
                                    : "bg-background-deep text-foreground-secondary"
                                }`}
                              >
                                {kb.last_indexing_job.status}
                              </span>
                            ) : (
                              <span className="text-foreground-secondary text-sm">
                                Not indexed
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-foreground-secondary text-sm">
                            {formatDate(kb.added_to_agent_at)}
                          </td>
                          <td className="px-4 py-3 text-foreground-secondary text-sm">
                            {kb.last_indexing_job?.finished_at
                              ? formatDate(kb.last_indexing_job.finished_at)
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Link
                              href={`/knowledge-bases/${kb.uuid}`}
                              className="text-accent-primary hover:opacity-80 transition-opacity text-sm font-medium px-3 py-1 rounded hover:bg-accent-primary/10 inline-block"
                              aria-label={`View details for ${kb.name}`}
                            >
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-secondary border border-divider rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                {formMode === "create"
                  ? "Create New Knowledge Base"
                  : "Attach Knowledge Base"}
              </h2>
              <button
                onClick={handleCloseModal}
                disabled={isAttaching || isCreating}
                className="text-foreground-secondary hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

            {formMode === "create" ? (
              <NewKnowledgeBaseForm
                onSubmit={handleCreateSubmit}
                onCancel={handleCloseModal}
                isSubmitting={isCreating || isAttaching}
              />
            ) : (
              <form onSubmit={handleAttachSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Knowledge Base <span className="text-accent-error">*</span>
                  </label>
                  {isLoadingKnowledgeBases ? (
                    <div className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground-secondary">
                      Loading knowledge bases...
                    </div>
                  ) : availableKnowledgeBases.length === 0 ? (
                    <div className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground-secondary">
                      No available knowledge bases. Create a new one to attach.
                    </div>
                  ) : (
                    <select
                      value={selectedKnowledgeBaseUuid}
                      onChange={(e) =>
                        setSelectedKnowledgeBaseUuid(e.target.value)
                      }
                      className="w-full bg-background border border-divider rounded-lg px-4 py-2 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                      required
                    >
                      <option value="">Select a knowledge base</option>
                      {availableKnowledgeBases.map((kb: KnowledgeBaseType) => (
                        <option key={kb.uuid} value={kb.uuid}>
                          {kb.name}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isAttaching}
                    className="flex-1 bg-background-deep text-foreground px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAttaching || !selectedKnowledgeBaseUuid}
                    className="flex-1 bg-accent-primary text-foreground-bright px-4 py-2 rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity font-medium"
                  >
                    {isAttaching ? "Attaching..." : "Attach Knowledge Base"}
                  </button>
                </div>

                <div className="pt-4 border-t border-divider">
                  <button
                    type="button"
                    onClick={handleCreateNewKnowledgeBase}
                    disabled={isAttaching}
                    className="w-full text-accent-primary hover:opacity-80 transition-opacity text-sm font-medium py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create A New Knowledge Base
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

