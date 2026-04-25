import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const db = await connectDB()
    const contacts = await db.collection("contacts").find({}).sort({ createdAt: -1 }).toArray()
    
    return NextResponse.json(contacts, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, message } = await request.json()

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      )
    }

    const db = await connectDB()

    const result = await db.collection("contacts").insertOne({
      name,
      email,
      message,
      createdAt: new Date(),
    })

    return NextResponse.json(
      { message: "Message sent successfully", id: result.insertedId },
      { status: 201 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    )
  }
}
