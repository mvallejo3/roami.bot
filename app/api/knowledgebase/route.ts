import { NextResponse } from "next/server";
import { listKnowledgeBases } from "@/app/actions/knowledgebase";

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

