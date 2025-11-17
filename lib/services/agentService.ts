/**
 * Client-side agent service for managing agents
 * Uses localStorage for now, can be migrated to Firestore later
 */

import type { Agent, CreateAgentInput, UpdateAgentInput } from "@/lib/types/agent";

const AGENTS_STORAGE_KEY = "roami_agents";

/**
 * Get all agents from localStorage
 */
export function getAgents(): Agent[] {
  if (typeof window === "undefined") return [];
  
  try {
    const stored = localStorage.getItem(AGENTS_STORAGE_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as Agent[];
  } catch (error) {
    console.error("Error reading agents from localStorage:", error);
    return [];
  }
}

/**
 * Get a single agent by ID
 */
export function getAgent(id: string): Agent | null {
  const agents = getAgents();
  return agents.find((agent) => agent.id === id) || null;
}

/**
 * Create a new agent
 */
export function createAgent(input: CreateAgentInput): Agent {
  const agents = getAgents();
  const now = Date.now();
  
  const newAgent: Agent = {
    id: `agent_${now}_${Math.random().toString(36).substr(2, 9)}`,
    ...input,
    createdAt: now,
    updatedAt: now,
  };
  
  agents.push(newAgent);
  saveAgents(agents);
  
  return newAgent;
}

/**
 * Update an existing agent
 */
export function updateAgent(id: string, input: UpdateAgentInput): Agent {
  const agents = getAgents();
  const index = agents.findIndex((agent) => agent.id === id);
  
  if (index === -1) {
    throw new Error(`Agent with id ${id} not found`);
  }
  
  const updatedAgent: Agent = {
    ...agents[index],
    ...input,
    updatedAt: Date.now(),
  };
  
  agents[index] = updatedAgent;
  saveAgents(agents);
  
  return updatedAgent;
}

/**
 * Delete an agent
 */
export function deleteAgent(id: string): void {
  const agents = getAgents();
  const filtered = agents.filter((agent) => agent.id !== id);
  
  if (filtered.length === agents.length) {
    throw new Error(`Agent with id ${id} not found`);
  }
  
  saveAgents(filtered);
}

/**
 * Save agents to localStorage
 */
function saveAgents(agents: Agent[]): void {
  if (typeof window === "undefined") return;
  
  try {
    localStorage.setItem(AGENTS_STORAGE_KEY, JSON.stringify(agents));
  } catch (error) {
    console.error("Error saving agents to localStorage:", error);
    throw new Error("Failed to save agents");
  }
}

