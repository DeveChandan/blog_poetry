import { connectDB } from "./db"

export async function initializeCollections() {
  const db = await connectDB()

  // Create collections with validation schemas
  const collections = ["users", "poems", "books", "reviews", "comments", "reactions", "cart", "orders", "settings"]

  for (const collection of collections) {
    const exists = await db.listCollections({ name: collection }).toArray()
    if (exists.length === 0) {
      await db.createCollection(collection)
    }
  }

  // Create indexes for better performance
  await db.collection("users").createIndex({ email: 1 }, { unique: true })
  await db.collection("poems").createIndex({ title: "text", content: "text" })
  await db.collection("books").createIndex({ title: "text", description: "text" })
  await db.collection("reviews").createIndex({ contentId: 1, contentType: 1 })
  await db.collection("comments").createIndex({ contentId: 1, contentType: 1 })
  await db.collection("reactions").createIndex({ contentId: 1, userId: 1 })
  await db.collection("orders").createIndex({ userId: 1 })
}
