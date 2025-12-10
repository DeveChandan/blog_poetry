import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    return NextResponse.json({
      authenticated: true,
      isAdmin: session.isAdmin || false,
      userId: session.userId,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to verify session" }, { status: 500 })
  }
}
