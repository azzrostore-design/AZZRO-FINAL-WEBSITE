/**
 * lib/falTryOn.ts
 * AZZRO Virtual Try-On — fal.ai FASHN v1.6
 */

import { fal } from "@fal-ai/client";

fal.config({
  credentials: process.env.FAL_KEY ?? "",
});

export type FashnCategory = "tops" | "bottoms" | "one-pieces" | "auto";

export interface TryOnInput {
  humanImageUrl: string;
  garmentImageUrl: string;
  category?: FashnCategory;
  longGarment?: boolean;
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
    category = "auto",
    longGarment = false,
  } = input;

  if (!process.env.FAL_KEY) {
    throw new Error("FAL_KEY environment variable is not set.");
  }

  console.log("[FASHN v1.6] category:", category, "| longGarment:", longGarment);

  const result = await fal.subscribe("fal-ai/fashn/tryon/v1.6", {
    input: {
      model_image: humanImageUrl,
      garment_image: garmentImageUrl,
      category,
      long_top: longGarment,          // important for sarees/kurtas/gowns
      garment_photo_type: "auto",     // handles both flat-lay and model shots
      adjust_hands: true,             // fixes hand/wrist area
      restore_background: true,       // keeps original background
      restore_clothes: true,          // preserves non-garment clothing
      guidance_scale: 2.0,
      timestep_to_start_cfg: 3,
      num_inference_steps: 20,        // lowest cost ~$0.02 per try-on
      seed: 42,
    },
    logs: true,
    onQueueUpdate: (update) => {
      console.log("[FASHN v1.6] status:", update.status);
    },
  });

  console.log("[FASHN v1.6] result.data:", JSON.stringify(result.data, null, 2));

  const image = result.data?.images?.[0];

  if (!image?.url) {
    throw new Error(`FASHN v1.6 returned no image. Response: ${JSON.stringify(result.data)}`);
  }

  return {
    imageUrl: image.url,
    requestId: result.requestId,
    width: image.width ?? 864,
    height: image.height ?? 1296,
  };
}

export async function uploadImageToFal(file: File | Blob): Promise<string> {
  const url = await fal.storage.upload(file);
  return url;
}
