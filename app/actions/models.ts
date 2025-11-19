"use server";

import { API_BASE_URL } from "@/lib/utils/api-config";
import type { Model } from "@/lib/types/model";
import { getServerToken } from "@/lib/firebase/server";

/**
 * Response types matching the API structure
 */
export interface ModelsListResponse {
  models: Model[];
  count?: number;
}

/**
 * Get authorization header for API requests
 */
async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getServerToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  // Use Firebase token if available, otherwise fall back to hardcoded token for now
  // TODO: Replace with proper API key management
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  } else {
    headers["Authorization"] = `Bearer ia7nFajOnI90BXpVZwo_bOjL4h6MdYNz`;
  }

  return headers;
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

