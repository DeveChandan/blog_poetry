import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = await params
    const db = await connectDB()
    const poem = await db.collection("poems").findOne({ _id: new ObjectId(id) })

    if (!poem) {
      return NextResponse.json({ error: "Poem not found" }, { status: 404 })
    }

    // Increment view count
    await db.collection("poems").updateOne({ _id: new ObjectId(id) }, { $inc: { views: 1 } })

    return NextResponse.json(poem)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch poem" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
    }

    const { title, content, excerpt, tags } = await request.json()
    const { id } = await params
    const db = await connectDB()

    await db.collection("poems").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          title,
          content,
          excerpt,
          tags,
          updatedAt: new Date(),
        },
      },
    )

    return NextResponse.json({ message: "Poem updated" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update poem" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getSession()
    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
    }

    const { id } = await params
    const db = await connectDB()
    await db.collection("poems").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Poem deleted" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete poem" }, { status: 500 })
  }
}
