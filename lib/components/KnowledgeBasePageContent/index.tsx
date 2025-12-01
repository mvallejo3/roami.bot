"use client";

import { useStandalone } from "@/lib/hooks/useStandalone";
import PageHeader from "@/lib/components/PageHeader";
import type { ApiAgent, KnowledgeBase } from "@/lib/types/agent";

interface KnowledgeBasePageContentProps {
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

export default function KnowledgeBasePageContent({
  agent,
  agentId,
  knowledgeBases,
}: KnowledgeBasePageContentProps) {
  const isStandalone = useStandalone();

  const handleCreateKnowledgeBase = () => {
    // TODO: Implement knowledge base creation/attachment flow
    console.log("Create/attach knowledge base");
  };

  return (
    <div
      className="flex flex-col h-screen bg-background text-foreground"
      style={{ paddingTop: isStandalone ? "36px" : "0" }}
    >
      {/* Header */}
      <PageHeader
        title="Knowledge Bases"
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
                  Create or Attach Knowledge Base
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
                  onClick={handleCreateKnowledgeBase}
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
  );
}

