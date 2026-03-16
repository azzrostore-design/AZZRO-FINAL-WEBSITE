import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/Product";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const gender      = searchParams.get("gender");
    const category    = searchParams.get("category");
    const subcategory = searchParams.get("subcategory");
    const search      = searchParams.get("search");
    const limit       = searchParams.get("limit");

    const query: any = {};
    if (gender)      query.gender      = gender;
    if (category)    query.category    = category;
    if (subcategory) query.subcategory = subcategory;
    if (search)      query.name        = { $regex: search, $options: "i" };

    let q = Product.find(query);
    if (limit) q = q.limit(Number(limit));
    const raw = await q.lean();

    // ✅ Normalize so useStoreProducts & AITryOn always get a valid `image` field
    const products = raw.map((p: any) => ({
      ...p,
      id:    p._id?.toString(),
      // images[] is your DB field; image is what the tryon component expects
      image: (p.images && p.images.length > 0) ? p.images[0] : "",
      slug:  p.slug || p._id?.toString(),
    }));

    return NextResponse.json(products);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || String(e) },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body    = await req.json();
    const product = await Product.create(body);
    return NextResponse.json(product);
  } catch (e: any) {
    return NextResponse.json(
      { error: e.message || String(e) },
      { status: 500 }
    );
  }
}
