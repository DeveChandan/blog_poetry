import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic'

// GET single shayari
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const db = await connectDB()

        const shayari = await db.collection("shayari").findOne({ _id: new ObjectId(id) })

        if (!shayari) {
            return NextResponse.json({ error: "Shayari not found" }, { status: 404 })
        }

        // Increment views
        await db.collection("shayari").updateOne(
            { _id: new ObjectId(id) },
            { $inc: { views: 1 } }
        )

        return NextResponse.json(shayari)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch shayari" }, { status: 500 })
    }
}

// PUT update shayari
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

        await db.collection("shayari").updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updates, updatedAt: new Date() } }
        )

        revalidatePath('/shayari')
        revalidatePath(`/shayari/${id}`)

        return NextResponse.json({ message: "Shayari updated" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update shayari" }, { status: 500 })
    }
}

// DELETE shayari
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

        await db.collection("shayari").deleteOne({ _id: new ObjectId(id) })

        revalidatePath('/shayari')

        return NextResponse.json({ message: "Shayari deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete shayari" }, { status: 500 })
    }
}
