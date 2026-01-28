import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic'

// GET all shayari
export async function GET() {
    try {
        const db = await connectDB()
        const shayari = await db.collection("shayari").find({}).sort({ createdAt: -1 }).toArray()
        return NextResponse.json(shayari)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch shayari" }, { status: 500 })
    }
}

// POST new shayari (Admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session || !session.isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const { title, content, author, tags, language } = await request.json()

        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 })
        }

        const db = await connectDB()
        const result = await db.collection("shayari").insertOne({
            title: title || "",
            content,
            author: author || "Unknown",
            tags: tags || [],
            language: language || "Hindi",
            views: 0,
            likes: 0,
            featured: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        revalidatePath('/shayari')
        revalidatePath('/')

        return NextResponse.json({ message: "Shayari created", id: result.insertedId }, { status: 201 })
    } catch (error) {
        console.error("Shayari creation error:", error)
        return NextResponse.json({ error: "Failed to create shayari" }, { status: 500 })
    }
}
