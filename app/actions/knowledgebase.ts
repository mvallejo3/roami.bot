"use server";

import { API_BASE_URL, API_TOKEN } from "@/lib/utils/api-config";
import { getAuthHeaders } from "@/lib/utils/auth-headers";
import type {
  KnowledgeBasesListResponse,
  CreateBucketInput,
  BucketResponse,
  CreateKnowledgeBaseInput,
  KnowledgeBaseResponse,
  KnowledgeBaseDetailsResponse,
} from "@/lib/types/knowledgebase";

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

export async function getFiles(bucketName?: string): Promise<FilesResponse> {
  try {
    const url = bucketName
      ? `${API_BASE_URL}/api/files?bucket=${encodeURIComponent(bucketName)}`
      : `${API_BASE_URL}/api/files`;
    
    const headers = await getAuthHeaders();
    const response = await fetch(url, {
      method: "GET",
      headers: {
        ...headers,
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch files: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching files:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch files"
    );
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

export async function uploadFiles(formData: FormData, bucketName?: string): Promise<UploadFilesResponse> {
  try {
    const url = bucketName
      ? `${API_BASE_URL}/api/files?bucket=${encodeURIComponent(bucketName)}`
      : `${API_BASE_URL}/api/files`;
    
    const response = await fetch(url, {
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


/**
 * List all knowledge bases
 */
export async function listKnowledgeBases(): Promise<KnowledgeBasesListResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/knowledgebase`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch knowledge bases: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error listing knowledge bases:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to list knowledge bases"
    );
  }
}

/**
 * Get knowledge base details by ID
 */
export async function getKnowledgeBaseDetails(
  id: string
): Promise<KnowledgeBaseDetailsResponse> {
  if (!id || typeof id !== "string") {
    throw new Error("Knowledge base ID is required");
  }

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/knowledgebase/${id}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch knowledge base details: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching knowledge base details:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch knowledge base details"
    );
  }
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

/**
 * Create a bucket for storing files
 */
export async function createBucket(
  input: CreateBucketInput
): Promise<BucketResponse> {
  if (!input.name || typeof input.name !== "string") {
    throw new Error("Bucket name is required");
  }
  if (!input.region || typeof input.region !== "string") {
    throw new Error("Bucket region is required");
  }

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/buckets`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: input.name,
        region: input.region,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create bucket: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating bucket:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create bucket"
    );
  }
}

/**
 * Create a new knowledge base
 * This function first creates a bucket, then creates the knowledge base
 */
export async function createKnowledgeBase(
  input: CreateKnowledgeBaseInput
): Promise<KnowledgeBaseResponse> {
  if (!input.name || typeof input.name !== "string") {
    throw new Error("Knowledge base name is required");
  }
  // if (!input.project_id || typeof input.project_id !== "string") {
  //   throw new Error("Project ID is required");
  // }
  if (!input.embedding_model_uuid || typeof input.embedding_model_uuid !== "string") {
    throw new Error("Embedding model UUID is required");
  }
  if (!input.database_id || typeof input.database_id !== "string") {
    throw new Error("Database ID is required");
  }
  if (!input.datasources || !Array.isArray(input.datasources) || input.datasources.length === 0) {
    throw new Error("At least one datasource is required");
  }

  try {
    const headers = await getAuthHeaders();
    
    // Extract bucket info from datasources
    const bucketInfo = input.datasources[0]?.spaces_data_source;
    if (!bucketInfo) {
      throw new Error("Invalid datasource configuration");
    }

    // First, create the bucket
    const bucketResponse = await fetch(`${API_BASE_URL}/api/buckets`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        name: bucketInfo.bucket_name,
        region: bucketInfo.region,
      }),
    });

    if (!bucketResponse.ok) {
      const errorData = await bucketResponse.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create bucket: ${bucketResponse.statusText}`
      );
    }

    // Then, create the knowledge base
    const kbResponse = await fetch(`${API_BASE_URL}/api/knowledgebase`, {
      method: "POST",
      headers,
      body: JSON.stringify(input),
    });

    if (!kbResponse.ok) {
      const errorData = await kbResponse.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create knowledge base: ${kbResponse.statusText}`
      );
    }

    const data = await kbResponse.json();
    return data;
  } catch (error) {
    console.error("Error creating knowledge base:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create knowledge base"
    );
  }
}

