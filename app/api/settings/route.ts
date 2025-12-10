import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET() {
  try {
    const db = await connectDB()
    const settings = await db.collection("settings").findOne({})

    return NextResponse.json(settings || {})
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
    }

    const data = await request.json()
    const db = await connectDB()

    // Remove _id from data to prevent modifying the immutable field
    const { _id, ...updateData } = data

    await db.collection("settings").updateOne({}, { $set: updateData }, { upsert: true })

    return NextResponse.json({ message: "Settings updated" })
  } catch (error) {
    console.error("Failed to update settings:", error) // Log the actual error
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 })
  }
}
