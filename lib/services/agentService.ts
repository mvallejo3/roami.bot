/**
 * Client-side agent service for managing agents
 * 
 * NOTE: This service has been migrated to use the API via RTK Query.
 * Please use the hooks from @/store/features/agents/agentApi instead:
 * - useListAgentsQuery() for listing agents
 * - useGetAgentQuery(id) for getting a single agent
 * - useCreateAgentMutation() for creating agents
 * - useUpdateAgentMutation() for updating agents
 * - useDeleteAgentMutation() for deleting agents
 */

import type { Agent, CreateAgentInput, UpdateAgentInput } from "@/lib/types/agent";

/**
 * @deprecated Use useListAgentsQuery() from @/store/features/agents/agentApi instead
 */
export function getAgents(): Agent[] {
  throw new Error(
    "getAgents() has been removed. Please use useListAgentsQuery() from @/store/features/agents/agentApi instead."
  );
}

/**
 * @deprecated Use useGetAgentQuery(id) from @/store/features/agents/agentApi instead
 */
export function getAgent(id: string): Agent | null {
  throw new Error(
    "getAgent() has been removed. Please use useGetAgentQuery(id) from @/store/features/agents/agentApi instead."
  );
}

/**
 * @deprecated Use useCreateAgentMutation() from @/store/features/agents/agentApi instead
 */
export function createAgent(input: CreateAgentInput): Agent {
  throw new Error(
    "createAgent() has been removed. Please use useCreateAgentMutation() from @/store/features/agents/agentApi instead."
  );
}

/**
 * @deprecated Use useUpdateAgentMutation() from @/store/features/agents/agentApi instead
 */
export function updateAgent(id: string, input: UpdateAgentInput): Agent {
  throw new Error(
    "updateAgent() has been removed. Please use useUpdateAgentMutation() from @/store/features/agents/agentApi instead."
  );
}

/**
 * @deprecated Use useDeleteAgentMutation() from @/store/features/agents/agentApi instead
 */
export function deleteAgent(id: string): void {
  throw new Error(
    "deleteAgent() has been removed. Please use useDeleteAgentMutation() from @/store/features/agents/agentApi instead."
  );
}

