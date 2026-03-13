import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Seller from "@/lib/Seller";

export async function GET() {

    await connectDB()

    const sellers = await Seller.find()

    return NextResponse.json(sellers)

}