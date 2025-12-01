"use client";

import { useState } from "react";
import PageHeader from "@/lib/components/PageHeader";
import NewKnowledgeBaseForm from "@/lib/components/NewKnowledgeBaseForm";
import { useCreateKnowledgeBaseMutation } from "@/store/features/knowledgebase/knowledgebaseApi";
import type { KnowledgeBase } from "@/lib/types/knowledgebase";
import type { CreateKnowledgeBaseInput } from "@/lib/types/knowledgebase";

interface KnowledgeBasesPageContentProps {
  knowledgeBases: KnowledgeBase[];
  total: number;
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

const getStatusBadgeClass = (status: string | null): string => {
  if (!status) {
    return "bg-background-deep text-foreground-secondary";
  }
  
  if (status === "INDEX_JOB_STATUS_COMPLETED") {
    return "bg-accent-primary/20 text-accent-primary";
  }
  
  if (status === "INDEX_JOB_STATUS_FAILED") {
    return "bg-accent-error/20 text-accent-error";
  }
  
  return "bg-background-deep text-foreground-secondary";
};

const getStatusLabel = (status: string | null): string => {
  if (!status) {
    return "Not indexed";
  }
  
  // Remove the INDEX_JOB_STATUS_ prefix for display
  return status.replace("INDEX_JOB_STATUS_", "").toLowerCase().replace(/_/g, " ");
};

export default function KnowledgeBasesPageContent({
  knowledgeBases,
  total,
}: KnowledgeBasesPageContentProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [createKnowledgeBase, { isLoading: isCreating }] =
    useCreateKnowledgeBaseMutation();

  const handleCreateKnowledgeBase = () => {
    setIsFormOpen(true);
  };

  const handleSubmit = async (data: CreateKnowledgeBaseInput) => {
    try {
      await createKnowledgeBase(data).unwrap();
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error creating knowledge base:", error);
      throw error; // Let the form handle the error display
    }
  };

  const handleCancel = () => {
    setIsFormOpen(false);
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-background text-foreground pt-16">
        {/* Header */}
        <PageHeader
          title="Knowledge Bases"
          description="Manage your knowledge bases"
          rightAction={
            <button
              onClick={handleCreateKnowledgeBase}
              className="bg-accent-primary text-foreground-bright px-4 py-2 rounded-lg hover:opacity-90 transition-opacity font-medium text-sm sm:text-base inline-flex items-center gap-2"
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
              New Knowledge Base
            </button>
          }
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
                  Create your first knowledge base to store and organize your data.
                </p>
                <button
                  onClick={handleCreateKnowledgeBase}
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
                  Create Knowledge Base
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Knowledge Bases ({total})
                </h2>
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
                          Created
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
                                className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(
                                  kb.last_indexing_job.status
                                )}`}
                              >
                                {getStatusLabel(kb.last_indexing_job.status)}
                              </span>
                            ) : (
                              <span className="text-foreground-secondary text-sm">
                                Not indexed
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-foreground-secondary text-sm">
                            {formatDate(kb.created_at)}
                          </td>
                          <td className="px-4 py-3 text-foreground-secondary text-sm">
                            {kb.last_indexing_job?.finished_at
                              ? formatDate(kb.last_indexing_job.finished_at)
                              : "—"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              className="text-accent-primary hover:opacity-80 transition-opacity text-sm font-medium px-3 py-1 rounded hover:bg-accent-primary/10"
                              aria-label={`View details for ${kb.name}`}
                            >
                              View
                            </button>
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
    </div>

      {/* Create Knowledge Base Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background-secondary border border-divider rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-foreground">
                Create New Knowledge Base
              </h2>
              <button
                onClick={handleCancel}
                disabled={isCreating}
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

            <NewKnowledgeBaseForm
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isCreating}
            />
          </div>
        </div>
      )}
    </>
  );
}

