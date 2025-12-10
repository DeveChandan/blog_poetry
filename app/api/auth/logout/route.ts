import { NextResponse } from "next/server"
import { clearSession } from "@/lib/session" // Corrected import

export async function GET() {
  await clearSession() // Corrected function call
  return NextResponse.json({ message: "Logged out successfully" })
}