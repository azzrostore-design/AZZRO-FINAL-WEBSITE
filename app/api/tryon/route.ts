import { NextRequest, NextResponse } from "next/server";
export const maxDuration = 60;

async function uploadToFal(base64DataUrl: string, falKey: string): Promise<string> {
  const match = base64DataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) throw new Error("Invalid image format — not a base64 data URL");
  const mimeType = match[1];
  const b64data  = match[2];
  const res = await fetch("https://rest.alpha.fal.ai/storage/upload/base64", {
    method:  "POST",
    headers: { "Authorization": "Key " + falKey, "Content-Type": "application/json" },
    body:    JSON.stringify({ content_type: mimeType, data: b64data }),
  });
  if (!res.ok) throw new Error("FAL upload failed: " + res.status);
  return (await res.json()).url;
}

export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();

    if (!raw || raw.trim() === "") {
      return NextResponse.json({ error: "Empty request body" }, { status: 400 });
    }

    let body: any;
    try {
      body = JSON.parse(raw);
    } catch (e: any) {
      return NextResponse.json({
        error: "JSON parse failed: " + e.message,
        first100: raw.slice(0, 100),
      }, { status: 400 });
    }

    const human_image = body.human_image;
    const cloth_image = body.cloth_image;
    const cloth_type  = body.cloth_type || "upper_body";

    if (!human_image || typeof human_image !== "string") {
      return NextResponse.json({ error: "human_image missing or invalid" }, { status: 400 });
    }
    if (!cloth_image || typeof cloth_image !== "string") {
      return NextResponse.json({ error: "cloth_image missing or invalid" }, { status: 400 });
    }
    if (!human_image.startsWith("data:image/")) {
      return NextResponse.json({
        error: "human_image is not a valid base64 image",
        starts: human_image.slice(0, 80),
      }, { status: 400 });
    }
    if (!cloth_image.startsWith("data:image/")) {
      return NextResponse.json({
        error: "cloth_image is not a valid base64 image",
        starts: cloth_image.slice(0, 80),
      }, { status: 400 });
    }

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) return NextResponse.json({ error: "FAL_KEY not set" }, { status: 500 });

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
      return NextResponse.json({ error: "FAL upload: " + e.message }, { status: 502 });
    }

    const sub = await fetch("https://queue.fal.run/fal-ai/cat-vton", {
      method:  "POST",
      headers: { "Authorization": "Key " + FAL_KEY, "Content-Type": "application/json" },
      body:    JSON.stringify({ human_image_url: humanUrl, cloth_image_url: clothUrl, cloth_type }),
    });
    if (!sub.ok) {
      return NextResponse.json({
        error: "FAL submit failed: " + sub.status,
        body:  await sub.text(),
      }, { status: 502 });
    }

    const { request_id } = await sub.json();
    if (!request_id) return NextResponse.json({ error: "No request_id from FAL" }, { status: 502 });

    const end = Date.now() + 55000;
    while (Date.now() < end) {
      await new Promise(r => setTimeout(r, 3000));
      const p = await fetch(`https://queue.fal.run/fal-ai/cat-vton/requests/${request_id}`, {
        headers: { "Authorization": "Key " + FAL_KEY },
      });
      if (!p.ok) continue;
      const d = await p.json();
      if (d.status === "COMPLETED") {
        const img = d.output?.image || d.output?.images?.[0] || d.images?.[0] || d.image;
        if (!img) return NextResponse.json({ error: "No image in FAL response" }, { status: 502 });
        const url = typeof img === "string" ? img : img.url || img.cdn_url || "";
        return NextResponse.json({
          success:    true,
          result_url: url,
          image:      img,
          fit_score:  85,
          fit_tip:    "Looks great on you!",
        });
      }
      if (d.status === "FAILED") {
        return NextResponse.json({ error: "FAL failed: " + (d.error || "unknown") }, { status: 502 });
      }
    }

    return NextResponse.json({ error: "Timeout waiting for result" }, { status: 504 });

  } catch (e: any) {
    console.error("[/api/tryon]", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
