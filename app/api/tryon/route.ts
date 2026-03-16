import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

async function uploadToFal(base64DataUrl: string, falKey: string): Promise<string> {
  const match = base64DataUrl.match(/^data:(.+?);base64,(.+)$/);
  if (!match) throw new Error("Invalid image format");

  const mimeType = match[1];
  const b64data  = match[2];

  const res = await fetch("https://fal.run/fal-ai/storage/upload", {
    method:  "POST",
    headers: {
      "Authorization": "Key " + falKey,
      "Content-Type":  "application/json",
    },
    body: JSON.stringify({
      image: "data:" + mimeType + ";base64," + b64data,
    }),
  });

  if (!res.ok) {
    const res2 = await fetch("https://rest.alpha.fal.ai/storage/upload/base64", {
      method:  "POST",
      headers: {
        "Authorization": "Key " + falKey,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({ content_type: mimeType, data: b64data }),
    });
    if (!res2.ok) {
      throw new Error("fal.ai upload failed: " + res2.status);
    }
    const j2 = await res2.json();
    return j2.url as string;
  }

  const j = await res.json();
  return (j.url || j.cdn_url || j.image_url) as string;
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      const raw = await req.text();
      body = JSON.parse(raw);
    } catch (e: any) {
      return NextResponse.json({ error: "Invalid request body: " + e.message }, { status: 400 });
    }

    const human_image  = body.human_image;
    const cloth_image  = body.cloth_image;
    const cloth_type   = body.cloth_type || "upper_body";
    const garment_name = body.garment_name || "Garment";

    if (!human_image || !cloth_image) {
      return NextResponse.json({ error: "human_image and cloth_image are required" }, { status: 400 });
    }

    const FAL_KEY = process.env.FAL_KEY;
    if (!FAL_KEY) {
      return NextResponse.json({ error: "FAL_KEY not set" }, { status: 500 });
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
      headers: {
        "Authorization": "Key " + FAL_KEY,
        "Content-Type":  "application/json",
      },
      body: JSON.stringify({
        human_image_url: humanUrl,
        cloth_image_url: clothUrl,
        cloth_type: cloth_type,
      }),
    });

    if (!submitRes.ok) {
      const err = await submitRes.text();
      return NextResponse.json({ error: "Submit failed " + submitRes.status + ": " + err }, { status: 502 });
    }

    const submitData = await submitRes.json();
    const requestId  = submitData.request_id;
    if (!requestId) {
      return NextResponse.json({ error: "No request_id from fal.ai" }, { status: 502 });
    }

    const deadline = Date.now() + 55000;
    while (Date.now() < deadline) {
      await new Promise(r => setTimeout(r, 3000));

      const pollRes = await fetch(
        "https://queue.fal.run/fal-ai/cat-vton/requests/" + requestId,
        { headers: { "Authorization": "Key " + FAL_KEY } }
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
          return NextResponse.json({ error: "No image in response" }, { status: 502 });
        }

        const resultUrl = typeof imageObj === "string"
          ? imageObj
          : (imageObj.url || imageObj.cdn_url || "");

        return NextResponse.json({
          success:    true,
          result_url: resultUrl,
          image:      imageObj,
          fit_score:  85,
          fit_tip:    "Looks great on you!",
          request_id: requestId,
        });
      }

      if (poll.status === "FAILED") {
        const reason = poll.error || poll.detail || "Unknown error";
        return NextResponse.json({ error: "Job failed: " + reason }, { status: 502 });
      }
    }

    return NextResponse.json({ error: "Timed out, please try again" }, { status: 504 });

  } catch (err: any) {
    console.error("[/api/tryon]", err);
    return NextResponse.json({ error: err.message || "Internal error" }, { status: 500 });
  }
}
