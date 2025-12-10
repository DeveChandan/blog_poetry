import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
    }

    const { id } = await params
    const db = await connectDB()
    await db.collection("comments").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Comment deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete comment" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { reply } = await request.json()
    const db = await connectDB()

    await db.collection("comments").updateOne(
      { _id: new ObjectId(id) },
      {
        $push: {
          replies: {
            _id: new ObjectId().toString(),
            userId: session.userId,
            userName: "User",
            comment: reply,
            createdAt: new Date(),
          },
        },
      },
    )

    return NextResponse.json({ message: "Reply added" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add reply" }, { status: 500 })
  }
}
