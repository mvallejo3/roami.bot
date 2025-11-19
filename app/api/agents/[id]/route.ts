import { NextRequest, NextResponse } from "next/server";
import { getAgent, updateAgent, deleteAgent } from "@/app/actions/agents";
import type { UpdateAgentInput } from "@/lib/types/agent";

/**
 * GET /api/agents/[id] - Get a single agent
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const result = await getAgent(params.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching agent:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch agent",
      },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/agents/[id] - Update an agent
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const result = await updateAgent(params.id, body as UpdateAgentInput);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating agent:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to update agent",
      },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/agents/[id] - Delete an agent
 */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteAgent(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting agent:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete agent",
      },
      { status: 500 }
    );
  }
}

