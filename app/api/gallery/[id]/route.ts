import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"
import { getGoogleDriveDirectLink } from "@/lib/gallery-utils"

export const dynamic = 'force-dynamic'

// PUT update gallery item (Admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
    }

    const { id } = await params
    const { title, url, group } = await request.json()

    if (!url) {
      return NextResponse.json({ error: "Image URL or upload is required" }, { status: 400 })
    }

    if (!group || !group.trim()) {
      return NextResponse.json({ error: "Group name is required" }, { status: 400 })
    }

    const processedUrl = getGoogleDriveDirectLink(url)
    const db = await connectDB()

    const result = await db.collection("gallery").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title: title || "",
          url: processedUrl,
          originalUrl: url,
          group: group.trim(),
          updatedAt: new Date(),
        },
      }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }

    revalidatePath('/gallery')

    return NextResponse.json({ message: "Gallery item updated" })
  } catch (error) {
    console.error("Gallery item update error:", error)
    return NextResponse.json({ error: "Failed to update gallery item" }, { status: 500 })
  }
}

// DELETE gallery item (Admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
    }

    const { id } = await params
    const db = await connectDB()

    const result = await db.collection("gallery").deleteOne({ _id: new ObjectId(id) })

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Gallery item not found" }, { status: 404 })
    }

    revalidatePath('/gallery')

    return NextResponse.json({ message: "Gallery item deleted" })
  } catch (error) {
    console.error("Gallery item deletion error:", error)
    return NextResponse.json({ error: "Failed to delete gallery item" }, { status: 500 })
  }
}
