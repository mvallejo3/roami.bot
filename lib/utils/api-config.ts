/**
 * API configuration for BotPilot endpoints
 */
export const API_BASE_URL =
  process.env.AGENT_API_BASE_URL || "http://127.0.0.1:5050";

export const API_TOKEN =
  process.env.API_BEARER_TOKEN || "";

export const NO_API_KEY_REQUIRED_MODELS = 
  process.env.NO_API_KEY_REQUIRED_MODEL_UUIDS?.split(',') || [];
