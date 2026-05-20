import { RelationshipResult } from "./types.js";
import { geminiRequest } from "../ai/aiClient.js";

type GenerateContentResponse = {
  candidates?: Array<{
    content?: {
      parts?: Array<{ text?: string }>;
    };
  }>;
};

const aiLog = (
  event: string,
  data: Record<string, unknown>,
  level: "info" | "warn" = "info",
) => {
  console[level](`[ai] ${event}`, data);
};

const parseAiJson = (text: string) => {
  const match = /\{[\s\S]*\}/.exec(text);
  if (!match) return null;
  try {
    return JSON.parse(match[0]) as Partial<RelationshipResult>;
  } catch {
    return null;
  }
};

const isGenericRelationshipAnswer = (relationshipLabel: string, explanation: string) => {
  const label = relationshipLabel.trim().toLowerCase();
  const body = explanation.trim().toLowerCase();
  return (
    label === "related family member" ||
    body.includes("connected as related family member") ||
    body.includes("connected as a related family member")
  );
};

export const maybeAiRelationship = async (fallback: RelationshipResult, fromName: string, toName: string) => {
  const apiKey = process.env.VERTEX_API_KEY || process.env.API_KEY;
  if (process.env.AI_EXTERNAL_ENABLED !== "1" || !apiKey) {
    aiLog(process.env.AI_EXTERNAL_ENABLED === "1" ? "relationship_fallback_no_api_key" : "relationship_fallback_external_disabled", {
      feature: "relationship",
      pathLength: fallback.path.length,
      confidence: fallback.confidence,
    }, "warn");
    return fallback;
  }

  const model = process.env.VERTEX_MODEL || "gemini-2.5-flash";
  const prompt = [
    "You explain family relationships for a private family archive.",
    "Use only the supplied deterministic relationship result.",
    "Explain why the relationship exists using the supplied path. Do not invent people, dates, or family data.",
    "Keep a specific deterministic relationshipLabel when one is supplied; do not replace mother-in-law, daughter-in-law, cousin, grandparent, or similar labels with 'related family member'.",
    "If the deterministic path is parent -> child -> spouse, state the exact in-law relationship in the first sentence.",
    "Keep the privacy cue: This explanation only uses data inside this FamilySpace.",
    "Return compact JSON with keys: relationshipLabel, explanation, confidence, fallbackNote.",
    `Person A: ${fromName}`,
    `Person B: ${toName}`,
    `Deterministic result: ${JSON.stringify(fallback)}`,
  ].join("\n");

  const startedAt = Date.now();
  aiLog("relationship_llm_request_start", {
    feature: "relationship",
    model,
    endpointMode: process.env.VERTEX_AI_GENERATE_URL ? "custom" : "default",
    pathLength: fallback.path.length,
    confidence: fallback.confidence,
  });

  try {
    const response = await geminiRequest(prompt, { temperature: 0.2, maxOutputTokens: 420 });

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      aiLog("relationship_llm_response_not_ok", {
        feature: "relationship",
        model,
        status: response.status,
        durationMs: Date.now() - startedAt,
        errorLength: errorText.length,
        fallback: true,
      }, "warn");
      return fallback;
    }
    const data = (await response.json()) as GenerateContentResponse;
    const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text).filter(Boolean).join("\n") ?? "";
    const parsed = parseAiJson(text);
    if (!parsed?.explanation || !parsed.relationshipLabel) {
      aiLog("relationship_llm_invalid_json", {
        feature: "relationship",
        model,
        durationMs: Date.now() - startedAt,
        responseTextLength: text.length,
        fallback: true,
      }, "warn");
      return fallback;
    }
    const relationshipLabel = String(parsed.relationshipLabel);
    const explanation = String(parsed.explanation);
    if (
      fallback.relationshipLabel !== "related family member" &&
      isGenericRelationshipAnswer(relationshipLabel, explanation)
    ) {
      aiLog("relationship_llm_generic_specific_fallback", {
        feature: "relationship",
        model,
        durationMs: Date.now() - startedAt,
        fallbackLabel: fallback.relationshipLabel,
        fallback: true,
      }, "warn");
      return fallback;
    }

    aiLog("relationship_llm_success", {
      feature: "relationship",
      model,
      durationMs: Date.now() - startedAt,
      explanationLength: explanation.length,
      source: "ai",
    });
    return {
      ...fallback,
      relationshipLabel,
      explanation,
      confidence: parsed.confidence === "high" || parsed.confidence === "medium" || parsed.confidence === "low"
        ? parsed.confidence
        : fallback.confidence,
      fallbackNote: typeof parsed.fallbackNote === "string" ? parsed.fallbackNote : fallback.fallbackNote,
      source: "ai" as const,
    };
  } catch (error) {
    aiLog("relationship_llm_error", {
      feature: "relationship",
      model,
      durationMs: Date.now() - startedAt,
      errorName: error instanceof Error ? error.name : "UnknownError",
      fallback: true,
    }, "warn");
    return fallback;
  }
};
