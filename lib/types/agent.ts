/**
 * Agent type definitions
 */

export interface Agent {
  id: string;
  name: string;
  description?: string;
  instructions?: string;
  openaiApiUrl: string;
  openaiApiKey: string;
  openaiModel: string;
  knowledgeBaseUuid?: string;
  createdAt: number;
  updatedAt: number;
}

export interface CreateAgentInput {
  name: string;
  description?: string;
  instructions?: string;
  openaiApiUrl: string;
  openaiApiKey: string;
  openaiModel: string;
  knowledgeBaseUuid?: string;
}

export interface UpdateAgentInput {
  name?: string;
  description?: string;
  instructions?: string;
  openaiApiUrl?: string;
  openaiApiKey?: string;
  openaiModel?: string;
  knowledgeBaseUuid?: string;
}

