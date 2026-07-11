import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"

export const dynamic = 'force-dynamic'

// GET all quotes
export async function GET() {
    try {
        const db = await connectDB()
        const quotes = await db.collection("quotes").find({}).sort({ createdAt: -1 }).toArray()
        return NextResponse.json(quotes)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch quotes" }, { status: 500 })
    }
}

// POST new quote (Admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session || !session.isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const { content, author, tags, backgroundImage, fontSize } = await request.json()

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 })
        }

        const db = await connectDB()
        const result = await db.collection("quotes").insertOne({
            content,
            author: author || "Dr. Rupesh Kumar Singh",
            tags: tags || [],
            backgroundImage: backgroundImage || "",
            fontSize: fontSize ? Number.parseInt(fontSize.toString()) : 24,
            views: 0,
            likes: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        revalidatePath('/quotes')
        revalidatePath('/')

        return NextResponse.json({ message: "Quote created", id: result.insertedId }, { status: 201 })
    } catch (error) {
        console.error("Quote creation error:", error)
        return NextResponse.json({ error: "Failed to create quote" }, { status: 500 })
    }
}
