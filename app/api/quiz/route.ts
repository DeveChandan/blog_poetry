import { type NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"
import { ObjectId } from "mongodb"

export const dynamic = 'force-dynamic'

// GET all quiz questions
export async function GET() {
    try {
        const db = await connectDB()
        const quizzes = await db.collection("quiz").find({}).sort({ createdAt: -1 }).toArray()
        return NextResponse.json(quizzes)
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch quiz" }, { status: 500 })
    }
}

// POST new quiz question (Admin only)
export async function POST(request: NextRequest) {
    try {
        const session = await getSession()
        if (!session || !session.isAdmin) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
        }

        const { question, options, correctAnswer, explanation, category, difficulty } = await request.json()

        if (!question || !options || correctAnswer === undefined) {
            return NextResponse.json({ error: "Question, options and correct answer are required" }, { status: 400 })
        }

        const db = await connectDB()
        const result = await db.collection("quiz").insertOne({
            question,
            options, // Array of 4 options
            correctAnswer, // Index of correct option (0-3)
            explanation: explanation || "",
            category: category || "General",
            difficulty: difficulty || "medium",
            views: 0,
            attempts: 0,
            correctAttempts: 0,
            active: true,
            createdAt: new Date(),
            updatedAt: new Date(),
        })

        revalidatePath('/quiz')

        return NextResponse.json({ message: "Quiz question created", id: result.insertedId }, { status: 201 })
    } catch (error) {
        console.error("Quiz creation error:", error)
        return NextResponse.json({ error: "Failed to create quiz question" }, { status: 500 })
    }
}
