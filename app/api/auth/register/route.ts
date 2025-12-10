import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { hashPassword } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = await connectDB()
    const existingUser = await db.collection("users").findOne({ email })

    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 })
    }

    const hashedPassword = hashPassword(password)
    const result = await db.collection("users").insertOne({
      email,
      password: hashedPassword,
      name,
      isAdmin: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await createSession(result.insertedId.toString(), false)

    return NextResponse.json({ message: "User created successfully", userId: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
