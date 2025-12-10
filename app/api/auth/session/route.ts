import { NextResponse } from "next/server"
import { getSession } from "@/lib/session"

export async function GET() {
  const session = await getSession()
  console.log("API /api/auth/session: Session status:", session) // Log session status
  if (session) {
    return NextResponse.json({ user: session })
  } else {
    return NextResponse.json({ user: null })
  }
}
