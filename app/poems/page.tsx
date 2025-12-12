import { connectDB } from "@/lib/db"
import FilteredPoems from "./filtered-poems"

export const revalidate = 60; // Revalidate at most every 60 seconds

async function getPoems() {
  const db = await connectDB()
  const poems = await db.collection("poems").find({}).sort({ createdAt: -1 }).toArray()
  // Serialize non-plain objects before passing to client component
  return poems.map(poem => ({
    ...poem,
    _id: poem._id.toString(),
    author: poem.author.toString(),
    createdAt: poem.createdAt.toISOString(),
    updatedAt: poem.updatedAt.toISOString(),
  }))
}

export default async function PoemsPage() {
  const poems = await getPoems()

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">My Poems</h1>
        <FilteredPoems poems={poems} />
      </div>
    </main>
  )
}