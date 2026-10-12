import { NextResponse } from "next/server";
import { checkOllamaHealth, generateQuestWithAI } from "@/services/aiService";
import { QuestGenerationParams } from "@/types/quest";

export const maxDuration = 120; // Allow up to 2 minutes for local CPU/GPU AI inference

export async function GET() {
  const health = await checkOllamaHealth();
  return NextResponse.json(health);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as QuestGenerationParams;

    if (!body.duration || !body.mood || !body.activity || !body.environment) {
      return NextResponse.json(
        { error: "Missing required quest parameters." },
        { status: 400 }
      );
    }

    const result = await generateQuestWithAI(body);
    return NextResponse.json(result);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
