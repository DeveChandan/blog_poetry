import { MetadataRoute } from "next"
import { connectDB } from "@/lib/db"

const BASE_URL = "https://rsunkahi.com"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls = [
    { url: `${BASE_URL}/`, lastModified: new Date() },
    { url: `${BASE_URL}/literature-club`, lastModified: new Date() },
    { url: `${BASE_URL}/magazine`, lastModified: new Date() },
    { url: `${BASE_URL}/about`, lastModified: new Date() },
    { url: `${BASE_URL}/poems`, lastModified: new Date() },
    { url: `${BASE_URL}/books`, lastModified: new Date() },
    { url: `${BASE_URL}/blog`, lastModified: new Date() },
    { url: `${BASE_URL}/quotes`, lastModified: new Date() },
    { url: `${BASE_URL}/gallery`, lastModified: new Date() },
    { url: `${BASE_URL}/videos`, lastModified: new Date() },
  ]

  try {
    const db = await connectDB()
    const [poems, books, videos] = await Promise.all([
      db.collection("poems").find({}, { projection: { _id: 1, updatedAt: 1 } }).toArray(),
      db.collection("books").find({}, { projection: { _id: 1, updatedAt: 1 } }).toArray(),
      db.collection("videos").find({}, { projection: { _id: 1, updatedAt: 1 } }).toArray(),
    ])

    const poemUrls = poems.map((poem) => ({
      url: `${BASE_URL}/poems/${poem._id}`,
      lastModified: poem.updatedAt || new Date(),
    }))

    const bookUrls = books.map((book) => ({
      url: `${BASE_URL}/books/${book._id}`,
      lastModified: book.updatedAt || new Date(),
    }))

    const videoUrls = videos.map((video) => ({
      url: `${BASE_URL}/videos/${video._id}`,
      lastModified: video.updatedAt || new Date(),
    }))

    return [...staticUrls, ...poemUrls, ...bookUrls, ...videoUrls]
  } catch {
    return staticUrls
  }
}
