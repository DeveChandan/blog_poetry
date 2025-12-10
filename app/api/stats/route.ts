import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function GET() {
  try {
    const db = await connectDB()
    const totalPoems = await db.collection("poems").countDocuments()
    const booksPublished = await db.collection("books").countDocuments()

    // These stats can be improved later
    const totalReaders = 12345 // Placeholder
    const yearsWriting = 8     // Placeholder

    return NextResponse.json({
      totalPoems,
      booksPublished,
      totalReaders,
      yearsWriting,
    })
  } catch (error) {
    console.error("Failed to fetch stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
