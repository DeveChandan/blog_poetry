import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET() {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const db = await connectDB()
    const userReactions = await db
      .collection("reactions")
      .find({ userId: session.userId })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(userReactions)
  } catch (error) {
    console.error("Failed to fetch user reactions:", error)
    return NextResponse.json({ error: "Failed to fetch user reactions" }, { status: 500 })
  }
}
