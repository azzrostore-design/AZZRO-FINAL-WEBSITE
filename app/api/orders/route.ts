import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import Order from "@/lib/Order"

export async function GET() {

    await connectDB()

    const orders = await Order.find()

    return NextResponse.json(orders)
}

export async function POST(req: Request) {

    await connectDB()

    const data = await req.json()

    const order = await Order.create(data)

    return NextResponse.json(order)
}