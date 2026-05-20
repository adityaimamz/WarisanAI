export const geminiRequest = async (
  prompt: string,
  config?: { temperature?: number; maxOutputTokens?: number },
): Promise<Response> => {
  const apiKey = process.env.VERTEX_API_KEY || process.env.API_KEY;
  if (!apiKey) throw new Error("No AI API key configured");

  const model = process.env.VERTEX_MODEL || "gemini-2.5-flash";
  const endpoint =
    process.env.VERTEX_AI_GENERATE_URL ||
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  return fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: config?.temperature ?? 0.25,
        maxOutputTokens: config?.maxOutputTokens ?? 1500,
        responseMimeType: "application/json",
      },
    }),
  });
};
