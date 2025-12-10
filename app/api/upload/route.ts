import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/session"
import { writeFile } from "fs/promises"
import path from "path"

export async function POST(request: NextRequest) {
  const session = await getSession()

  if (!session || !session.isAdmin) {
    return NextResponse.json({ error: "Unauthorized: Admin access required" }, { status: 403 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const filename = Date.now() + "_" + file.name.replaceAll(" ", "_")
    const uploadDir = path.join(process.cwd(), "public", "uploads", "books")
    const filePath = path.join(uploadDir, filename)

    await writeFile(filePath, buffer)

    // Return the relative path to be stored in the database
    const relativeFilePath = `/uploads/books/${filename}`
    return NextResponse.json({ filePath: relativeFilePath }, { status: 200 })
  } catch (error) {
    console.error("File upload error:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
