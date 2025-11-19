import { NextRequest, NextResponse } from "next/server";
import { listAgents, createAgent } from "@/app/actions/agents";
import type { CreateAgentInput } from "@/lib/types/agent";

/**
 * GET /api/agents - List all agents
 */
export async function GET() {
  try {
    const result = await listAgents();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error listing agents:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to list agents",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/agents - Create a new agent
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createAgent(body as CreateAgentInput);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create agent",
      },
      { status: 500 }
    );
  }
}

