import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { API_BASE_URL } from "@/lib/utils/api-config";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatResponse {
  answer: string;
}

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
  }),
  tagTypes: ["Chat"],
  endpoints: (builder) => ({
    sendMessage: builder.mutation<ChatResponse, { prompt: string }>({
      query: (body) => ({
        url: "/api/prompt",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSendMessageMutation } = chatApi;

