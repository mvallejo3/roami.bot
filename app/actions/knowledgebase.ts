"use server";

import { API_BASE_URL, API_TOKEN } from "@/lib/utils/api-config";

export interface ChatResponse {
  answer: string;
}

export interface FileInfo {
  ETag: string;
  Key: string;
  LastModified: string;
  Size: number;
}

export interface FilesResponse {
  count: number;
  files: FileInfo[];
}

export async function getFiles(): Promise<FilesResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/files`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch files: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw new Error("Failed to fetch files");
  }
}

export interface DeleteFileResponse {
  message: string;
  key: string;
}

export async function deleteFile(key: string): Promise<DeleteFileResponse> {
  if (!key || typeof key !== "string") {
    throw new Error("File key is required");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/files?key=${key}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${API_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete file: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
}

export interface UploadFileResult {
  filename: string;
  key: string | null;
  success: boolean;
  error?: string;
}

export interface UploadFilesResponse {
  message: string;
  results: UploadFileResult[];
  successful: number;
  failed: number;
  total: number;
  folder: string | null;
}

export async function uploadFiles(formData: FormData): Promise<UploadFilesResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/files`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${API_TOKEN}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to upload files: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading files:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to upload files");
  }
}

export interface ReindexKnowledgeBaseResponse {
  message: string;
  knowledge_base_uuid: string;
  data_source_uuids?: string[];
}

export interface ReindexKnowledgeBaseParams {
  knowledge_base_uuid: string;
  data_source_uuids?: string[];
}

export async function reindexKnowledgeBase(
  params: ReindexKnowledgeBaseParams
): Promise<ReindexKnowledgeBaseResponse> {
  // Validate required parameter
  if (!params.knowledge_base_uuid || typeof params.knowledge_base_uuid !== "string") {
    throw new Error("knowledge_base_uuid is required and must be a string");
  }

  // Validate optional parameter if provided
  if (
    params.data_source_uuids !== undefined &&
    (!Array.isArray(params.data_source_uuids) ||
      !params.data_source_uuids.every((uuid) => typeof uuid === "string"))
  ) {
    throw new Error("data_source_uuids must be an array of strings");
  }

  try {
    const requestBody: {
      knowledge_base_uuid: string;
      data_source_uuids?: string[];
    } = {
      knowledge_base_uuid: params.knowledge_base_uuid,
    };

    // Only include data_source_uuids if provided
    if (params.data_source_uuids && params.data_source_uuids.length > 0) {
      requestBody.data_source_uuids = params.data_source_uuids;
    }

    const response = await fetch(`${API_BASE_URL}/api/knowledgebase/reindex`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to reindex knowledge base: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error reindexing knowledge base:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to reindex knowledge base"
    );
  }
}

