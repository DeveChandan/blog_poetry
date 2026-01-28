import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic'

// GET all sher (couplets)
export async function GET() {
    try {
        const db = await connectDB()
        const sher = await db.collection("sher").find({}).sort({ createdAt: -1 }).toArray()
        return NextResponse.json(sher)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch sher" }, { status: 500 })
    }
}

// POST new sher (Admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session || !session.isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const { line1, line2, poet, tags, language } = await request.json()

        if (!line1 || !line2) {
            return NextResponse.json({ error: "Both lines are required" }, { status: 400 })
        }

        const db = await connectDB()
        const result = await db.collection("sher").insertOne({
            line1,
            line2,
            poet: poet || "Unknown",
            tags: tags || [],
            language: language || "Hindi",
            views: 0,
            likes: 0,
            featured: false,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        revalidatePath('/sher')
        revalidatePath('/')

        return NextResponse.json({ message: "Sher created", id: result.insertedId }, { status: 201 })
    } catch (error) {
        console.error("Sher creation error:", error)
        return NextResponse.json({ error: "Failed to create sher" }, { status: 500 })
    }
}
