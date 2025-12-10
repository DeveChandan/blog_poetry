import { connectDB } from "@/lib/db"
import { getSessionUser } from "@/lib/session"
import { type NextRequest, NextResponse } from "next/server"

export async function GET() {
  try {
    const db = await connectDB()
    const videos = await db.collection("videos").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(
      videos.map((v) => ({
        ...v,
        id: v._id.toString(),
      })),
    )
  } catch (error) {
    console.error("Failed to fetch videos:", error)
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser(request)

    if (!user?.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { title, description, youtubeId } = body // Remove thumbnail from destructuring

    if (!title || !youtubeId) {
      return NextResponse.json({ error: "Title and YouTube ID are required" }, { status: 400 })
    }

    const db = await connectDB()

    const generatedThumbnail = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` // Always generate thumbnail

    const result = await db.collection("videos").insertOne({
      title,
      description: description || "",
      youtubeId,
      thumbnail: generatedThumbnail, // Use the generated thumbnail
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    return NextResponse.json({
      _id: result.insertedId.toString(),
      title,
      description,
      youtubeId,
      thumbnail: generatedThumbnail, // Return the generated thumbnail
      views: 0,
    })
  } catch (error) {
    console.error("Failed to create video:", error)
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 })
  }
}
