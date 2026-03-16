/**
 * app/api/tryon/route.ts
 * AZZRO Virtual Try-On — fal.ai FASHN v1.6
 */

import { NextRequest, NextResponse } from "next/server";
import { runTryOn, uploadImageToFal, FashnCategory } from "@/lib/falTryOn";

export const runtime = "nodejs";

async function fetchImageAsBlob(url: string): Promise<Blob> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; AZZRO/1.0)",
      "Accept": "image/*,*/*",
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch image from ${url}: ${res.status}`);
  return res.blob();
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";

    let humanImageUrl: string;
    let garmentImageUrl: string;
    let category: FashnCategory = "auto";
    let longGarment = false;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      category = ((formData.get("category") as string) ?? "auto") as FashnCategory;
      longGarment = formData.get("longGarment") === "true";

      // ── Human image ──
      const humanFile = formData.get("humanImage") as File | null;
      const humanUrl  = formData.get("humanImageUrl") as string | null;

      if (humanFile && humanFile.size > 0) {
        console.log("[tryon] Uploading human image...");
        humanImageUrl = await uploadImageToFal(humanFile);
      } else if (humanUrl) {
        humanImageUrl = humanUrl;
      } else {
        return NextResponse.json({ error: "humanImage or humanImageUrl required" }, { status: 400 });
      }

      // ── Garment image ──
      const garmentFile = formData.get("garmentImage") as File | null;
      const garmentUrl  = formData.get("garmentImageUrl") as string | null;

      if (garmentFile && garmentFile.size > 0) {
        console.log("[tryon] Uploading garment image...");
        garmentImageUrl = await uploadImageToFal(garmentFile);
      } else if (garmentUrl) {
        console.log("[tryon] Fetching garment from URL:", garmentUrl);
        const blob = await fetchImageAsBlob(garmentUrl);
        garmentImageUrl = await uploadImageToFal(blob);
      } else {
        return NextResponse.json({ error: "garmentImage or garmentImageUrl required" }, { status: 400 });
      }

    } else {
      const body = await req.json();
      category = (body.category ?? "auto") as FashnCategory;
      longGarment = body.longGarment ?? false;
      humanImageUrl  = body.humanImageUrl;
      garmentImageUrl = body.garmentImageUrl;

      if (!humanImageUrl || !garmentImageUrl) {
        return NextResponse.json({ error: "humanImageUrl and garmentImageUrl required" }, { status: 400 });
      }
    }

    console.log("[tryon] FASHN v1.6 | category:", category, "| longGarment:", longGarment);

    const result = await runTryOn({ humanImageUrl, garmentImageUrl, category, longGarment });

    return NextResponse.json({
      success: true,
      imageUrl: result.imageUrl,
      requestId: result.requestId,
      width: result.width,
      height: result.height,
    });

  } catch (err: unknown) {
    console.error("[/api/tryon] Error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
