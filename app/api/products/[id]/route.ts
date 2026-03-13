import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Product from "@/lib/Product"

export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {

    await connectDB()

    const params = await context.params
    const data = await req.json()

    const updated = await Product.findByIdAndUpdate(
        params.id,
        data,
        { new: true }
    )

    return NextResponse.json(updated)
}
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {

    await connectDB()

    const params = await context.params
    await Product.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Deleted" })
}