import { NextRequest, NextResponse } from "next/server";
import { createBucket } from "@/app/actions/knowledgebase";
import type { CreateBucketInput } from "@/lib/types/knowledgebase";

/**
 * POST /api/buckets - Create a new bucket
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await createBucket(body as CreateBucketInput);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error creating bucket:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create bucket",
      },
      { status: 500 }
    );
  }
}

