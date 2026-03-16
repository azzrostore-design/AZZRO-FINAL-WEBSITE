// app/api/image-proxy/route.ts
// Proxies external image URLs through your Next.js server.
// This fixes two problems:
//   1. CORS — browsers block direct fetch() of many external image URLs
//   2. Validation — we verify the response is actually an image before
//      passing it to /api/tryon, preventing the JSON parse error

import { NextRequest, NextResponse } from "next/server";

// Only allow fetching images from these domains (security whitelist)
const ALLOWED_DOMAINS = [
  "picsum.photos",
  "images.unsplash.com",
  "cdn.shopify.com",
  "res.cloudinary.com",
  "firebasestorage.googleapis.com",
  "storage.googleapis.com",
  "amazonaws.com",
  "imgix.net",
  "images.pexels.com",
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "Missing url parameter" }, { status: 400 });
  }

  // Validate URL
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Security: only allow whitelisted domains
  const hostname = parsedUrl.hostname;
  const isAllowed = ALLOWED_DOMAINS.some(domain => hostname === domain || hostname.endsWith("." + domain));
  if (!isAllowed) {
    return NextResponse.json(
      { error: `Domain not allowed: ${hostname}. Add it to ALLOWED_DOMAINS in /api/image-proxy/route.ts` },
      { status: 403 }
    );
  }

  try {
    const res = await fetch(url, {
      headers: {
        // Some CDNs require a User-Agent
        "User-Agent": "Mozilla/5.0 (compatible; Azzro/1.0)",
      },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream image fetch failed with status ${res.status}` },
        { status: 502 }
      );
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";

    // Verify it's actually an image
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: `URL did not return an image, got: ${contentType}` },
        { status: 422 }
      );
    }

    const buffer = await res.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400", // cache for 1 day
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Proxy fetch failed: " + e.message },
      { status: 500 }
    );
  }
}
