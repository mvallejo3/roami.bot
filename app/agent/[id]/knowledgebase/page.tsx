import { redirect } from "next/navigation";
import { getAgent } from "@/app/actions/agents";
import AgentKnowledgeBases from "@/lib/components/AgentKnowledgeBases";
import type { KnowledgeBase } from "@/lib/types/agent";

interface KnowledgebasePageProps {
  params: Promise<{ id: string }>;
}

export default async function KnowledgebasePage({ params }: KnowledgebasePageProps) {
  const { id: agentId } = await params;

  try {
    const agentData = await getAgent(agentId);
    const agent = agentData.agent;

    if (!agent) {
      redirect("/");
    }

    // Check knowledge bases on the server side
    const knowledgeBases: KnowledgeBase[] = agent.knowledge_bases || [];

    return (
      <AgentKnowledgeBases
        agent={agent}
        agentId={agentId}
        knowledgeBases={knowledgeBases}
      />
    );
  } catch (error) {
    // If there's an error fetching the agent, redirect to home
    console.error("Error fetching agent:", error);
    redirect("/");
  }
}

