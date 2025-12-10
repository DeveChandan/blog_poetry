import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const contentId = searchParams.get("contentId")
    const contentType = searchParams.get("contentType")

    const db = await connectDB()

    if (!contentId) {
      const reviews = await db.collection("reviews").find({}).toArray()
      return NextResponse.json(reviews)
    }

    const reviews = await db
      .collection("reviews")
      .find({
        contentId,
        contentType,
      })
      .toArray()

    return NextResponse.json(reviews)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { contentId, contentType, rating, comment } = await request.json()
    const db = await connectDB()

    const result = await db.collection("reviews").insertOne({
      contentId,
      contentType,
      userId: session.userId,
      userName: "User",
      rating,
      comment,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({ message: "Review created", id: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
