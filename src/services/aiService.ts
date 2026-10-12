import { Quest, QuestGenerationParams, QuestSchema } from "@/types/quest";

const OLLAMA_HOST = process.env.OLLAMA_HOST || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "gemma2:2b";
const SUPPORTED_MODELS = ["gemma2:2b", "llama3.2:1b", "deepseek-r1:1.5b", "llama3:latest", "qwen2.5:3b"];

export async function checkOllamaHealth(): Promise<{ available: boolean; model: string; error?: string }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${OLLAMA_HOST}/api/tags`, {
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { available: false, model: OLLAMA_MODEL, error: `HTTP ${res.status}` };
    }

    const data = await res.json();
    const installedNames: string[] = (data.models || []).map((m: { name: string }) => m.name);

    // Choose the best active model among supported
    let selectedModel = OLLAMA_MODEL;
    const found = SUPPORTED_MODELS.find(m => installedNames.some(inst => inst.includes(m)));
    if (found) {
      selectedModel = found;
    }
    const hasModel = installedNames.some(m => m.includes(selectedModel));

    return {
      available: hasModel,
      model: selectedModel,
      error: hasModel ? undefined : `None of the models [${SUPPORTED_MODELS.join(", ")}] found in Ollama.`
    };
  } catch (err: unknown) {
    return {
      available: false,
      model: OLLAMA_MODEL,
      error: err instanceof Error ? err.message : "Connection failed"
    };
  }
}

export async function generateQuestWithAI(params: QuestGenerationParams): Promise<{ quest: Quest; source: string }> {
  const health = await checkOllamaHealth();
  if (!health.available) {
    throw new Error(
      `Local AI model '${health.model}' is not available. Please ensure Ollama is running at ${OLLAMA_HOST}.`
    );
  }

  // Streamlined prompt: minimal tokens to generate, ensuring generation finishes in < 25s
  const prompt = `Write a ${params.duration}-minute outdoor walk in plain English. Return ONLY valid JSON:
{
  "title": "Short title",
  "description": "One sentence.",
  "estimatedRadius": "Around 300 meters",
  "difficulty": "Gentle",
  "completionCriterion": "Come back home and write down one thing you saw.",
  "steps": [
    {"id": 1, "title": "Check Tree Leaves", "instruction": "Find 2 different types of leaves on your street.", "sensoryFocus": "Visual", "phase": "First block"},
    {"id": 2, "title": "Listen to the Breeze", "instruction": "Stop for 30 seconds and listen for birds or wind.", "sensoryFocus": "Acoustic", "phase": "Midpoint"},
    {"id": 3, "title": "Spot Sidewalk Plants", "instruction": "Find small green weeds or moss growing in pavement cracks.", "sensoryFocus": "Visual", "phase": "Walking back"}
  ]
}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 120000); // 120s timeout

    const res = await fetch(`${OLLAMA_HOST}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: health.model,
        prompt: prompt,
        stream: false,
        format: "json",
        options: {
          temperature: 0.1,
          num_predict: 260, // Concisely generates all 3 steps (~130 tokens) without running on
          num_ctx: 512,     // Small context window makes CPU/GPU inference 3x faster
          top_p: 0.9,
        }
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Ollama generation failed: HTTP ${res.status}`);
    }

    const payload = await res.json();
    let text = payload.response?.trim() || "";

    // Clean potential markdown quotes
    if (text.startsWith("```json")) text = text.replace(/^```json/, "").replace(/```$/, "").trim();
    else if (text.startsWith("```")) text = text.replace(/^```/, "").replace(/```$/, "").trim();

    // Robust JSON extraction and recovery
    let parsedJson: any = null;
    try {
      parsedJson = JSON.parse(text);
    } catch {
      // Attempt to extract the outermost JSON object and fix missing trailing closing delimiters if cut off
      const firstBrace = text.indexOf("{");
      if (firstBrace !== -1) {
        let snippet = text.slice(firstBrace).trim();
        // Remove trailing commas before closing braces/brackets
        snippet = snippet.replace(/,\s*([\]}])/g, "$1");
        
        // Count open/close braces and brackets to balance in case of minor truncation
        const openBraces = (snippet.match(/{/g) || []).length;
        const closeBraces = (snippet.match(/}/g) || []).length;
        const openBrackets = (snippet.match(/\[/g) || []).length;
        const closeBrackets = (snippet.match(/\]/g) || []).length;

        // If string was truncated mid-quote, close the quote
        const quoteCount = (snippet.match(/"/g) || []).length;
        if (quoteCount % 2 !== 0) {
          snippet += '"';
        }

        // Close unclosed arrays/objects
        for (let i = 0; i < (openBrackets - closeBrackets); i++) snippet += "]";
        for (let i = 0; i < (openBraces - closeBraces); i++) snippet += "}";

        try {
          parsedJson = JSON.parse(snippet);
        } catch (innerErr) {
          console.warn("[TouchGrass AI] Second pass JSON recovery failed:", innerErr);
          throw new Error("Local model generated malformed JSON: " + (innerErr instanceof Error ? innerErr.message : "Parse error"));
        }
      } else {
        throw new Error("No JSON object found in local model output.");
      }
    }

    const randomNum = Math.floor(100 + Math.random() * 900);

    // Ensure steps are properly formatted and non-empty
    let steps = Array.isArray(parsedJson?.steps) ? parsedJson.steps : [];
    if (steps.length === 0) {
      steps = [
        {
          id: 1,
          title: "Mindful Steps",
          instruction: "Walk comfortably and notice 3 natural sights around you.",
          sensoryFocus: "Visual",
          phase: "Outdoor"
        }
      ];
    } else {
      steps = steps.map((s: any, idx: number) => ({
        id: typeof s.id === "number" ? s.id : idx + 1,
        title: s.title || `Step ${idx + 1}`,
        instruction: s.instruction || "Observe your surroundings closely.",
        sensoryFocus: s.sensoryFocus || "Visual",
        phase: s.phase || "Outdoor",
      }));
    }

    const fullQuestCandidate = {
      id: `quest-${Date.now()}-${randomNum}`,
      protocolCode: `EXP-${randomNum}-${params.mood.substring(0, 3).toUpperCase()}`,
      title: parsedJson.title || "The Neighborhood Walk",
      description: parsedJson.description || "A pleasant walk outside.",
      durationMinutes: params.duration,
      estimatedRadius: parsedJson.estimatedRadius || "Around 400 meters",
      mood: params.mood || "Curious",
      activity: params.activity || "Nature",
      environment: params.environment || "Neighborhood",
      difficulty: parsedJson.difficulty || "Gentle",
      completionCriterion: parsedJson.completionCriterion || "Come back home and write down one thing you saw.",
      steps: steps,
      createdAt: new Date().toISOString(),
      source: health.model,
    };

    // Validate with Zod
    const validatedQuest = QuestSchema.parse(fullQuestCandidate);
    return { quest: validatedQuest, source: health.model };
  } catch (err) {
    console.error("[TouchGrass AI] Ollama inference error:", err);
    throw new Error(
      err instanceof Error ? err.message : "Failed to generate quest with local AI model."
    );
  }
}

