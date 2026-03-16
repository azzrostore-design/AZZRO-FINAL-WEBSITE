// app/api/generate-image/route.ts
// Used by: AIOutfitMaker (outfit visuals), AISuggestions (outfit cards), ColorAnalysis (palette swatches)
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 45;

export async function POST(req: NextRequest) {
  try {
    const { prompt, width = 768, height = 1024, negative_prompt } = await req.json();

    if (!prompt) return NextResponse.json({ error: "Prompt required" }, { status: 400 });

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) return NextResponse.json({ error: "FAL_KEY not configured" }, { status: 500 });

    // Use fal-ai/flux/schnell for fast generation (good for outfit images)
    // Switch to fal-ai/flux-pro for higher quality if needed
    const submitRes = await fetch("https://queue.fal.run/fal-ai/flux/schnell", {
      method: "POST",
      headers: { "Authorization": `Key ${FAL_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt,
        negative_prompt: negative_prompt || "blurry, low quality, watermark, text, deformed",
        image_size: { width, height },
        num_inference_steps: 4,
        num_images: 1,
      }),
    });

    if (!submitRes.ok) {
      const err = await submitRes.text();
      throw new Error(`fal.ai submit failed: ${err}`);
    }

    const { request_id } = await submitRes.json();
    const deadline = Date.now() + 40_000;

    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 2000));
      const pollRes = await fetch(`https://queue.fal.run/fal-ai/flux/schnell/requests/${request_id}`, {
        headers: { "Authorization": `Key ${FAL_KEY}` },
      });
      if (!pollRes.ok) continue;
      const poll = await pollRes.json();
      if (poll.status === "COMPLETED") {
        const image = poll.output?.images?.[0] || poll.images?.[0];
        if (!image) throw new Error("No output image");
        return NextResponse.json({ image, request_id });
      }
      if (poll.status === "FAILED") throw new Error(poll.error || "Generation failed");
    }

    throw new Error("Image generation timed out");
  } catch (err: any) {
    console.error("[/api/generate-image]", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}