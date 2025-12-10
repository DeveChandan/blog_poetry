import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const contentId = searchParams.get("contentId")
    const contentType = searchParams.get("contentType")

    const db = await connectDB()
    const reactions = await db
      .collection("reactions")
      .find({
        contentId,
        contentType,
      })
      .toArray()

    return NextResponse.json(reactions)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reactions" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { contentId, contentType, type } = await request.json()
    const db = await connectDB()

    // Check if user already reacted
    const existingReaction = await db.collection("reactions").findOne({
      contentId,
      contentType,
      userId: session.userId,
    })

    if (existingReaction) {
      await db.collection("reactions").deleteOne({ _id: existingReaction._id })
      return NextResponse.json({
        message: "Reaction removed",
        removed: true,
      })
    }

    const result = await db.collection("reactions").insertOne({
      contentId,
      contentType,
      userId: session.userId,
      type,
      createdAt: new Date(),
    })

    return NextResponse.json({ message: "Reaction created", id: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create reaction" }, { status: 500 })
  }
}
