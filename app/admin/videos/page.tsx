"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminGuard from "@/components/admin-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Video {
  _id: string
  title: string
  description: string
  youtubeId: string
  views: number
}

export default function AdminVideosPage() {
  const router = useRouter()
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await fetch("/api/videos")
        const data = await res.json()
        setVideos(data)
      } catch (error) {
        console.error("Failed to fetch videos:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this video?")) return

    try {
      const res = await fetch(`/api/videos/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setVideos(videos.filter((v) => v._id !== id))
      }
    } catch (error) {
      console.error("Failed to delete video:", error)
      alert("Failed to delete video")
    }
  }

  return (
    <AdminGuard>
      <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-foreground">Manage Videos</h1>
            <Button onClick={() => router.push("/admin/videos/create")}>Add Video</Button>
          </div>

          {loading ? (
            <div className="text-center text-muted-foreground">Loading videos...</div>
          ) : videos.length === 0 ? (
            <div className="text-center text-muted-foreground">No videos yet</div>
          ) : (
            <div className="grid gap-4">
              {videos.map((video) => (
                <Card key={video._id}>
                  <CardHeader>
                    <CardTitle>{video.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-2">{video.description}</p>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => router.push(`/admin/videos/${video._id}/edit`)}>
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => handleDelete(video._id)}>
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </AdminGuard>
  )
}
