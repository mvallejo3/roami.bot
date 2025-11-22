/**
 * Agent type definitions
 */

export interface Agent {
  _id: string;
  _type: "__agent__";
  name: string;
  description?: string;
  instructions?: string;
  openaiApiUrl: string;
  openaiApiKey: string;
  openaiModel: string;
  knowledgeBaseUuid?: string;
  created_at: number;
  updated_at: number;
}

export interface CreateAgentInput {
  name: string;
  agentType: "default" | "custom";
  description?: string;
  instructions?: string;
  openaiApiUrl?: string;
  openaiApiKey?: string;
  openaiModel?: string;
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

