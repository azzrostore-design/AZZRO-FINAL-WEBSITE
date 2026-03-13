import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URL || "";

if (!MONGODB_URI) {
    console.warn("MONGO_URL is missing. DB might not connect.");
}

let cached = (global as any).mongoose;

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
            return mongoose;
        });
    }

    try {
        cached.conn = await cached.promise;
        console.log("MongoDB Connected Structure NextJS");
        return cached.conn;
    } catch (e) {
        cached.promise = null;
        console.error("MongoDB connection error:", e);
        throw e;
    }
}