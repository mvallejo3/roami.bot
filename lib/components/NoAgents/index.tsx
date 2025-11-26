"use client";

interface NoAgentsProps {
  onCreateClick: () => void;
}

export default function NoAgents({ onCreateClick }: NoAgentsProps) {
  return (
    <div className="flex items-center justify-center h-64">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2 text-accent-primary">
          No agents yet
        </h2>
        <p className="text-foreground-secondary mb-4">
          Create your first AI agent to get started
        </p>
        <button
          onClick={onCreateClick}
          className="bg-accent-primary text-foreground-bright px-6 py-3 rounded-lg hover:opacity-90 transition-opacity font-medium"
        >
          Create Agent
        </button>
      </div>
    </div>
  );
}

