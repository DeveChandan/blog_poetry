import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic'

// GET single sher
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const db = await connectDB()

        const sher = await db.collection("sher").findOne({ _id: new ObjectId(id) })

        if (!sher) {
            return NextResponse.json({ error: "Sher not found" }, { status: 404 })
        }

        await db.collection("sher").updateOne(
            { _id: new ObjectId(id) },
            { $inc: { views: 1 } }
        )

        return NextResponse.json(sher)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch sher" }, { status: 500 })
    }
}

// PUT update sher
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

        await db.collection("sher").updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updates, updatedAt: new Date() } }
        )

        revalidatePath('/sher')
        revalidatePath(`/sher/${id}`)

        return NextResponse.json({ message: "Sher updated" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update sher" }, { status: 500 })
    }
}

// DELETE sher
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

        await db.collection("sher").deleteOne({ _id: new ObjectId(id) })

        revalidatePath('/sher')

        return NextResponse.json({ message: "Sher deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete sher" }, { status: 500 })
    }
}
