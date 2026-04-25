import { Suspense } from "react"
import { connectDB } from "@/lib/db"
import VintageHome from "@/components/vintage-home"

function serialize(data: any) {
  return JSON.parse(JSON.stringify(data))
}

async function getFeaturedPoems() {
  const db = await connectDB()
  let poems = await db.collection("poems").find({ featured: true }).sort({ createdAt: -1 }).limit(6).toArray()
  if (poems.length === 0) {
    poems = await db.collection("poems").find({}).sort({ createdAt: -1 }).limit(6).toArray()
  }
  return serialize(poems)
}

async function getRecentBooks() {
  const db = await connectDB()
  const books = await db.collection("books").find({}).sort({ createdAt: -1 }).limit(2).toArray()
  return serialize(books)
}

async function getRecentBlogs() {
  const db = await connectDB()
  const blogs = await db.collection("blogs").find({}).sort({ createdAt: -1 }).limit(1).toArray()
  return serialize(blogs)
}

async function getStats() {
  const db = await connectDB()
  const totalPoems = await db.collection("poems").countDocuments()
  const booksPublished = await db.collection("books").countDocuments()
  const totalReaders = await db.collection("users").countDocuments()
  const totalVideos = await db.collection("videos").countDocuments()
  const yearsWriting = new Date().getFullYear() - 2016

  return {
    totalPoems,
    booksPublished,
    totalReaders,
    totalVideos,
    yearsWriting,
  }
}

async function getSliders() {
  const db = await connectDB()
  const sliders = await db.collection("sliders").find({ active: true }).sort({ order: 1, createdAt: -1 }).toArray()
  return serialize(sliders)
}

async function getRecentVideo() {
  const db = await connectDB()
  const video = await db.collection("videos").findOne({}, { sort: { createdAt: -1 } })
  if (!video) return null
  return serialize(video)
}

async function getSettings() {
  const db = await connectDB()
  const settings = await db.collection("settings").findOne({})
  if (!settings) return null
  return serialize(settings)
}

export default async function Home() {
  const stats = await getStats()
  const featuredPoems = await getFeaturedPoems()
  const recentBooks = await getRecentBooks()
  const recentBlogs = await getRecentBlogs()
  const sliders = await getSliders()
  const recentVideo = await getRecentVideo()
  const settings = await getSettings()

  return (
    <main className="min-h-screen">
      <Suspense fallback={<div className="vintage-home" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>}>
        <VintageHome
          stats={stats}
          featuredPoems={featuredPoems}
          recentBooks={recentBooks}
          recentBlogs={recentBlogs}
          sliders={sliders}
          recentVideo={recentVideo}
          settings={settings}
        />
      </Suspense>
    </main>
  )
}