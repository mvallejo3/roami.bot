"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import type { Message } from "@/lib/services/chatService";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { useStandalone } from "@/lib/hooks/useStandalone";
import { ChatService } from "@/lib/services/chatService";
import { useGetAgentQuery } from "@/store/features/agents/agentApi";
import PageHeader from "@/lib/components/PageHeader";

export default function AgentChatPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.id as string;
  const { data: agentData, isLoading: isLoadingAgent, error } = useGetAgentQuery(agentId);
  const agent = agentData?.agent || null;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [chatService, setChatService] = useState<ChatService | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isStandalone = useStandalone();

  useEffect(() => {
    if (error) {
      router.push("/");
    }
  }, [error, router]);

  useEffect(() => {
    if (agent) {
      const service = new ChatService({
        apiUrl: agent.openaiApiUrl,
        apiKey: agent.openaiApiKey,
        model: agent.openaiModel,
      });
      setChatService(service);

      // Add system instructions if provided
      if (agent.instructions) {
        setMessages([
          {
            id: "system",
            role: "assistant",
            content: agent.instructions,
            timestamp: Date.now(),
          },
        ]);
      }
    }

    return () => {
      if (chatService) {
        chatService.closeStream();
      }
    };
  }, [agent]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cleanup: close stream when component unmounts
  useEffect(() => {
    return () => {
      if (chatService) {
        chatService.closeStream();
      }
    };
  }, [chatService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !chatService) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const userInput = input.trim();
    setInput("");
    setIsLoading(true);

    // Create assistant message placeholder for streaming
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, assistantMessage]);

    try {
      // Convert messages to chat format (excluding the empty assistant message we just added)
      // Filter out system messages and empty assistant messages
      const chatMessages = [
        ...(agent?.instructions
          ? [
              {
                role: "system" as const,
                content: agent.instructions,
              },
            ]
          : []),
        ...messages
          .filter((msg) => msg.id !== "system" && msg.id !== assistantMessageId && msg.content.trim())
          .map((msg) => ({
            role: msg.role as "user" | "assistant" | "system",
            content: msg.content,
          })),
        {
          role: "user" as const,
          content: userInput,
        },
      ];

      await chatService.startStream({
        messages: chatMessages,
        onChunk: (chunk: string) => {
          // Update the assistant message with the new chunk
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: msg.content + chunk }
                : msg
            )
          );
          // Hide loading indicator once we start receiving chunks
          setIsLoading(false);
          // Scroll to bottom as content streams in
          scrollToBottom();
        },
        onComplete: (fullContent: string) => {
          // Ensure the final message has the complete content
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId
                ? { ...msg, content: fullContent }
                : msg
            )
          );
          setIsLoading(false);
        },
        onError: (error: Error) => {
          console.error("Error sending message:", error);
          const errorMessage: Message = {
            id: assistantMessageId,
            role: "assistant",
            content:
              error.message ||
              "Sorry, I encountered an error. Please try again.",
            timestamp: Date.now(),
          };
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMessageId ? errorMessage : msg
            )
          );
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) =>
        prev.map((msg) => (msg.id === assistantMessageId ? errorMessage : msg))
      );
      setIsLoading(false);
    }
  };

  if (isLoadingAgent) {
    return (
      <div
        className="flex flex-col h-screen bg-background text-foreground items-center justify-center"
        style={{ paddingTop: isStandalone ? "36px" : "0" }}
      >
        <div className="flex space-x-2 justify-center mb-4">
          <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce"></div>
          <div
            className="w-2 h-2 bg-accent-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-accent-primary rounded-full animate-bounce"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>
        <p className="text-foreground-secondary">Loading agent...</p>
      </div>
    );
  }

  if (!agent) {
    return null;
  }

  return (
    <div
      className="flex flex-col h-screen bg-background text-foreground"
      style={{ paddingTop: isStandalone ? "36px" : "0" }}
    >
      {/* Header */}
      <PageHeader
        title={agent.name}
        description={agent.description || undefined}
        backHref="/"
        backAriaLabel="Back to Dashboard"
        rightAction={
          <Link
            href={`/agent/${agentId}/knowledgebase`}
            className="bg-accent-primary text-foreground-bright p-2 rounded-lg hover:opacity-90 transition-opacity"
            aria-label="Go to Knowledgebase"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </Link>
        }
      />

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 pb-20">
        {messages.filter((msg) => msg.id !== "system").length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2 text-accent-primary">
                {`Hi, I'm ${agent.name}`}
              </h2>
              <p className="text-foreground-secondary">
                What can I help you with?
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages
              .filter((msg) => msg.id !== "system")
              .map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[95%] sm:max-w-[90%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-accent-primary text-foreground-bright"
                        : "bg-background-secondary text-foreground border border-divider"
                    }`}
                  >
                    {message.role === "user" ? (
                      <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                        {message.content}
                      </p>
                    ) : (
                      <div className="text-sm sm:text-base">
                        <MarkdownRenderer content={message.content} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-background-secondary border border-divider rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-accent-primary rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-accent-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-accent-primary rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="border-t border-divider px-4 py-4 sm:px-6 fixed bottom-0 w-full z-50 bg-background">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  const form = e.currentTarget.closest("form");
                  if (form) {
                    form.requestSubmit();
                  }
                }
              }}
              placeholder="Type your message... (Shift+Enter for new line)"
              className="flex-1 bg-background-secondary border border-divider rounded-lg px-4 py-2 sm:py-3 text-foreground placeholder-foreground-secondary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent text-sm sm:text-base disabled:text-foreground-disabled resize-none min-h-[44px] max-h-[200px] overflow-y-auto"
              disabled={isLoading || !chatService}
              rows={1}
            />
            <button
              type="submit"
              disabled={isLoading || !chatService}
              className="bg-accent-primary text-foreground-bright px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:text-foreground-disabled transition-colors text-sm sm:text-base self-end"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

