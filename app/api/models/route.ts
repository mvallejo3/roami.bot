import { NextResponse } from "next/server";
import { listModels } from "@/app/actions/models";

/**
 * Force dynamic rendering since this route uses cookies for authentication
 */
export const dynamic = "force-dynamic";

/**
 * GET /api/models - List all public models
 */
export async function GET() {
  try {
    const result = await listModels();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error listing models:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to list models",
      },
      { status: 500 }
    );
  }
}

