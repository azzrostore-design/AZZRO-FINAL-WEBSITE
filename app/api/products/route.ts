import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Product from "@/lib/Product";

export async function GET(req: Request) {

    try {

        await connectDB()

        const { searchParams } = new URL(req.url)

        const gender = searchParams.get("gender")
        const category = searchParams.get("category")
        const subcategory = searchParams.get("subcategory")

        const query: any = {}

        if (gender) query.gender = gender
        if (category) query.category = category
        if (subcategory) query.subcategory = subcategory

        const products = await Product.find(query)

        return NextResponse.json(products)

    } catch (e: any) {

        return NextResponse.json(
            { error: e.message || String(e) },
            { status: 500 }
        )

    }

}

export async function POST(req: Request) {

    await connectDB()

    const body = await req.json()

    const product = await Product.create(body)

    return NextResponse.json(product)

}