import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"
import { getGoogleDriveDirectLink, convertGoogleDriveContentImages } from "@/lib/gallery-utils"

export const dynamic = 'force-dynamic'

// GET single blog by ID or slug
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug } = await params
        const db = await connectDB()

        // Try to find by ObjectId first, then by slug
        let blog
        if (ObjectId.isValid(slug)) {
            blog = await db.collection("blogs").findOne({ _id: new ObjectId(slug) })
        }
        if (!blog) {
            blog = await db.collection("blogs").findOne({ slug })
        }

        if (!blog) {
            return NextResponse.json({ error: "Blog not found" }, { status: 404 })
        }

        // Increment views
        await db.collection("blogs").updateOne(
            { _id: blog._id },
            { $inc: { views: 1 } }
        )

        return NextResponse.json(blog)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blog" }, { status: 500 })
    }
}

// PUT update blog
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getSession()
        if (!session || !session.isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const { slug } = await params
        const updates = await request.json()
        const db = await connectDB()

        if (updates.image) {
            updates.originalImage = updates.image
            updates.image = getGoogleDriveDirectLink(updates.image)
        }
        if (updates.content) {
            updates.content = convertGoogleDriveContentImages(updates.content)
        }

        // Find by ObjectId or slug
        let query: any = { slug }
        if (ObjectId.isValid(slug)) {
            query = { _id: new ObjectId(slug) }
        }

        await db.collection("blogs").updateOne(
            query,
            { $set: { ...updates, updatedAt: new Date() } }
        )

        revalidatePath('/blog')
        revalidatePath(`/blog/${slug}`)

        return NextResponse.json({ message: "Blog updated" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to update blog" }, { status: 500 })
    }
}

// DELETE blog
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const session = await getSession()
        if (!session || !session.isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const { slug } = await params
        const db = await connectDB()

        let query: any = { slug }
        if (ObjectId.isValid(slug)) {
            query = { _id: new ObjectId(slug) }
        }

        await db.collection("blogs").deleteOne(query)

        revalidatePath('/blog')

        return NextResponse.json({ message: "Blog deleted" })
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 })
    }
}
