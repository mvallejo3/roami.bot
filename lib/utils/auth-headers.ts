"use server";

import { API_TOKEN } from "@/lib/utils/api-config";
import { getServerToken } from "@/lib/firebase/server";

/**
 * Get authorization header for API requests
 * Uses Firebase token if available, otherwise falls back to hardcoded token
 * TODO: Replace with proper API key management
 */
export async function getAuthHeaders(): Promise<HeadersInit> {
  const token = await getServerToken();
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    "Accept": "application/json",
  };

  // Use Firebase token if available, otherwise fall back to hardcoded token for now
  // if (token) {
    // headers["Authorization"] = `Bearer ${token}`;
  // } else {
    headers["Authorization"] = `Bearer ${API_TOKEN}`;
  // }

  return headers;
}

