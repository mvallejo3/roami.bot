import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { KnowledgeBasesListResponse } from "@/lib/types/knowledgebase";

export const knowledgebaseApi = createApi({
  reducerPath: "knowledgebaseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "", // Use relative URLs to call Next.js API routes (same-origin, no CORS)
  }),
  tagTypes: ["KnowledgeBase"],
  endpoints: (builder) => ({
    // List all knowledge bases
    listKnowledgeBases: builder.query<KnowledgeBasesListResponse, void>({
      query: () => ({
        url: "/api/knowledgebase",
        method: "GET",
      }),
      providesTags: ["KnowledgeBase"],
    }),
  }),
});

export const { useListKnowledgeBasesQuery } = knowledgebaseApi;

