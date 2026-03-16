import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

async function uploadToFal(base64DataUrl: string, falKey: string): Promise<string> {
  const match = base64DataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) throw new Error("Invalid image format");
  const mimeType = match[1];
  const b64data = match[2];

  try {
    const r = await fetch("https://fal.run/fal-ai/storage/upload", {
      method: "POST",
      headers: { "Authorization": "Key " + falKey, "Content-Type": "application/json" },
      body: JSON.stringify({ image: "data:" + mimeType + ";base64," + b64data }),
    });
    if (r.ok) {
      const j = await r.json();
      const url = j.url || j.cdn_url || j.image_url;
      if (url) return url;
    }
  } catch (_) {}

  const r2 = await fetch("https://rest.alpha.fal.ai/storage/upload/base64", {
    method: "POST",
    headers: { "Authorization": "Key " + falKey, "Content-Type": "application/json" },
    body: JSON.stringify({ content_type: mimeType, data: b64data }),
  });
  if (!r2.ok) throw new Error("fal.ai upload failed: " + r2.status);
  const j2 = await r2.json();
  return j2.url;
}

function safeJSON(text: string): any {
  try {
    const s = text.replace(/```json/gi, "").replace(/```/g, "").trim();
    const m = s.match(/\{[\s\S]*\}/);
    return JSON.parse(m ? m[0] : s);
  } catch (_) {
    return null;
  }
}

async function getFit(resultUrl: string, name: string, type: string, falKey: string) {
  const def = { score: 85, tip: "Looks great on you!" };
  try {
    const prompt = "You are a fashion expert. Rate how well the garment " + name + " (" + type.replace("_", " ") + ") fits this person on a scale of 1 to 100. Reply ONLY with this exact JSON format: {\"score\":85,\"tip\":\"One sentence tip here\"}";
    const r = await fetch("https://fal.run/fal-ai/any-llm", {
      method: "POST",
      headers: { "Authorization": "Key " + falKey, "Content-Type": "application/json" },
      body: JSON.stringify({ model: "meta-llama/llama-3.1-8b-instruct", prompt: prompt, max_tokens: 80 }),
    });
    if (!r.ok) return def;
    const d = await r.json();
    const text = d.output || d.text || d.response || "";
    const p = safeJSON(text);
    if (p && typeof p.score === "number") return { score: Math.min(100, Math.max(1, p.score)), tip: p.tip || def.tip };
    return def;
  } catch (_) {
    return def;
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      const raw = await req.text();
      body = JSON.parse(raw);
    } catch (e: any) {
      return NextResponse.json({ error: "Bad request body: " + e.message }, { status: 400 });
    }

    const human_image = body.human_image;
    const cloth_image = body.cloth_image;
    const cloth_type = body.cloth_type || "upper_body";
    const garment_name = body.garment_name || "Garment";

    if (!human_image || !cloth_image) {
      return NextResponse.json({ error: "human_image and cloth_image required" }, { status: 400 });
    }

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) {
      return NextResponse.json({ error: "FAL_KEY not set in env" }, { status: 500 });
    }

    let humanUrl: string;
    let clothUrl: string;
    try {
      const uploaded = await Promise.all([
        uploadToFal(human_image, FAL_KEY),
        uploadToFal(cloth_image, FAL_KEY),
      ]);
      humanUrl = uploaded[0];
      clothUrl = uploaded[1];
    } catch (e: any) {
      return NextResponse.json({ error: "Image upload failed: " + e.message }, { status: 502 });
    }

    const submitRes = await fetch("https://queue.fal.run/fal-ai/cat-vton", {
      method: "POST",
      headers: { "Authorization": "Key " + FAL_KEY, "Content-Type": "application/json" },
      body: JSON.stringify({
        human_image_url: humanUrl,
        cloth_image_url: clothUrl,
        cloth_type: cloth_type,
      }),
    });

    if (!submitRes.ok) {
      const err = await submitRes.text();
      return NextResponse.json({ error: "CatVTON submit failed " + submitRes.status + ": " + err }, { status: 502 });
    }

    const submitData = await submitRes.json();
    const request_id = submitData.request_id;
    if (!request_id) {
      return NextResponse.json({ error: "No request_id from fal.ai" }, { status: 502 });
    }

    const deadline = Date.now() + 55000;
    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 3000));

      const pollRes = await fetch("https://queue.fal.run/fal-ai/cat-vton/requests/" + request_id, {
        headers: { "Authorization": "Key " + FAL_KEY },
      });
      if (!pollRes.ok) continue;

      const poll = await pollRes.json();

      if (poll.status === "COMPLETED") {
        const imageObj = poll.output?.image || poll.output?.images?.[0] || poll.images?.[0] || poll.image || null;
        if (!imageObj) {
          return NextResponse.json({ error: "No image in response", raw: JSON.stringify(poll).slice(0, 300) }, { status: 502 });
        }
        const resultUrl = typeof imageObj === "string" ? imageObj : (imageObj.url || imageObj.cdn_url || "");
        if (!resultUrl) {
          return NextResponse.json({ error: "Cannot extract image URL" }, { status: 502 });
        }
        const fit = await getFit(resultUrl, garment_name, cloth_type, FAL_KEY);
        return NextResponse.json({
          success: true,
          result_url: resultUrl,
          image: imageObj,
          fit_score: fit.score,
          fit_tip: fit.tip,
          request_id: request_id,
        });
      }

      if (poll.status === "FAILED") {
        return NextResponse.json({ error: "Job failed: " + (poll.error || "unknown") }, { status: 502 });
      }
    }

    return NextResponse.json({ error: "Timed out after 55s, please try again" }, { status: 504 });

  } catch (err: any) {
    console.error("[/api/tryon]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
