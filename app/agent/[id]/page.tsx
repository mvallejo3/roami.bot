import { getAgent, getApiKeyFromCookie } from "@/app/actions/agents";
import AgentChat from "@/lib/components/AgentChat";

interface AgentPageProps {
  params: Promise<{ id: string }>;
}

export default async function AgentPage({ params }: AgentPageProps) {
  const { id: agentId } = await params;

  try {
    const agentData = await getAgent(agentId);
    const agent = agentData.agent;

    if (!agent) {
      return <div>Agent not found</div>;
    }

    // Get API key from cookie (may be empty)
    const apiKey = await getApiKeyFromCookie(agent.uuid);

    return <AgentChat agent={agent} apiKey={apiKey} agentId={agentId} />;
  } catch (error) {
    // If there's an error fetching the agent, display an error message
    return <div>Error fetching agent: {error instanceof Error ? error.message : "Unknown error"}</div>;
  }
}

