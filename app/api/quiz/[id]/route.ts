import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic'

// GET single quiz question
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const db = await connectDB()

        const quiz = await db.collection("quiz").findOne({ _id: new ObjectId(id) })

        if (!quiz) {
            return NextResponse.json({ error: "Quiz question not found" }, { status: 404 })
        }

        return NextResponse.json(quiz)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
    }
}

// PUT update quiz question
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
        const db = await connectDB()

        await db.collection("quiz").updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updates, updatedAt: new Date() } }
        )

        revalidatePath('/quiz')

        return NextResponse.json({ message: "Quiz question updated" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update quiz" }, { status: 500 })
    }
}

// DELETE quiz question
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

        await db.collection("quiz").deleteOne({ _id: new ObjectId(id) })

        revalidatePath('/quiz')

        return NextResponse.json({ message: "Quiz question deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete quiz" }, { status: 500 })
    }
}
