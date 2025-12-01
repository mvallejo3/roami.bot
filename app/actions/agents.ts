"use server";

import { cookies } from "next/headers";
import { API_BASE_URL, API_TOKEN } from "@/lib/utils/api-config";
import type {
  ApiAgent,
  CreateAgentInput,
  UpdateAgentInput,
  CreateApiKeyInput,
  CreateApiKeyResponse,
} from "@/lib/types/agent";
import { getServerToken } from "@/lib/firebase/server";

/**
 * Response types matching the API structure
 */
export interface AgentsListResponse {
  agents: ApiAgent[];
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
  status: string;
}

export interface AgentResponse {
  agent: ApiAgent;
  status: string;
}

export interface UpdateKnowledgeBaseInput {
  knowledgeBaseUuid: string;
}

export interface AttachKnowledgeBaseInput {
  knowledge_base_uuid: string;
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
  headers["Authorization"] = `Bearer ${API_TOKEN}`;
  // if (token) {
  //   headers["Authorization"] = `Bearer ${token}`;
  // } else {
  //   headers["Authorization"] = `Bearer ${API_TOKEN}`;
  // }

  return headers;
}

/**
 * List all agents
 */
export async function listAgents(): Promise<AgentsListResponse> {
  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/agents`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch agents: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error listing agents:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to list agents"
    );
  }
}

/**
 * Get a single agent by ID
 */
export async function getAgent(id: string): Promise<AgentResponse> {
  if (!id || typeof id !== "string") {
    throw new Error("Agent ID is required");
  }

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/agents/${id}`, {
      method: "GET",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to fetch agent: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching agent:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch agent"
    );
  }
}

/**
 * Create a new agent
 */
export async function createAgent(input: CreateAgentInput): Promise<AgentResponse> {
  if (!input.name || typeof input.name !== "string") {
    throw new Error("Agent name is required");
  }
  if (!input.instructions || typeof input.instructions !== "string") {
    throw new Error("Agent instructions is required");
  }

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/agents`, {
      method: "POST",
      headers,
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to create agent: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating agent:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create agent"
    );
  }
}

/**
 * Update an existing agent
 */
export async function updateAgent(
  id: string,
  input: UpdateAgentInput
): Promise<AgentResponse> {
  if (!id || typeof id !== "string") {
    throw new Error("Agent ID is required");
  }

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/agents/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to update agent: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating agent:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update agent"
    );
  }
}

/**
 * Delete an agent
 */
export async function deleteAgent(id: string): Promise<AgentResponse> {
  if (!id || typeof id !== "string") {
    throw new Error("Agent ID is required");
  }

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/agents/${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to delete agent: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error deleting agent:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete agent"
    );
  }
}

/**
 * Create an API key for an agent
 */
export async function createApiKey(
  agentId: string,
  input: CreateApiKeyInput
): Promise<CreateApiKeyResponse> {
  if (!agentId || typeof agentId !== "string") {
    throw new Error("Agent ID is required");
  }
  if (!input.name || typeof input.name !== "string") {
    throw new Error("API key name is required");
  }

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_BASE_URL}/api/agents/${agentId}/api-keys`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          id: agentId,
          name: input.name,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to create API key: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error creating API key:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create API key"
    );
  }
}

/**
 * Attach a knowledge base to an agent
 */
export async function attachKnowledgeBase(
  agentId: string,
  input: AttachKnowledgeBaseInput
): Promise<AgentResponse> {
  if (!agentId || typeof agentId !== "string") {
    throw new Error("Agent ID is required");
  }
  if (!input.knowledge_base_uuid || typeof input.knowledge_base_uuid !== "string") {
    throw new Error("Knowledge base UUID is required");
  }

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(
      `${API_BASE_URL}/api/agents/${agentId}/attach-knowledgebase`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          knowledge_base_uuid: input.knowledge_base_uuid,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to attach knowledge base: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error attaching knowledge base:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to attach knowledge base"
    );
  }
}

/**
 * Get the cookie name for an agent's API key
 */
function getApiKeyCookieName(agentUuid: string): string {
  return `agent-api-key-${agentUuid}`;
}

/**
 * Get API key from cookie (read-only, does not create)
 */
export async function getApiKeyFromCookie(agentUuid: string): Promise<string> {
  const cookieStore = await cookies();
  const cookieName = getApiKeyCookieName(agentUuid);
  const existingCookie = cookieStore.get(cookieName);

  // If cookie exists, decode it from base64
  if (existingCookie?.value) {
    try {
      const decodedKey = Buffer.from(existingCookie.value, "base64").toString("utf-8");
      return decodedKey;
    } catch (error) {
      // If decoding fails, return empty string
      console.error("Failed to decode API key cookie:", error);
      return "";
    }
  }

  return "";
}

/**
 * Create API key and save it to cookie
 * This is a Server Action that can modify cookies
 */
export async function createAndSaveApiKey(
  agentId: string,
  agentUuid: string
): Promise<string> {
  const cookieStore = await cookies();
  const cookieName = getApiKeyCookieName(agentUuid);

  try {
    const apiKeyResponse = await createApiKey(agentId, {
      id: agentId,
      name: `Session API Key - ${new Date().toISOString()}`,
    });

    const secretKey = apiKeyResponse.api_key_info.secret_key;

    // Encode the secret key as base64 and save it as a cookie
    const encodedKey = Buffer.from(secretKey, "utf-8").toString("base64");
    
    cookieStore.set(cookieName, encodedKey, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      // Session cookie (no maxAge means it expires when browser closes)
    });

    return secretKey;
  } catch (error) {
    console.error("Failed to create API key:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create API key"
    );
  }
}
