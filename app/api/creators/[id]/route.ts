import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"
import { extractYouTubeId } from "@/lib/youtube"

export const dynamic = "force-dynamic"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const updates = await request.json()
    const { _id, createdAt, ...updateFields } = updates

    if (updateFields.performanceUrl !== undefined) {
      updateFields.youtubeId = extractYouTubeId(updateFields.performanceUrl || "")
    }
    if (updateFields.order !== undefined) {
      updateFields.order = Number.parseInt(updateFields.order.toString(), 10) || 0
    }

    const db = await connectDB()
    const result = await db.collection("creators").updateOne(
      { _id: new ObjectId(id) },
      { $set: { ...updateFields, updatedAt: new Date() } }
    )

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 })
    }

    revalidatePath("/literature-club")

    return NextResponse.json({ message: "Creator updated" })
  } catch (error) {
    console.error("Failed to update creator:", error)
    return NextResponse.json({ error: "Failed to update creator" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    const { id } = await params
    const db = await connectDB()

    const result = await db.collection("creators").deleteOne({ _id: new ObjectId(id) })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 })
    }

    revalidatePath("/literature-club")

    return NextResponse.json({ message: "Creator deleted" })
  } catch (error) {
    console.error("Failed to delete creator:", error)
    return NextResponse.json({ error: "Failed to delete creator" }, { status: 500 })
  }
}
