"use server";

import { API_BASE_URL, API_TOKEN } from "@/lib/utils/api-config";
import type {
  Agent,
  ApiAgent,
  CreateAgentInput,
  UpdateAgentInput,
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
  agent: Agent;
}

export interface UpdateKnowledgeBaseInput {
  knowledgeBaseUuid: string;
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
    headers["Authorization"] = `Bearer ${API_TOKEN}`;
  }

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
 * Update knowledgebase for an agent
 */
export async function updateAgentKnowledgeBase(
  id: string,
  input: UpdateKnowledgeBaseInput
): Promise<AgentResponse> {
  if (!id || typeof id !== "string") {
    throw new Error("Agent ID is required");
  }

  if (!input.knowledgeBaseUuid || typeof input.knowledgeBaseUuid !== "string") {
    throw new Error("Knowledge base UUID is required");
  }

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/agents/${id}/knowledgebase`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(input),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message ||
          `Failed to update agent knowledge base: ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error updating agent knowledge base:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Failed to update agent knowledge base"
    );
  }
}

/**
 * Delete an agent
 */
export async function deleteAgent(id: string): Promise<void> {
  if (!id || typeof id !== "string") {
    throw new Error("Agent ID is required");
  }

  try {
    const headers = await getAuthHeaders();
    const response = await fetch(`${API_BASE_URL}/api/agents?agentId=${id}`, {
      method: "DELETE",
      headers,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `Failed to delete agent: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error deleting agent:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete agent"
    );
  }
}

