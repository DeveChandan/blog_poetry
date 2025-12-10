import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function GET() {
  try {
    const db = await connectDB()
    let poems = await db
      .collection("poems")
      .find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(3)
      .toArray()

    if (poems.length === 0) {
      poems = await db
        .collection("poems")
        .find({})
        .sort({ createdAt: -1 })
        .limit(3)
        .toArray()
    }

    return NextResponse.json(poems)
  } catch (error) {
    console.error("Failed to fetch featured poems:", error)
    return NextResponse.json({ error: "Failed to fetch featured poems" }, { status: 500 })
  }
}
