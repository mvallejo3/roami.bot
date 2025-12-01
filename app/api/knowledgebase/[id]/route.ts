import { NextRequest, NextResponse } from "next/server";
import { getKnowledgeBaseDetails } from "@/app/actions/knowledgebase";

interface RouteParams {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/knowledgebase/[id] - Get knowledge base details by ID
 */
export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params;
    const result = await getKnowledgeBaseDetails(id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching knowledge base details:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch knowledge base details",
      },
      { status: 500 }
    );
  }
}

