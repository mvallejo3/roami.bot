import { NextRequest, NextResponse } from "next/server";
import { attachKnowledgeBase } from "@/app/actions/agents";

/**
 * POST /api/agents/[id]/attach-knowledgebase - Attach a knowledge base to an agent
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { knowledge_base_uuid } = body;

    if (!knowledge_base_uuid || typeof knowledge_base_uuid !== "string") {
      return NextResponse.json(
        {
          error: "knowledge_base_uuid is required and must be a string",
        },
        { status: 400 }
      );
    }

    const result = await attachKnowledgeBase(params.id, {
      knowledge_base_uuid,
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error attaching knowledge base:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to attach knowledge base",
      },
      { status: 500 }
    );
  }
}

