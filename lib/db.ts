import { MongoClient, type Db } from "mongodb"

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>
}

export async function connectDB(): Promise<Db> {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("MONGODB_URI environment variable is not set")
  }

  if (!globalForMongo._mongoClientPromise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    })
    globalForMongo._mongoClientPromise = client.connect().catch((err) => {
      globalForMongo._mongoClientPromise = undefined
      throw err
    })
  }

  const client = await globalForMongo._mongoClientPromise
  return client.db(process.env.MONGODB_DB_NAME || "poem-blog")
}

export async function closeDB() {
  if (globalForMongo._mongoClientPromise) {
    const client = await globalForMongo._mongoClientPromise
    await client.close()
    globalForMongo._mongoClientPromise = undefined
  }
}
