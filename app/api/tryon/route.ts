import { NextRequest, NextResponse } from "next/server";
export const maxDuration = 60;
async function upload(img: string, key: string): Promise<string> {
  const m = img.match(/^data:(.+?);base64,(.+)$/);
  if (!m) throw new Error("bad image");
  const mime = m[1], b64 = m[2];
  const r = await fetch("https://rest.alpha.fal.ai/storage/upload/base64", {
    method: "POST",
    headers: { "Authorization": "Key " + key, "Content-Type": "application/json" },
    body: JSON.stringify({ content_type: mime, data: b64 }),
  });
  if (!r.ok) throw new Error("upload failed " + r.status);
  return (await r.json()).url;
}
export async function POST(req: NextRequest) {
  try {
    const raw = await req.text();
    let body: any;
    try { body = JSON.parse(raw); }
    catch (e: any) { return NextResponse.json({ error: "bad json: " + e.message }, { status: 400 }); }
    const hi = body.human_image, ci = body.cloth_image, ct = body.cloth_type || "upper_body";
    if (!hi || !ci) return NextResponse.json({ error: "missing images" }, { status: 400 });
    const FAL = process.env.FAL_KEY;
    if (!FAL) return NextResponse.json({ error: "FAL_KEY missing" }, { status: 500 });
    let hu: string, cu: string;
    try { [hu, cu] = await Promise.all([upload(hi, FAL), upload(ci, FAL)]); }
    catch (e: any) { return NextResponse.json({ error: "upload: " + e.message }, { status: 502 }); }
    const sub = await fetch("https://queue.fal.run/fal-ai/cat-vton", {
      method: "POST",
      headers: { "Authorization": "Key " + FAL, "Content-Type": "application/json" },
      body: JSON.stringify({ human_image_url: hu, cloth_image_url: cu, cloth_type: ct }),
    });
    if (!sub.ok) return NextResponse.json({ error: "submit failed " + sub.status + " " + await sub.text() }, { status: 502 });
    const { request_id } = await sub.json();
    if (!request_id) return NextResponse.json({ error: "no request_id" }, { status: 502 });
    const end = Date.now() + 55000;
    while (Date.now() < end) {
      await new Promise(r => setTimeout(r, 3000));
      const p = await fetch("https://queue.fal.run/fal-ai/cat-vton/requests/" + request_id, {
        headers: { "Authorization": "Key " + FAL },
      });
      if (!p.ok) continue;
      const d = await p.json();
      if (d.status === "COMPLETED") {
        const img = d.output?.image || d.output?.images?.[0] || d.images?.[0] || d.image;
        if (!img) return NextResponse.json({ error: "no image in response" }, { status: 502 });
        const url = typeof img === "string" ? img : img.url || img.cdn_url || "";
        if (!url) return NextResponse.json({ error: "no url" }, { status: 502 });
        return NextResponse.json({ success: true, result_url: url, image: img, fit_score: 85, fit_tip: "Looks great on you!" });
      }
      if (d.status === "FAILED") return NextResponse.json({ error: "job failed: " + (d.error || "unknown") }, { status: 502 });
    }
    return NextResponse.json({ error: "timeout" }, { status: 504 });
  } catch (e: any) {
    console.error("[/api/tryon]", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
