import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { extractYouTubeId } from "@/lib/youtube"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const db = await connectDB()
    const creators = await db
      .collection("creators")
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray()

    const serialized = creators.map((c) => ({
      ...c,
      _id: c._id.toString(),
    }))

    return NextResponse.json(serialized)
  } catch (error) {
    console.error("Failed to fetch creators:", error)
    return NextResponse.json({ error: "Failed to fetch creators" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const body = await request.json()
    const { name, city, category, intro, photo, performanceUrl, order } = body

    if (!name || !category) {
      return NextResponse.json(
        { error: "Name and literary category are required" },
        { status: 400 }
      )
    }

    const db = await connectDB()
    const youtubeId = extractYouTubeId(performanceUrl || "")

    const result = await db.collection("creators").insertOne({
      name: name.trim(),
      city: (city || "").trim(),
      category: category.trim(),
      intro: (intro || "").trim(),
      photo: (photo || "").trim(),
      performanceUrl: (performanceUrl || "").trim(),
      youtubeId,
      order: typeof order === "number" ? order : Number.parseInt(order || "0", 10) || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    revalidatePath("/literature-club")

    return NextResponse.json(
      { message: "Creator added", id: result.insertedId.toString() },
      { status: 201 }
    )
  } catch (error) {
    console.error("Failed to create creator:", error)
    return NextResponse.json({ error: "Failed to create creator" }, { status: 500 })
  }
}
