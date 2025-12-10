import { connectDB } from "@/lib/db"
import { getSessionUser } from "@/lib/session"
import { type NextRequest, NextResponse } from "next/server"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const db = await connectDB()

    const video = await db.collection("videos").findOne({
      _id: new ObjectId(id),
    })

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    // Increment view count
    await db.collection("videos").updateOne({ _id: new ObjectId(id) }, { $inc: { views: 1 } })

    return NextResponse.json({
      ...video,
      _id: video._id.toString(),
    })
  } catch (error) {
    console.error("Failed to fetch video:", error)
    return NextResponse.json({ error: "Failed to fetch video" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser(request)

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, youtubeId } = body // Remove thumbnail from destructuring

    const db = await connectDB()

    const { id } = await params
    const generatedThumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` // Always generate thumbnail

    const result = await db.collection("videos").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          description,
          youtubeId,
          thumbnail: generatedThumbnail, // Use the generated thumbnail
          updatedAt: new Date(),
        },
      },
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to update video:", error)
    return NextResponse.json({ error: "Failed to update video" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getSessionUser(request)

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const db = await connectDB()

    const { id } = await params
    const result = await db.collection("videos").deleteOne({
      _id: new ObjectId(id),
    })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete video:", error)
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 })
  }
}
