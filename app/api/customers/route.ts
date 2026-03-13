import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Customer from "@/lib/Customer";

export async function GET() {

    await connectDB()

    const customers = await Customer.find()

    return NextResponse.json(customers)

}