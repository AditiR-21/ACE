// Lovable AI Gateway — server-only helper.
// Model in use across ACE agents: google/gemini-3.6-flash (via Lovable AI Gateway).
export const ACE_MODEL = "google/gemini-3.6-flash";
export const ACE_MODEL_LABEL = "Lovable AI Gateway · google/gemini-3.6-flash";

type Msg = { role: "system" | "user"; content: string };

export async function chatJSON<T>(messages: Msg[], maxTokens = 4000): Promise<T> {
  const key = process.env.LOVABLE_API_KEY;
  if (!key) throw new Error("Missing LOVABLE_API_KEY");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": key,
    },
    body: JSON.stringify({
      model: ACE_MODEL,
      messages,
      response_format: { type: "json_object" },
      max_completion_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    if (res.status === 429) throw new Error("AI rate limit reached — try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted — add credits to continue.");
    throw new Error(`AI request failed [${res.status}]: ${body.slice(0, 400)}`);
  }

  const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const text = data.choices?.[0]?.message?.content ?? "";
  const cleaned = text.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const match = cleaned.match(/[[{][\s\S]*[\]}]/);
    if (match) return JSON.parse(match[0]) as T;
    throw new Error("AI returned an unparseable response.");
  }
}
