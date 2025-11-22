/**
 * Chat service using OpenAI SDK with streaming support
 * Supports DigitalOcean Gradient AI Platform and OpenAI-compatible APIs
 */

import OpenAI from "openai";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface ChatStreamOptions {
  messages: ChatMessage[];
  onChunk: (chunk: string) => void;
  onComplete?: (fullContent: string) => void;
  onError?: (error: Error) => void;
}

export interface ChatServiceConfig {
  apiUrl: string;
  apiKey: string;
  model: string;
}

export class ChatService {
  private client: OpenAI | null = null;
  private abortController: AbortController | null = null;
  private config: ChatServiceConfig | null = null;

  constructor(config?: ChatServiceConfig) {
    if (config) {
      this.config = config;
      this.initializeClient(config);
    } else {
      this.initializeClient();
    }
  }

  private initializeClient(config?: ChatServiceConfig) {
    const apiUrl = config?.apiUrl || process.env.NEXT_PUBLIC_OPENAI_API_URL;
    const apiKey = config?.apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY;

    if (!apiUrl || !apiKey) {
      console.warn(
        "OpenAI API URL or API Key not configured. Please set NEXT_PUBLIC_OPENAI_API_URL and NEXT_PUBLIC_OPENAI_API_KEY environment variables or provide config."
      );
      return;
    }

    this.client = new OpenAI({
      apiKey: apiKey,
      baseURL: apiUrl,
      dangerouslyAllowBrowser: true, // Required for client-side usage
    });
  }

  /**
   * Update the service configuration
   */
  updateConfig(config: ChatServiceConfig) {
    this.config = config;
    this.initializeClient(config);
  }

  /**
   * Start a chat stream
   */
  async startStream(options: ChatStreamOptions): Promise<void> {
    if (!this.client) {
      const error = new Error(
        "Chat client not initialized. Please check your environment variables."
      );
      options.onError?.(error);
      throw error;
    }

    // Cancel any existing stream
    this.closeStream();

    // Create new abort controller for this stream
    this.abortController = new AbortController();

    try {
      const model = this.config?.model || process.env.NEXT_PUBLIC_OPENAI_MODEL || "gpt-4";
      const stream = await this.client.chat.completions.create(
        {
          model: model,
          messages: options.messages,
          stream: true,
        },
        {
          signal: this.abortController.signal,
        }
      );

      let fullContent = "";

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || "";
        if (content) {
          fullContent += content;
          options.onChunk(content);
        }
      }

      options.onComplete?.(fullContent);
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // Stream was cancelled, don't call onError
        return;
      }
      options.onError?.(error as Error);
      throw error;
    } finally {
      this.abortController = null;
    }
  }

  /**
   * Close the current chat stream
   */
  closeStream(): void {
    if (this.abortController) {
      this.abortController.abort();
      this.abortController = null;
    }
  }

  /**
   * Check if the chat service is initialized
   */
  isInitialized(): boolean {
    return this.client !== null;
  }
}

// Export a singleton instance
export const chatService = new ChatService();

