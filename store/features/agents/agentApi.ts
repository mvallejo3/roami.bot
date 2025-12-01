import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  CreateAgentInput,
  UpdateAgentInput,
} from "@/lib/types/agent";
import type {
  AgentsListResponse,
  AgentResponse,
} from "@/app/actions/agents";

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

    // Delete an agent
    deleteAgent: builder.mutation<AgentResponse, string>({
      query: (id) => ({
        url: `/api/agents/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Agent"],
    }),

    // Attach a knowledge base to an agent
    attachKnowledgeBase: builder.mutation<
      AgentResponse,
      { agentId: string; knowledge_base_uuid: string }
    >({
      query: ({ agentId, knowledge_base_uuid }) => ({
        url: `/api/agents/${agentId}/attach-knowledgebase`,
        method: "POST",
        body: { knowledge_base_uuid },
      }),
      invalidatesTags: (result, error, { agentId }) => [
        { type: "Agent", id: agentId },
        "Agent",
      ],
    }),
  }),
});

export const {
  useListAgentsQuery,
  useGetAgentQuery,
  useCreateAgentMutation,
  useUpdateAgentMutation,
  useDeleteAgentMutation,
  useAttachKnowledgeBaseMutation,
} = agentApi;

