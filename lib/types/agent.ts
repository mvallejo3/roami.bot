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

/**
 * API Agent type - matches the structure returned from the DigitalOcean GenAI API
 */
export interface ApiAgent {
  chatbot_identifiers: Array<{
    agent_chatbot_identifier: string;
  }>;
  created_at: string; // ISO8601 date string
  deployment: {
    created_at: string; // ISO8601 date string
    status: string;
    updated_at: string; // ISO8601 date string
    url: string;
    uuid: string;
    visibility: string;
  };
  description?: string;
  instruction: string;
  k: number;
  max_tokens: number;
  model: {
    agreement: {
      description: string;
      name: string;
      url: string;
      uuid: string;
    };
    created_at: string; // ISO8601 date string
    inference_name: string;
    inference_version: string;
    is_foundational: boolean;
    metadata: {
      agreements: {
        list: Array<{
          title: string;
          url: string;
        }>;
        title: string;
      };
      description: string;
      max_tokens: {
        default: number;
        max: number;
        min: number;
      };
      temperature: {
        default: number;
        max: number;
        min: number;
      };
      top_p: {
        default: number;
        max: number;
        min: number;
      };
    };
    name: string;
    parent_uuid: string;
    updated_at: string; // ISO8601 date string
    upload_complete: boolean;
    usecases: string[];
    uuid: string;
    version: {
      major: number;
    };
  };
  name: string;
  project_id: string;
  region: string;
  retrieval_method: string;
  route_created_at: string; // ISO8601 date string
  route_uuid: string;
  tags?: string[];
  temperature: number;
  top_p: number;
  updated_at: string; // ISO8601 date string
  user_id: string;
  uuid: string;
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

