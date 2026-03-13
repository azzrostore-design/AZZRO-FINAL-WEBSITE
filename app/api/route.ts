/**
 * app/api/tryon/route.ts
 * AZZRO Virtual Try-On — fal.ai CatVTON
 */

import { NextRequest, NextResponse } from "next/server";
import { runTryOn, uploadImageToFal, ClothType } from "@/lib/falTryOn";

export const runtime = "nodejs";

async function fetchImageAsBlob(url: string): Promise<Blob> {
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; AZZRO/1.0)",
      "Accept": "image/*,*/*",
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch image: ${url} → ${res.status}`);
  return res.blob();
}

// Detect cloth type from product name + category
function detectClothType(category?: string, name?: string): ClothType {
  const text = ((category ?? '') + ' ' + (name ?? '')).toLowerCase();
  if (text.includes('pant') || text.includes('trouser') || text.includes('skirt') ||
      text.includes('jeans') || text.includes('shorts') || text.includes('legging') ||
      text.includes('palazzo') || text.includes('sharara')) return 'lower';
  if (text.includes('saree') || text.includes('sari') || text.includes('dress') ||
      text.includes('lehenga') || text.includes('gown') || text.includes('jumpsuit') ||
      text.includes('kurta') || text.includes('salwar') || text.includes('anarkali') ||
      text.includes('suit') || text.includes('coord') || text.includes('dungaree')) return 'overall';
  return 'upper';
}

export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get("content-type") ?? "";

    let humanImageUrl: string;
    let garmentImageUrl: string;
    let clothType: ClothType = "overall";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();

      // Auto-detect cloth type from name/category sent from frontend
      const productName     = formData.get("productName") as string ?? "";
      const productCategory = formData.get("productCategory") as string ?? "";
      clothType = detectClothType(productCategory, productName);

      // ── Human image ──
      const humanFile = formData.get("humanImage") as File | null;
      const humanUrl  = formData.get("humanImageUrl") as string | null;
      if (humanFile && humanFile.size > 0) {
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
        garmentImageUrl = await uploadImageToFal(garmentFile);
      } else if (garmentUrl) {
        const blob = await fetchImageAsBlob(garmentUrl);
        garmentImageUrl = await uploadImageToFal(blob);
      } else {
        return NextResponse.json({ error: "garmentImage or garmentImageUrl required" }, { status: 400 });
      }

    } else {
      const body = await req.json();
      humanImageUrl  = body.humanImageUrl;
      garmentImageUrl = body.garmentImageUrl;
      clothType = body.clothType ?? detectClothType(body.productCategory, body.productName);

      if (!humanImageUrl || !garmentImageUrl) {
        return NextResponse.json({ error: "humanImageUrl and garmentImageUrl required" }, { status: 400 });
      }
    }

    console.log("[tryon] clothType:", clothType);
    const result = await runTryOn({ humanImageUrl, garmentImageUrl, clothType });

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
