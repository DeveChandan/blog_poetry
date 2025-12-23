import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const db = await connectDB()
    const books = await db.collection("books").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(books)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch books" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()

    if (!session || !session.isAdmin) {
      return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
    }

    const { title, description, isbn, cover, price, type, filePath, stock, tags } = await request.json()

    if (!title || !description || !price) {
      return NextResponse.json({ error: "Title, description, and price required" }, { status: 400 })
    }

    const db = await connectDB()

    const result = await db.collection("books").insertOne({
      title,
      description,
      author: new ObjectId(session.userId as string),
      isbn: isbn || "",
      cover: cover || "",
      price,
      type: type || "ebook",
      filePath: type !== "physical" ? filePath : undefined,
      stock: type !== "ebook" ? stock : undefined,
      tags: tags || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    revalidatePath('/books')
    revalidatePath('/')

    return NextResponse.json({ message: "Book created", id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Book creation error:", error)
    return NextResponse.json({ error: "Failed to create book" }, { status: 500 })
  }
}
