"use server";

import type { Agent, CreateAgentInput, UpdateAgentInput } from "@/lib/types/agent";
import { getServerUser } from "@/lib/firebase/server";

const AGENTS_STORAGE_KEY = "roami_agents";

/**
 * Get all agents for the current user
 * For now, using localStorage via client-side actions
 * TODO: Migrate to Firestore for server-side storage
 */
export async function getAgents(): Promise<Agent[]> {
  // This will be called from client components
  // For now, return empty array - actual implementation will be client-side
  // until we migrate to Firestore
  return [];
}

/**
 * Get a single agent by ID
 */
export async function getAgent(id: string): Promise<Agent | null> {
  // This will be called from client components
  // For now, return null - actual implementation will be client-side
  return null;
}

/**
 * Create a new agent
 */
export async function createAgent(input: CreateAgentInput): Promise<Agent> {
  // This will be called from client components
  // For now, throw error - actual implementation will be client-side
  throw new Error("Not implemented - use client-side agent management");
}

/**
 * Update an existing agent
 */
export async function updateAgent(
  id: string,
  input: UpdateAgentInput
): Promise<Agent> {
  // This will be called from client components
  // For now, throw error - actual implementation will be client-side
  throw new Error("Not implemented - use client-side agent management");
}

/**
 * Delete an agent
 */
export async function deleteAgent(id: string): Promise<void> {
  // This will be called from client components
  // For now, throw error - actual implementation will be client-side
  throw new Error("Not implemented - use client-side agent management");
}

