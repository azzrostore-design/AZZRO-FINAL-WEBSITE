// app/api/tryon/route.ts
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

/* ─── Upload base64 image to fal.ai storage ─────────────────── */
async function uploadToFal(base64DataUrl: string, falKey: string): Promise<string> {
  const match = base64DataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) throw new Error("Invalid image format – expected data:…;base64,…");

  const mimeType = match[1];
  const b64data  = match[2];

  // Try primary fal.ai storage endpoint
  try {
    const res = await fetch("https://fal.run/fal-ai/storage/upload", {
      method:  "POST",
      headers: { "Authorization": `Key ${falKey}`, "Content-Type": "application/json" },
      body:    JSON.stringify({ image: `data:${mimeType};base64,${b64data}` }),
    });
    if (res.ok) {
      const j = await res.json();
      const url = j.url || j.cdn_url || j.image_url;
      if (url) return url as string;
    }
  } catch { /* fall through to backup */ }

  // Backup: alpha storage endpoint
  const res2 = await fetch("https://rest.alpha.fal.ai/storage/upload/base64", {
    method:  "POST",
    headers: { "Authorization": `Key ${falKey}`, "Content-Type": "application/json" },
    body:    JSON.stringify({ content_type: mimeType, data: b64data }),
  });
  if (!res2.ok) throw new Error(`fal.ai upload failed (${res2.status}): ${await res2.text()}`);
  const j2 = await res2.json();
  return j2.url as string;
}

/* ─── Safe JSON extractor – handles markdown fences + bad chars ─ */
function safeParseJSON(text: string): any {
  // Strip markdown code fences
  let cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  // Remove any leading non-JSON characters (e.g. "- ", "• ", etc.)
  cleaned = cleaned.replace(/^[^{[]+/, "").replace(/[^}\]]+$/, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    return null;
  }
}

/* ─── Run Claude fit analysis on result image ───────────────── */
async function getFitAnalysis(
  resultUrl: string,
  garmentName: string,
  clothType: string
): Promise<{ score: number; tip: string }> {
  const DEFAULT = { score: 85, tip: "Great choice! This garment suits your style perfectly." };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return DEFAULT;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method:  "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key":    apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model:      "claude-sonnet-4-20250514",
        max_tokens: 150,
        system:     "You are a fashion expert. Respond ONLY with valid JSON, no markdown, no extra text. Example: {\"score\":85,\"tip\":\"Looks great!\"}",
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "url", url: resultUrl } },
            { type: "text",  text: `Rate how well "${garmentName}" (${clothType.replace("_"," ")}) fits this person. Return JSON only: {"score": <number 1-100>, "tip": "<one sentence styling tip>"}` },
          ],
        }],
      }),
    });

    if (!res.ok) return DEFAULT;

    const data = await res.json();
    const raw  = data.content?.map((c: any) => c.text || "").join("") || "";
    const parsed = safeParseJSON(raw);

    if (parsed && typeof parsed.score === "number" && typeof parsed.tip === "string") {
      return { score: Math.min(100, Math.max(1, parsed.score)), tip: parsed.tip };
    }
    return DEFAULT;
  } catch {
    return DEFAULT;
  }
}

/* ─── Main POST handler ──────────────────────────────────────── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      human_image,
      cloth_image,
      cloth_type    = "upper_body",
      garment_name  = "Garment",
    } = body;

    if (!human_image || !cloth_image) {
      return NextResponse.json({ error: "human_image and cloth_image are required" }, { status: 400 });
    }

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) {
      return NextResponse.json({ error: "FAL_KEY env variable not configured" }, { status: 500 });
    }

    /* ── 1. Upload both images ── */
    let humanUrl: string;
    let clothUrl: string;
    try {
      [humanUrl, clothUrl] = await Promise.all([
        uploadToFal(human_image, FAL_KEY),
        uploadToFal(cloth_image, FAL_KEY),
      ]);
    } catch (e: any) {
      return NextResponse.json({ error: `Image upload failed: ${e.message}` }, { status: 502 });
    }

    /* ── 2. Submit CatVTON job ── */
    const submitRes = await fetch("https://queue.fal.run/fal-ai/cat-vton", {
      method:  "POST",
      headers: { "Authorization": `Key ${FAL_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        human_image_url: humanUrl,
        cloth_image_url: clothUrl,
        cloth_type,
      }),
    });

    if (!submitRes.ok) {
      const err = await submitRes.text();
      return NextResponse.json({ error: `CatVTON submit failed (${submitRes.status}): ${err}` }, { status: 502 });
    }

    const { request_id } = await submitRes.json();
    if (!request_id) {
      return NextResponse.json({ error: "fal.ai did not return a request_id" }, { status: 502 });
    }

    /* ── 3. Poll for result ── */
    const deadline = Date.now() + 55_000;
    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 3000));

      const pollRes = await fetch(
        `https://queue.fal.run/fal-ai/cat-vton/requests/${request_id}`,
        { headers: { "Authorization": `Key ${FAL_KEY}` } }
      );
      if (!pollRes.ok) continue;

      const poll = await pollRes.json();

      if (poll.status === "COMPLETED") {
        const imageObj =
          poll.output?.image       ??
          poll.output?.images?.[0] ??
          poll.images?.[0]         ??
          poll.image               ??
          null;

        if (!imageObj) {
          return NextResponse.json(
            { error: "Job completed but no image found in response", raw: JSON.stringify(poll).slice(0, 500) },
            { status: 502 }
          );
        }

        // Extract URL from image object
        const resultUrl = typeof imageObj === "string"
          ? imageObj
          : (imageObj.url || imageObj.cdn_url || imageObj.image_url || "");

        if (!resultUrl) {
          return NextResponse.json({ error: "Could not extract image URL from response" }, { status: 502 });
        }

        /* ── 4. Run fit analysis server-side (safe) ── */
        const fit = await getFitAnalysis(resultUrl, garment_name, cloth_type);

        return NextResponse.json({
          success:    true,
          result_url: resultUrl,
          image:      imageObj,
          fit_score:  fit.score,
          fit_tip:    fit.tip,
          request_id,
        });
      }

      if (poll.status === "FAILED") {
        const reason = poll.error || poll.detail || "Unknown fal.ai error";
        return NextResponse.json({ error: `Try-on job failed: ${reason}` }, { status: 502 });
      }
      // IN_QUEUE | IN_PROGRESS → keep polling
    }

    return NextResponse.json({ error: "Try-on timed out (55s). Please try again." }, { status: 504 });

  } catch (err: any) {
    console.error("[/api/tryon]", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
