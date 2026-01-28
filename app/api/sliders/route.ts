import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic'

// GET all sliders
export async function GET() {
    try {
        const db = await connectDB()
        const sliders = await db.collection("sliders")
            .find({ active: true })
            .sort({ order: 1, createdAt: -1 })
            .toArray()
        return NextResponse.json(sliders)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch sliders" }, { status: 500 })
    }
}

// POST new slider (Admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session || !session.isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const { title, subtitle, image, link, buttonText, order } = await request.json()

        if (!image) {
            return NextResponse.json({ error: "Image URL is required" }, { status: 400 })
        }

        const db = await connectDB()

        // Get next order number if not provided
        let sliderOrder = order
        if (sliderOrder === undefined) {
            const lastSlider = await db.collection("sliders").findOne({}, { sort: { order: -1 } })
            sliderOrder = lastSlider ? (lastSlider.order || 0) + 1 : 0
        }

        const result = await db.collection("sliders").insertOne({
            title: title || "",
            subtitle: subtitle || "",
            image,
            link: link || "/",
            buttonText: buttonText || "Learn More",
            order: sliderOrder,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        revalidatePath('/')

        return NextResponse.json({ message: "Slider created", id: result.insertedId }, { status: 201 })
    } catch (error) {
        console.error("Slider creation error:", error)
        return NextResponse.json({ error: "Failed to create slider" }, { status: 500 })
    }
}
