import { type NextRequest, NextResponse } from "next/server"
import { connectDB } from "@/lib/db"
import { getSession } from "@/lib/session"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()

    const db = await connectDB()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (session.isAdmin) {
      const orders = await db.collection("orders").find({}).sort({ createdAt: -1 }).toArray()
      return NextResponse.json(orders)
    } else {
      const orders = await db.collection("orders").find({ userId: session.userId }).sort({ createdAt: -1 }).toArray()
      return NextResponse.json(orders)
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { items, email } = await request.json()
    const db = await connectDB()

    const totalAmount = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)

    const result = await db.collection("orders").insertOne({
      userId: session.userId,
      items,
      totalAmount,
      email,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    // Clear cart
    await db.collection("cart").deleteOne({ userId: session.userId })

    return NextResponse.json({ message: "Order created", orderId: result.insertedId }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
