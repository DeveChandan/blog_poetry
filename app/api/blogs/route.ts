import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic'

// GET all blogs
export async function GET() {
    try {
        const db = await connectDB()
        const blogs = await db.collection("blogs").find({}).sort({ createdAt: -1 }).toArray()
        return NextResponse.json(blogs)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 })
    }
}

// POST new blog (Admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session || !session.isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const { title, content, excerpt, image, tags, category } = await request.json()

        if (!title || !content) {
            return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
        }

        // Generate slug from title
        const slug = title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim()

        const db = await connectDB()

        // Check if slug exists
        const existingBlog = await db.collection("blogs").findOne({ slug })
        const finalSlug = existingBlog ? `${slug}-${Date.now()}` : slug

        const result = await db.collection("blogs").insertOne({
            title,
            slug: finalSlug,
            content,
            excerpt: excerpt || content.substring(0, 200),
            image: image || "",
            tags: tags || [],
            category: category || "General",
            views: 0,
            likes: 0,
            featured: false,
            published: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        revalidatePath('/blog')
        revalidatePath('/')

        return NextResponse.json({ message: "Blog created", id: result.insertedId, slug: finalSlug }, { status: 201 })
    } catch (error) {
        console.error("Blog creation error:", error)
        return NextResponse.json({ error: "Failed to create blog" }, { status: 500 })
    }
}
