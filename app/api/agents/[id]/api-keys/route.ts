import { NextRequest, NextResponse } from "next/server";
import { createApiKey } from "@/app/actions/agents";
import type { CreateApiKeyInput } from "@/lib/types/agent";

/**
 * POST /api/agents/[id]/api-keys - Create an API key for an agent
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const result = await createApiKey(params.id, body as CreateApiKeyInput);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating API key:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to create API key",
      },
      { status: 500 }
    );
  }
}

