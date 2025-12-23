import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = await connectDB()
    const poems = await db.collection("poems").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(poems)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch poems" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
    }

    const { title, content, excerpt, tags } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content required" }, { status: 400 })
    }

    const db = await connectDB()

    const result = await db.collection("poems").insertOne({
      title,
      content,
      excerpt: excerpt || content.substring(0, 150),
      author: new ObjectId(session.userId as string),
      tags: tags || [],
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      views: 0,
    })

    revalidatePath('/poems')
    revalidatePath('/')

    return NextResponse.json({ message: "Poem created", id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Poem creation error:", error)
    return NextResponse.json({ error: "Failed to create poem" }, { status: 500 })
  }
}
