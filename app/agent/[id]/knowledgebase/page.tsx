"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getFiles, deleteFile, uploadFiles, reindexKnowledgeBase, type FileInfo } from "@/app/actions/knowledgebase";
import { useStandalone } from "@/lib/hooks/useStandalone";
import { useGetAgentQuery } from "@/store/features/agents/agentApi";
import PageHeader from "@/lib/components/PageHeader";

export default function KnowledgebasePage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;
  const { data: agentData, isLoading: isLoadingAgent, error: agentError } = useGetAgentQuery(agentId);
  const agent = agentData?.agent || null;
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isReindexing, setIsReindexing] = useState(false);
  const [reindexError, setReindexError] = useState<string | null>(null);
  const [reindexSuccess, setReindexSuccess] = useState<string | null>(null);
  const [knowledgeBaseUuid, setKnowledgeBaseUuid] = useState("");

  useEffect(() => {
    if (agentError) {
      router.push("/");
    }
  }, [agentError, router]);

  useEffect(() => {
    if (agent?.knowledgeBaseUuid) {
      setKnowledgeBaseUuid(agent.knowledgeBaseUuid);
    }
  }, [agent]);

  useEffect(() => {
    if (knowledgeBaseUuid) {
      fetchFiles();
    }
  }, [knowledgeBaseUuid]);

  const fetchFiles = async () => {
    if (!knowledgeBaseUuid) return;
    
    setIsLoading(true);
    setError(null);
    try {
      const data = await getFiles();
      setFiles(data.files || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load files");
      console.error("Error fetching files:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  const handleDelete = async (fileKey: string) => {
    if (!confirm(`Are you sure you want to delete "${fileKey}"?`)) {
      return;
    }

    try {
      await deleteFile(fileKey);
      // Refresh the file list after successful deletion
      await fetchFiles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete file");
      console.error("Error deleting file:", err);
    }
  };

  const handleFileUpload = async (filesToUpload: FileList | File[]) => {
    if (filesToUpload.length === 0) return;

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    try {
      const formData = new FormData();
      Array.from(filesToUpload).forEach((file) => {
        formData.append("file", file);
      });

      const result = await uploadFiles(formData);

      if (result.successful > 0) {
        setUploadSuccess(
          `Successfully uploaded ${result.successful} file${result.successful > 1 ? "s" : ""}${result.failed > 0 ? ` (${result.failed} failed)` : ""}`
        );
        // Refresh the file list after successful upload
        await fetchFiles();
        // Clear success message after 5 seconds
        setTimeout(() => setUploadSuccess(null), 5000);
      }

      if (result.failed > 0 && result.successful === 0) {
        const errorMessages = result.results
          .filter((r) => !r.success)
          .map((r) => `${r.filename}: ${r.error || "Unknown error"}`)
          .join(", ");
        setUploadError(`Failed to upload files: ${errorMessages}`);
      } else if (result.failed > 0) {
        const errorMessages = result.results
          .filter((r) => !r.success)
          .map((r) => `${r.filename}: ${r.error || "Unknown error"}`)
          .join(", ");
        setUploadError(`Some files failed: ${errorMessages}`);
      }
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Failed to upload files");
      console.error("Error uploading files:", err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files);
      // Reset the input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleReindex = async () => {
    if (!knowledgeBaseUuid.trim()) {
      setReindexError("Knowledge base UUID is required");
      return;
    }

    setIsReindexing(true);
    setReindexError(null);
    setReindexSuccess(null);

    try {
      const result = await reindexKnowledgeBase({
        knowledge_base_uuid: knowledgeBaseUuid.trim(),
      });
      setReindexSuccess(result.message || "Knowledge base re-indexing started successfully");
      // Clear success message after 5 seconds
      setTimeout(() => setReindexSuccess(null), 5000);
    } catch (err) {
      setReindexError(err instanceof Error ? err.message : "Failed to reindex knowledge base");
      console.error("Error reindexing knowledge base:", err);
    } finally {
      setIsReindexing(false);
    }
  };

  const isStandalone = useStandalone();

  if (isLoadingAgent) {
    return (
      <div
        className="flex flex-col h-screen bg-background text-foreground items-center justify-center"
        style={{ paddingTop: isStandalone ? "36px" : "0" }}
      >
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
        <p className="text-foreground-secondary">Loading agent...</p>
      </div>
    );
  }

  if (!agent) {
    return null;
  }

  return (
    <div
      className="flex flex-col h-screen bg-background text-foreground"
      style={{ paddingTop: isStandalone ? "36px" : "0" }}
    >
      {/* Header */}
      <PageHeader
        title="Knowledgebase"
        description={`${agent.name} - Manage your knowledgebase files`}
        backHref={`/agent/${agentId}`}
        backAriaLabel="Back to Agent"
        rightAction={
          <div className="flex items-center gap-4">
            <div className="text-sm font-medium text-foreground">
              {files.length} out of 10 files
            </div>
            <Link
              href="/"
              className="bg-accent-primary text-foreground-bright p-2 rounded-lg hover:opacity-90 transition-opacity"
              aria-label="Go to Dashboard"
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            </Link>
          </div>
        }
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {!knowledgeBaseUuid ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-foreground-secondary text-lg mb-2">
                  No knowledge base configured
                </p>
                <p className="text-foreground-secondary text-sm">
                  Please configure a knowledge base UUID for this agent
                </p>
              </div>
            </div>
          ) : isLoading ? (
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
                <p className="text-foreground-secondary">Loading files...</p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-background-secondary border border-divider rounded-lg p-6 text-center">
              <p className="text-accent-error mb-4">{error}</p>
              <button
                onClick={fetchFiles}
                className="bg-accent-primary text-foreground-bright px-4 py-2 rounded-lg font-medium hover:opacity-90 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : files.length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <p className="text-foreground-secondary text-lg mb-2">
                  No files found
                </p>
                <p className="text-foreground-secondary text-sm">
                  Your knowledgebase is empty
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <p className="text-foreground-secondary">
                  {files.length} out of 10 files
                </p>
                <button
                  onClick={fetchFiles}
                  className="text-sm text-accent-primary hover:opacity-80 transition-opacity"
                >
                  Refresh
                </button>
              </div>

              <div className="bg-background-secondary border border-divider rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-divider">
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                          File Name
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                          Size
                        </th>
                        <th className="text-left px-4 py-3 text-sm font-semibold text-foreground">
                          Last Modified
                        </th>
                        <th className="text-right px-4 py-3 text-sm font-semibold text-foreground">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {files.map((file, index) => (
                        <tr
                          key={file.Key}
                          className={`border-b border-divider ${
                            index === files.length - 1 ? "border-b-0" : ""
                          } hover:bg-background-deep transition-colors`}
                        >
                          <td className="px-4 py-3">
                            <span className="text-foreground font-medium">
                              {file.Key}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-foreground-secondary">
                            {formatFileSize(file.Size)}
                          </td>
                          <td className="px-4 py-3 text-foreground-secondary">
                            {formatDate(file.LastModified)}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button
                              onClick={() => handleDelete(file.Key)}
                              className="text-accent-error hover:opacity-80 transition-opacity text-sm font-medium px-3 py-1 rounded hover:bg-accent-error/10"
                            >
                              Delete
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

          {/* Re-index Section */}
          {knowledgeBaseUuid && (
            <div className="mt-6">
              <div className="bg-background-secondary border border-divider rounded-lg p-6">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  Re-index Knowledge Base
                </h2>
                <p className="text-sm text-foreground-secondary mb-4">
                  Re-index your knowledge base to update search results and
                  improve accuracy.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <input
                    type="text"
                    value={knowledgeBaseUuid}
                    onChange={(e) => setKnowledgeBaseUuid(e.target.value)}
                    placeholder="Enter knowledge base UUID"
                    className="flex-1 px-4 py-2 bg-background border border-divider rounded-lg text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent"
                    disabled={isReindexing}
                  />
                  <button
                    onClick={handleReindex}
                    disabled={isReindexing || !knowledgeBaseUuid.trim()}
                    className={`inline-flex items-center justify-center px-6 py-2 rounded-lg font-medium transition-colors ${
                      isReindexing || !knowledgeBaseUuid.trim()
                        ? "bg-background-deep text-foreground-secondary cursor-not-allowed"
                        : "bg-accent-primary text-foreground-bright hover:opacity-90"
                    }`}
                  >
                    {isReindexing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-foreground-secondary border-t-transparent rounded-full animate-spin mr-2"></div>
                        Re-indexing...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                          />
                        </svg>
                        Re-index
                      </>
                    )}
                  </button>
                </div>

                {/* Re-index Messages */}
                {reindexSuccess && (
                  <div className="mt-4 bg-background-secondary border border-accent-primary rounded-lg p-4">
                    <p className="text-accent-primary text-sm">
                      {reindexSuccess}
                    </p>
                  </div>
                )}
                {reindexError && (
                  <div className="mt-4 bg-background-secondary border border-accent-error rounded-lg p-4">
                    <p className="text-accent-error text-sm">{reindexError}</p>
                    <button
                      onClick={() => setReindexError(null)}
                      className="text-xs text-accent-error hover:opacity-80 mt-2"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Upload Section */}
          {knowledgeBaseUuid && (
            <div className="mt-6">
              <div
                className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
                  isDragging
                    ? "border-accent-primary bg-accent-primary/10"
                    : "border-divider bg-background-secondary"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileSelect}
                    className="hidden"
                    id="file-upload"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="file-upload"
                    className={`inline-flex items-center px-4 py-2 rounded-lg font-medium cursor-pointer transition-colors ${
                      isUploading
                        ? "bg-background-deep text-foreground-secondary cursor-not-allowed"
                        : "bg-accent-primary text-foreground-bright hover:opacity-90"
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-foreground-secondary border-t-transparent rounded-full animate-spin mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-5 h-5 mr-2"
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
                        Upload Files
                      </>
                    )}
                  </label>
                  <p className="text-sm text-foreground-secondary mt-2">
                    Drag and drop files here, or click to select files
                  </p>
                </div>
              </div>

              {/* Upload Messages */}
              {uploadSuccess && (
                <div className="mt-4 bg-background-secondary border border-accent-primary rounded-lg p-4">
                  <p className="text-accent-primary text-sm">{uploadSuccess}</p>
                </div>
              )}
              {uploadError && (
                <div className="mt-4 bg-background-secondary border border-accent-error rounded-lg p-4">
                  <p className="text-accent-error text-sm">{uploadError}</p>
                  <button
                    onClick={() => setUploadError(null)}
                    className="text-xs text-accent-error hover:opacity-80 mt-2"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

