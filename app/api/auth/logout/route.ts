import { NextResponse } from "next/server"
import { clearSession } from "@/lib/session" // Corrected import

export async function POST() {
  await clearSession()
  return NextResponse.json({ message: "Logged out successfully" })
}