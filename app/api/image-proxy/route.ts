import { NextRequest, NextResponse } from "next/server";

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

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  const hostname = parsedUrl.hostname;
  const isAllowed = ALLOWED_DOMAINS.some(
    domain => hostname === domain || hostname.endsWith("." + domain)
  );
  if (!isAllowed) {
    return NextResponse.json(
      { error: `Domain not allowed: ${hostname}` },
      { status: 403 }
    );
  }

  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; Azzro/1.0)" },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Upstream fetch failed: ${res.status}` },
        { status: 502 }
      );
    }

    const contentType = res.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return NextResponse.json(
        { error: `Not an image, got: ${contentType}` },
        { status: 422 }
      );
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: "Proxy error: " + e.message },
      { status: 500 }
    );
  }
}
