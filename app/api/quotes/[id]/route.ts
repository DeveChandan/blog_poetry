import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic'

// GET single quote
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const db = await connectDB()

        const quote = await db.collection("quotes").findOne({ _id: new ObjectId(id) })

        if (!quote) {
            return NextResponse.json({ error: "Quote not found" }, { status: 404 })
        }

        // Increment views
        await db.collection("quotes").updateOne(
            { _id: new ObjectId(id) },
            { $inc: { views: 1 } }
        )

        return NextResponse.json(quote)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch quote" }, { status: 500 })
    }
}

// PUT update quote
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

        // Remove immutable fields from update payload
        const { _id, createdAt, ...updateFields } = updates

        if (updateFields.fontSize !== undefined) {
            updateFields.fontSize = Number.parseInt(updateFields.fontSize.toString())
        }

        await db.collection("quotes").updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updateFields, updatedAt: new Date() } }
        )

        revalidatePath('/quotes')

        return NextResponse.json({ message: "Quote updated" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update quote" }, { status: 500 })
    }
}

// DELETE quote
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

        await db.collection("quotes").deleteOne({ _id: new ObjectId(id) })

        revalidatePath('/quotes')

        return NextResponse.json({ message: "Quote deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete quote" }, { status: 500 })
    }
}
