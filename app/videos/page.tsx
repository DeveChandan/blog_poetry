"use client"

import { useEffect, useState } from "react"
import VideoCard from "@/components/video-card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

interface Video {
  _id: string
  title: string
  description: string
  thumbnail: string
  views: number
  youtubeId?: string
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchVideos() {
      try {
        setError(null)
        const res = await fetch("/api/videos")
        
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`)
        }
        
        const data = await res.json()
        
        // Validate data structure
        const validatedVideos = data.map((video: any) => ({
          _id: video._id || video.id || '',
          title: video.title || 'Untitled',
          description: video.description || '',
          thumbnail: video.thumbnail || '',
          views: video.views || 0,
          youtubeId: video.youtubeId || ''
        })).filter((video: Video) => video._id) // Filter out invalid videos
        
        console.log("Fetched videos:", validatedVideos.length)
        
        setVideos(validatedVideos)
        setFilteredVideos(validatedVideos)
      } catch (error) {
        console.error("Failed to fetch videos:", error)
        setError("Failed to load videos. Please try again later.")
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  useEffect(() => {
    const filtered = videos.filter(
      (video) =>
        video.title?.toLowerCase().includes(search.toLowerCase()) ||
        video.description?.toLowerCase().includes(search.toLowerCase()),
    )
    setFilteredVideos(filtered)
  }, [search, videos])

  if (loading) {
    return (
      <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading videos...</p>
            </div>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 text-center">
            <p className="text-destructive mb-2">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="text-sm text-primary hover:underline"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-2">My Videos</h1>
        <p className="text-muted-foreground mb-8">Browse and watch all uploaded videos</p>

        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search videos by title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          {search && (
            <p className="text-sm text-muted-foreground mt-2">
              Found {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground text-6xl mb-4">📹</div>
            <h3 className="text-xl font-medium text-foreground mb-2">No videos found</h3>
            <p className="text-muted-foreground">
              {search ? "Try a different search term" : "No videos have been uploaded yet"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video) => (
              <VideoCard 
                key={video._id}
                id={video._id}
                title={video.title}
                description={video.description}
                thumbnail={video.thumbnail}
                views={video.views}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
