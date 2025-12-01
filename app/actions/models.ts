"use server";

import { API_BASE_URL, API_TOKEN } from "@/lib/utils/api-config";
import type { Model } from "@/lib/types/model";
import { getAuthHeaders } from "@/lib/utils/auth-headers";

/**
 * Response types matching the API structure
 */
export interface ModelsListResponse {
  links: {
    pages: {
      first: string;
      last: string;
    };
  };
  meta: {
    page: number;
    pages: number;
    total: number;
  };
  models: Model[];
  status: string;
}


/**
 * List all public models
 */
export async function listModels(): Promise<ModelsListResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/models`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch models: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error listing models:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to list models"
    );
  }
}

/**
 * Get the list of model UUIDs that don't require an API key
 */
export async function getNoApiKeyRequiredModels(): Promise<string[]> {
  const envValue = process.env.NO_API_KEY_REQUIRED_MODEL_UUIDS;
  if (!envValue) {
    return [];
  }
  return envValue.split(",").map((uuid) => uuid.trim()).filter(Boolean);
}

