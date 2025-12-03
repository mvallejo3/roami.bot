"use client";

import { useEffect, useState, useRef } from "react";
import PageHeader from "@/lib/components/PageHeader";
import type { KnowledgeBaseDetailsResponse } from "@/lib/types/knowledgebase";
import type { FileInfo, FilesResponse } from "@/app/actions/knowledgebase";
import { getFiles, uploadFiles } from "@/app/actions/knowledgebase";

interface KnowledgeBaseDetailsPageContentProps {
  knowledgeBaseDetails: KnowledgeBaseDetailsResponse;
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return "—";
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

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

const getStatusBadgeClass = (status: string): string => {
  if (status === "DATA_SOURCE_STATUS_UPDATED" || status === "INDEX_JOB_STATUS_COMPLETED") {
    return "bg-accent-primary/20 text-accent-primary";
  }
  
  if (status === "DATA_SOURCE_STATUS_FAILED" || status === "INDEX_JOB_STATUS_FAILED") {
    return "bg-accent-error/20 text-accent-error";
  }
  
  return "bg-background-deep text-foreground-secondary";
};

const getStatusLabel = (status: string): string => {
  return status
    .replace("DATA_SOURCE_STATUS_", "")
    .replace("INDEX_JOB_STATUS_", "")
    .toLowerCase()
    .replace(/_/g, " ");
};

export default function KnowledgeBaseDetailsPageContent({
  knowledgeBaseDetails,
}: KnowledgeBaseDetailsPageContentProps) {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(true);
  const [filesError, setFilesError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const successTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { knowledge_base, data_sources } = knowledgeBaseDetails;
  
  // Get the first datasource's bucket name
  const bucketName = data_sources[0]?.spaces_data_source?.bucket_name;

  useEffect(() => {
    const fetchFiles = async () => {
      if (!bucketName) {
        setIsLoadingFiles(false);
        return;
      }

      try {
        setIsLoadingFiles(true);
        setFilesError(null);
        const filesData: FilesResponse = await getFiles(bucketName);
        setFiles(filesData.files || []);
      } catch (error) {
        console.error("Error fetching files:", error);
        setFilesError(
          error instanceof Error ? error.message : "Failed to fetch files"
        );
      } finally {
        setIsLoadingFiles(false);
      }
    };

    fetchFiles();
  }, [bucketName]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) {
      return;
    }

    if (!bucketName) {
      setUploadError("No bucket name available. Cannot upload files.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError(null);
      setUploadSuccess(null);
      
      // Clear any existing timeouts
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
        successTimeoutRef.current = null;
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
        errorTimeoutRef.current = null;
      }

      const formData = new FormData();
      for (let i = 0; i < selectedFiles.length; i++) {
        formData.append("files", selectedFiles[i]);
      }

      const result = await uploadFiles(formData, bucketName);

      if (result.successful > 0) {
        const successMessage = `Successfully uploaded ${result.successful} file${result.successful > 1 ? "s" : ""}`;
        setUploadSuccess(successMessage);
        // Refresh the file list
        const filesData: FilesResponse = await getFiles(bucketName);
        setFiles(filesData.files || []);
        // Clear the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        // Clear success message after 5 seconds
        successTimeoutRef.current = setTimeout(() => {
          setUploadSuccess(null);
          successTimeoutRef.current = null;
        }, 5000);
      }

      if (result.failed > 0) {
        const failedFiles = result.results
          .filter((r) => !r.success)
          .map((r) => r.filename)
          .join(", ");
        const errorMessage = `Failed to upload ${result.failed} file${result.failed > 1 ? "s" : ""}: ${failedFiles}`;
        setUploadError(errorMessage);
        // Clear error message after 8 seconds
        errorTimeoutRef.current = setTimeout(() => {
          setUploadError(null);
          errorTimeoutRef.current = null;
        }, 8000);
      }
    } catch (error) {
      console.error("Error uploading files:", error);
      setUploadError(
        error instanceof Error ? error.message : "Failed to upload files"
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      {/* Header */}
      <PageHeader
        title={knowledge_base.name}
        description={`Knowledge Base Details • ${knowledge_base.uuid}`}
        backHref="/knowledge-bases"
        backAriaLabel="Back to Knowledge Bases"
      />

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Knowledge Base Info */}
          <div className="bg-background-secondary border border-divider rounded-lg p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Knowledge Base Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-foreground-secondary mb-1">Name</p>
                <p className="text-foreground font-medium">{knowledge_base.name}</p>
              </div>
              <div>
                <p className="text-sm text-foreground-secondary mb-1">Region</p>
                <p className="text-foreground font-medium">{knowledge_base.region}</p>
              </div>
              <div>
                <p className="text-sm text-foreground-secondary mb-1">Database Status</p>
                <p className="text-foreground font-medium">{knowledgeBaseDetails.database_status}</p>
              </div>
              <div>
                <p className="text-sm text-foreground-secondary mb-1">Created</p>
                <p className="text-foreground font-medium">
                  {formatDate(knowledge_base.created_at)}
                </p>
              </div>
              {knowledge_base.tags && knowledge_base.tags.length > 0 && (
                <div className="md:col-span-2">
                  <p className="text-sm text-foreground-secondary mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {knowledge_base.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-background-deep text-foreground-secondary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Last Indexing Job */}
          {knowledge_base.last_indexing_job && (
            <div className="bg-background-secondary border border-divider rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Last Indexing Job
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-foreground-secondary">Status:</span>
                  <span
                    className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(
                      knowledge_base.last_indexing_job.status
                    )}`}
                  >
                    {getStatusLabel(knowledge_base.last_indexing_job.status)}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-foreground-secondary mb-1">Started</p>
                    <p className="text-foreground font-medium">
                      {formatDate(knowledge_base.last_indexing_job.started_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-secondary mb-1">Finished</p>
                    <p className="text-foreground font-medium">
                      {formatDate(knowledge_base.last_indexing_job.finished_at)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-secondary mb-1">Phase</p>
                    <p className="text-foreground font-medium">
                      {knowledge_base.last_indexing_job.phase.replace(/_/g, " ").toLowerCase()}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-foreground-secondary mb-1">Total Tokens</p>
                    <p className="text-foreground font-medium">
                      {/* {knowledge_base.last_indexing_job.total_tokens || knowledge_base.last_indexing_job.tokens} */}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Sources */}
          {data_sources.length > 0 && (
            <div className="bg-background-secondary border border-divider rounded-lg p-6">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Data Sources ({data_sources.length})
              </h2>
              <div className="space-y-4">
                {data_sources.map((dataSource) => (
                  <div
                    key={dataSource.uuid}
                    className="border border-divider rounded-lg p-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-foreground-secondary mb-1">Bucket Name</p>
                        <p className="text-foreground font-medium">
                          {dataSource.bucket_name}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-foreground-secondary mb-1">Region</p>
                        <p className="text-foreground font-medium">{dataSource.region}</p>
                      </div>
                      {dataSource.file_upload_data_source && (
                        <>
                          <div className="md:col-span-2 border-t border-divider pt-4 mt-2">
                            <p className="text-sm font-semibold text-foreground mb-3">File Upload Information</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <p className="text-sm text-foreground-secondary mb-1">Original File Name</p>
                                <p className="text-foreground font-medium">
                                  {dataSource.file_upload_data_source.original_file_name}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-foreground-secondary mb-1">File Size</p>
                                <p className="text-foreground font-medium">
                                  {formatFileSize(parseInt(dataSource.file_upload_data_source.size_in_bytes, 10))}
                                </p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="text-sm text-foreground-secondary mb-1">Stored Object Key</p>
                                <p className="text-foreground font-medium break-all">
                                  {dataSource.file_upload_data_source.stored_object_key}
                                </p>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                      {dataSource.last_datasource_indexing_job && (
                        <div className="md:col-span-2">
                          <p className="text-sm text-foreground-secondary mb-2">Last Indexing Status</p>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusBadgeClass(
                                dataSource.last_datasource_indexing_job.status
                              )}`}
                            >
                              {getStatusLabel(dataSource.last_datasource_indexing_job.status)}
                            </span>
                            {dataSource.last_datasource_indexing_job.completed_at && (
                              <span className="text-sm text-foreground-secondary">
                                {formatDate(dataSource.last_datasource_indexing_job.completed_at)}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files List */}
          <div className="bg-background-secondary border border-divider rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">
                Files {bucketName && `(${bucketName})`}
              </h2>
              {bucketName && (
                <div className="flex items-center gap-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                    aria-label="Select files to upload"
                  />
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    className="px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    {isUploading ? "Uploading..." : "Upload Files"}
                  </button>
                </div>
              )}
            </div>
            {uploadSuccess && (
              <div className="mb-4 p-3 bg-accent-primary/20 text-accent-primary rounded-lg text-sm">
                {uploadSuccess}
              </div>
            )}
            {uploadError && (
              <div className="mb-4 p-3 bg-accent-error/20 text-accent-error rounded-lg text-sm">
                {uploadError}
              </div>
            )}
            {isLoadingFiles ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-foreground-secondary">Loading files...</p>
              </div>
            ) : filesError ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-accent-error">{filesError}</p>
              </div>
            ) : files.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-foreground-secondary">No files found in this bucket</p>
              </div>
            ) : (
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
                          <span className="text-foreground font-medium">{file.Key}</span>
                        </td>
                        <td className="px-4 py-3 text-foreground-secondary text-sm">
                          {formatFileSize(file.Size)}
                        </td>
                        <td className="px-4 py-3 text-foreground-secondary text-sm">
                          {formatDate(file.LastModified)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

