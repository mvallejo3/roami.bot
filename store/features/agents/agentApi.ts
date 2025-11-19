import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Agent, CreateAgentInput, UpdateAgentInput } from "@/lib/types/agent";

export interface AgentsListResponse {
  agents: Agent[];
  count: number;
}

export interface AgentResponse {
  agent: Agent;
}

export interface UpdateKnowledgeBaseInput {
  knowledgeBaseUuid: string;
}

export const agentApi = createApi({
  reducerPath: "agentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "", // Use relative URLs to call Next.js API routes (same-origin, no CORS)
  }),
  tagTypes: ["Agent"],
  endpoints: (builder) => ({
    // List all agents
    listAgents: builder.query<AgentsListResponse, void>({
      query: () => ({
        url: "/api/agents",
        method: "GET",
      }),
      providesTags: ["Agent"],
    }),

    // Get a single agent by ID
    getAgent: builder.query<AgentResponse, string>({
      query: (id) => ({
        url: `/api/agents/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Agent", id }],
    }),

    // Create a new agent
    createAgent: builder.mutation<AgentResponse, CreateAgentInput>({
      query: (body) => ({
        url: "/api/agents",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Agent"],
    }),

    // Update an existing agent
    updateAgent: builder.mutation<
      AgentResponse,
      { id: string; input: UpdateAgentInput }
    >({
      query: ({ id, input }) => ({
        url: `/api/agents/${id}`,
        method: "PATCH",
        body: input,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Agent", id },
        "Agent",
      ],
    }),

    // Update knowledgebase for an agent
    updateKnowledgeBase: builder.mutation<
      AgentResponse,
      { id: string; input: UpdateKnowledgeBaseInput }
    >({
      query: ({ id, input }) => ({
        url: `/api/agents/${id}/knowledgebase`,
        method: "PATCH",
        body: input,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Agent", id },
        "Agent",
      ],
    }),

    // Delete an agent
    deleteAgent: builder.mutation<{message: string, agentId: string}, string>({
      query: (id) => ({
        url: `/api/agents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Agent"],
    }),
  }),
});

export const {
  useListAgentsQuery,
  useGetAgentQuery,
  useCreateAgentMutation,
  useUpdateAgentMutation,
  useUpdateKnowledgeBaseMutation,
  useDeleteAgentMutation,
} = agentApi;

