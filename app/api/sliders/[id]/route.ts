import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic'

// GET single slider
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const db = await connectDB()

        const slider = await db.collection("sliders").findOne({ _id: new ObjectId(id) })

        if (!slider) {
            return NextResponse.json({ error: "Slider not found" }, { status: 404 })
        }

        return NextResponse.json(slider)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch slider" }, { status: 500 })
    }
}

// PUT update slider
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

        await db.collection("sliders").updateOne(
            { _id: new ObjectId(id) },
            { $set: { ...updates, updatedAt: new Date() } }
        )

        revalidatePath('/')

        return NextResponse.json({ message: "Slider updated" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update slider" }, { status: 500 })
    }
}

// DELETE slider
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

        await db.collection("sliders").deleteOne({ _id: new ObjectId(id) })

        revalidatePath('/')

        return NextResponse.json({ message: "Slider deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete slider" }, { status: 500 })
    }
}
