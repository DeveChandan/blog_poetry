import { MongoClient } from "mongodb"

let client: MongoClient | null = null

export async function connectDB() {
  if (client) {
    return client.db(process.env.MONGODB_DB_NAME || "poem-blog")
  }

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set")
  }

  client = new MongoClient(uri)
  await client.connect()
  return client.db(process.env.MONGODB_DB_NAME || "poem-blog")
}

export async function closeDB() {
  if (client) {
    await client.close()
    client = null
  }
}
