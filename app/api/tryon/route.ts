// app/api/tryon/route.ts
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

/* ── Step 1: upload a base64 image to fal.ai storage, get back a CDN url ── */
async function uploadToFal(base64DataUrl: string, falKey: string): Promise<string> {
  const match = base64DataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) throw new Error("Invalid image – expected data:…;base64,… format");

  const mimeType = match[1];   // e.g. "image/jpeg"
  const b64data  = match[2];   // raw base64 string

  // fal.ai storage upload endpoint (correct v1 endpoint)
  const res = await fetch("https://fal.run/fal-ai/storage/upload", {
    method:  "POST",
    headers: {
      "Authorization": `Key ${falKey}`,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify({
      image: `data:${mimeType};base64,${b64data}`,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    // Fallback: try the alpha storage endpoint
    const res2 = await fetch("https://rest.alpha.fal.ai/storage/upload/base64", {
      method:  "POST",
      headers: {
        "Authorization": `Key ${falKey}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({ content_type: mimeType, data: b64data }),
    });
    if (!res2.ok) {
      const txt2 = await res2.text();
      throw new Error(`fal.ai storage upload failed: ${txt} | fallback: ${txt2}`);
    }
    const j2 = await res2.json();
    return j2.url as string;
  }

  const j = await res.json();
  return (j.url || j.cdn_url || j.image_url) as string;
}

/* ── Step 2: run CatVTON via fal.ai queue ── */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { human_image, cloth_image, cloth_type = "upper_body" } = body;

    if (!human_image || !cloth_image) {
      return NextResponse.json({ error: "human_image and cloth_image are required" }, { status: 400 });
    }

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) {
      return NextResponse.json({ error: "FAL_KEY env variable not set" }, { status: 500 });
    }

    // ── Upload both images in parallel ──────────────────────────
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

    // ── Submit to CatVTON queue ──────────────────────────────────
    const submitRes = await fetch("https://queue.fal.run/fal-ai/cat-vton", {
      method: "POST",
      headers: {
        "Authorization": `Key ${FAL_KEY}`,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        human_image_url: humanUrl,
        cloth_image_url: clothUrl,
        cloth_type,              // "upper_body" | "lower_body" | "dresses"
      }),
    });

    if (!submitRes.ok) {
      const err = await submitRes.text();
      return NextResponse.json({ error: `fal.ai queue submit failed (${submitRes.status}): ${err}` }, { status: 502 });
    }

    const submitData = await submitRes.json();
    const requestId  = submitData.request_id;
    if (!requestId) {
      return NextResponse.json({ error: "fal.ai did not return a request_id" }, { status: 502 });
    }

    // ── Poll for result (max 55 s, every 3 s) ───────────────────
    const deadline = Date.now() + 55_000;
    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 3000));

      const pollRes = await fetch(
        `https://queue.fal.run/fal-ai/cat-vton/requests/${requestId}`,
        { headers: { "Authorization": `Key ${FAL_KEY}` } }
      );

      if (!pollRes.ok) continue; // network blip – keep polling

      const poll = await pollRes.json();

      if (poll.status === "COMPLETED") {
        // Extract output image – CatVTON returns { output: { image: { url } } }
        const imageObj =
          poll.output?.image       ??   // { url, width, height, ... }
          poll.output?.images?.[0] ??
          poll.images?.[0]         ??
          poll.image               ??
          null;

        if (!imageObj) {
          return NextResponse.json({ error: "Job completed but no image in response", raw: poll }, { status: 502 });
        }

        return NextResponse.json({
          image: imageObj,                    // pass full object – has .url
          request_id: requestId,
        });
      }

      if (poll.status === "FAILED") {
        const reason = poll.error || poll.detail || "Unknown error from fal.ai";
        return NextResponse.json({ error: `Try-on job failed: ${reason}` }, { status: 502 });
      }

      // IN_QUEUE or IN_PROGRESS → keep polling
    }

    return NextResponse.json({ error: "Try-on timed out after 55 s – please try again" }, { status: 504 });

  } catch (err: any) {
    console.error("[/api/tryon] Unexpected error:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}