/**
 * lib/falTryOn.ts
 * AZZRO Virtual Try-On — fal.ai FASHN v1.6 (replaces CatVTON)
 *
 * COST COMPARISON:
 *   OLD (CatVTON):  $0.00111/compute-second × ~15s = ~$0.017/image  (~₹1.4)
 *   NEW (FASHN v1.6): flat ~$0.003/image in "balanced" mode          (~₹0.25)
 *   SAVINGS: ~5–6× cheaper per image
 *
 * SPEED: "balanced" mode runs in ~8–12s (same or faster than CatVTON)
 */

import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY ?? "",
});

export type ClothType = "upper" | "lower" | "overall";

type FashnCategory = "tops" | "bottoms" | "one-pieces" | "auto";

function toFashnCategory(clothType: ClothType): FashnCategory {
  if (clothType === "upper")   return "tops";
  if (clothType === "lower")   return "bottoms";
  if (clothType === "overall") return "one-pieces";
  return "auto";
}

export interface TryOnInput {
  humanImageUrl: string;
  garmentImageUrl: string;
  clothType?: ClothType;
  numInferenceSteps?: number; // kept for API compatibility, unused
  seed?: number;
}

export interface TryOnResult {
  imageUrl: string;
  requestId: string;
  width: number;
  height: number;
}

export async function runTryOn(input: TryOnInput): Promise<TryOnResult> {
  const {
    humanImageUrl,
    garmentImageUrl,
    clothType = "overall",
    seed = 42,
  } = input;

  if (!process.env.FAL_KEY) {
    throw new Error("FAL_KEY environment variable is not set.");
  }

  const fashnCategory = toFashnCategory(clothType);
  console.log("[FASHN] clothType:", clothType, "→ fashn category:", fashnCategory);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: any = await (fal as any).subscribe("fal-ai/fashn/tryon/v1.6", {
    input: {
      model_image:        humanImageUrl,
      garment_image:      garmentImageUrl,
      category:           fashnCategory,
      mode:               "balanced",
      garment_photo_type: "auto",
      nsfw_filter:        true,
      seed,
    },
    logs: true,
    onQueueUpdate: (update: any) => {
      console.log("[FASHN] status:", update.status);
    },
  });

  console.log("[FASHN] result.data:", JSON.stringify(result.data, null, 2));

  const data = result.data ?? {};

  // FASHN v1.6 returns data.images as an array of { url, width, height, content_type }
  const images: any[] = Array.isArray(data.images) ? data.images : [];
  const imageUrl: string =
    images.length > 0
      ? images[0]?.url
      : data.image?.url ?? data.image ?? "";

  if (!imageUrl) {
    throw new Error(
      `FASHN returned no image. Response: ${JSON.stringify(data)}`
    );
  }

  return {
    imageUrl,
    requestId: result.requestId ?? "",
    width:  images[0]?.width  ?? 864,
    height: images[0]?.height ?? 1296,
  };
}

export async function uploadImageToFal(file: File | Blob): Promise<string> {
  const url = await fal.storage.upload(file);
  return url;
}
