// app/api/ai/route.ts
// Single route for all AI text features — uses fal.ai Llama 3.1 (free & fast)
// Replaces all Anthropic API calls — only FAL_KEY needed
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 30;

function safeParseJSON(text: string): any {
  try {
    let clean = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
    const obj = clean.match(/\{[\s\S]*\}/)?.[0] || clean;
    return JSON.parse(obj);
  } catch { return null; }
}

export async function POST(req: NextRequest) {
  try {
    const { messages, system, max_tokens = 1000 } = await req.json();

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) return NextResponse.json({ error: "FAL_KEY not set" }, { status: 500 });

    // Build prompt — fal.ai Llama uses a single prompt string
    const systemText = system || "You are a helpful AI fashion assistant for Azzro, an Indian fashion store.";
    const userMsg    = messages?.[messages.length - 1]?.content || "";

    // Build conversation history for multi-turn
    const history = (messages || []).slice(0, -1)
      .map((m: any) => `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`)
      .join("\n");

    const fullPrompt = `${systemText}\n\n${history ? history + "\n" : ""}User: ${userMsg}\nAssistant:`;

    // Use fal-ai/llama — fast, free with fal.ai key
    const res = await fetch("https://fal.run/fal-ai/llama/v3-8b-instruct", {
      method:  "POST",
      headers: { "Authorization": `Key ${FAL_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt:     fullPrompt,
        max_tokens: max_tokens,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      // Fallback to fal-ai/any-llm if specific model fails
      const res2 = await fetch("https://fal.run/fal-ai/any-llm", {
        method:  "POST",
        headers: { "Authorization": `Key ${FAL_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model:  "meta-llama/llama-3.1-8b-instruct",
          prompt: fullPrompt,
          max_tokens,
        }),
      });
      if (!res2.ok) throw new Error(`fal.ai LLM failed: ${err}`);
      const d2   = await res2.json();
      const text = d2.output || d2.text || d2.response || "";
      return NextResponse.json({ text, parsed: safeParseJSON(text) });
    }

    const data = await res.json();
    const text = data.output || data.text || data.response || data.generated_text || "";
    return NextResponse.json({ text, parsed: safeParseJSON(text) });

  } catch (err: any) {
    console.error("[/api/ai]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
