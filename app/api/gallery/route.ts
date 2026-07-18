import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { getGoogleDriveDirectLink } from "@/lib/gallery-utils"

export const dynamic = 'force-dynamic'

// GET all gallery items
export async function GET() {
  try {
    const db = await connectDB()
    const galleryItems = await db
      .collection("gallery")
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(galleryItems)
  } catch (error) {
    console.error("Failed to fetch gallery:", error)
    return NextResponse.json({ error: "Failed to fetch gallery items" }, { status: 500 })
  }
}

// POST new gallery item (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
    }

    const { title, url, group } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "Image URL or upload is required" }, { status: 400 })
    }

    if (!group || !group.trim()) {
      return NextResponse.json({ error: "Group name is required" }, { status: 400 })
    }

    const processedUrl = getGoogleDriveDirectLink(url)
    const db = await connectDB()

    const result = await db.collection("gallery").insertOne({
      title: title || "",
      url: processedUrl,
      originalUrl: url,
      group: group.trim(),
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    revalidatePath('/gallery')
    revalidatePath('/')

    return NextResponse.json({ message: "Gallery item created", id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Gallery creation error:", error)
    return NextResponse.json({ error: "Failed to create gallery item" }, { status: 500 })
  }
}
