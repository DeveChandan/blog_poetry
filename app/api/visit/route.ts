import { NextResponse, type NextRequest } from "next/server"
import { connectDB } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const db = await connectDB()
    
    // Get the user's IP address
    const forwardedFor = request.headers.get("x-forwarded-for")
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown"
    const normalizedIp = (ip === "::1" || ip === "127.0.0.1") ? "localhost" : ip
    
    let isNewVisitor = false
    
    // Track unique IPs to prevent spam clicks/refreshes
    if (normalizedIp !== "unknown") {
       const existingIP = await db.collection("unique_visitors").findOne({ ip: normalizedIp })
       if (!existingIP) {
          isNewVisitor = true
          await db.collection("unique_visitors").insertOne({ ip: normalizedIp, date: new Date() })
       }
    } else {
       // Fallback just in case IP resolution fails entirely
       isNewVisitor = true
    }

    if (isNewVisitor) {
      // Increment only if new unique IP
      await db.collection("stats").updateOne(
         { _id: "site_stats" },
         { $inc: { totalVisits: 1 } },
         { upsert: true }
      )
    }

    const stats = await db.collection("stats").findOne({ _id: "site_stats" })
    return NextResponse.json({ totalVisits: stats?.totalVisits || 1, newVisit: isNewVisitor })
  } catch (error) {
    return NextResponse.json({ error: "Failed to record visit" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const db = await connectDB()
    const stats = await db.collection("stats").findOne({ _id: "site_stats" })
    return NextResponse.json({ totalVisits: stats?.totalVisits || 0 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch visits" }, { status: 500 })
  }
}
