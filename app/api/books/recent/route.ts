import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function GET() {
  try {
    const db = await connectDB()
    const books = await db
      .collection("books")
      .find({})
      .sort({ createdAt: -1 })
      .limit(2)
      .toArray()

    return NextResponse.json(books)
  } catch (error) {
    console.error("Failed to fetch recent books:", error)
    return NextResponse.json({ error: "Failed to fetch recent books" }, { status: 500 })
  }
}
