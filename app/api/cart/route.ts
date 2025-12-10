import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ items: [] })
    }

    const db = await connectDB()
    const cart = await db.collection("cart").findOne({ userId: session.userId })

    return NextResponse.json(cart?.items || [])
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cart" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { bookId, quantity, price } = await request.json()
    const db = await connectDB()

    const result = await db.collection("cart").updateOne(
      { userId: session.userId },
      {
        $push: {
          items: { bookId, quantity, price },
        },
      },
      { upsert: true },
    )

    return NextResponse.json({ message: "Item added to cart" })
  } catch (error) {
    return NextResponse.json({ error: "Failed to add to cart" }, { status: 500 })
  }
}
