import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Model } from "@/lib/types/model";

export interface ModelsListResponse {
  models: Model[];
  count?: number;
}

export const modelApi = createApi({
  reducerPath: "modelApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "", // Use relative URLs to call Next.js API routes (same-origin, no CORS)
  }),
  tagTypes: ["Model"],
  endpoints: (builder) => ({
    // List all models
    listModels: builder.query<ModelsListResponse, void>({
      query: () => ({
        url: "/api/models",
        method: "GET",
      }),
      providesTags: ["Model"],
    }),
  }),
});

export const {
  useListModelsQuery,
} = modelApi;

