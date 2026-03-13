import { NextResponse } from "next/server"
import cloudinary from "@/lib/cloudinary"

export async function POST(req: Request) {

    const data = await req.formData()
    const file = data.get("file") as File

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const result: any = await new Promise((resolve, reject) => {

        cloudinary.uploader.upload_stream(
            { folder: "azzro-products" },
            (error, result) => {
                if (error) reject(error)
                else resolve(result)
            }
        ).end(buffer)

    })

    return NextResponse.json({
        url: result.secure_url
    })

}