import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { verifyPassword } from "@/lib/auth"
import { createSession } from "@/lib/session"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 })
    }

    const db = await connectDB()
    const user = await db.collection("users").findOne({ email })

    if (!user || !verifyPassword(password, user.password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const isAdmin = user.isAdmin === true

    await createSession(user._id.toString(), isAdmin)

    return NextResponse.json(
      {
        message: "Login successful",
        isAdmin: isAdmin,
        redirectTo: isAdmin ? "/admin" : "/",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
