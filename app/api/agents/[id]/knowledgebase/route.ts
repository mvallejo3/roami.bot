import { NextRequest, NextResponse } from "next/server";
import { updateAgentKnowledgeBase } from "@/app/actions/agents";
import type { UpdateKnowledgeBaseInput } from "@/app/actions/agents";

/**
 * PATCH /api/agents/[id]/knowledgebase - Update agent knowledge base
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const result = await updateAgentKnowledgeBase(
      params.id,
      body as UpdateKnowledgeBaseInput
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error updating agent knowledge base:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update agent knowledge base",
      },
      { status: 500 }
    );
  }
}

