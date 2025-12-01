import { NextRequest, NextResponse } from "next/server";
import { listKnowledgeBases, createKnowledgeBase } from "@/app/actions/knowledgebase";
import type { CreateKnowledgeBaseInput } from "@/lib/types/knowledgebase";

/**
 * GET /api/knowledgebase - List all knowledge bases
 */
export async function GET() {
  try {
    const result = await listKnowledgeBases();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error listing knowledge bases:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to list knowledge bases",
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/knowledgebase - Create a new knowledge base
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createKnowledgeBase(body as CreateKnowledgeBaseInput);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating knowledge base:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create knowledge base",
      },
      { status: 500 }
    );
  }
}

