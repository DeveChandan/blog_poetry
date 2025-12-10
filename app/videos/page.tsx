"use client"

import { useEffect, useState } from "react"
import VideoCard from "@/components/video-card"
import { Input } from "@/components/ui/input"

interface Video {
  _id: string
  title: string
  description: string
  thumbnail: string
  views: number
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchVideos() {
      try {
        const res = await fetch("/api/videos")
        const data = await res.json()
        setVideos(data)
        setFilteredVideos(data)
      } catch (error) {
        console.error("Failed to fetch videos:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  useEffect(() => {
    const filtered = videos.filter(
      (video) =>
        video.title.toLowerCase().includes(search.toLowerCase()) ||
        video.description.toLowerCase().includes(search.toLowerCase()),
    )
    setFilteredVideos(filtered)
  }, [search, videos])

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">My Videos</h1>

        <div className="mb-8">
          <Input
            placeholder="Search videos by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading videos...</div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center text-muted-foreground">No videos found</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard key={video._id} id={video._id} {...video} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
