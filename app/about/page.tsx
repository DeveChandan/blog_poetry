"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Settings {
  siteName?: string
  siteDescription?: string
  authorBio?: string
  authorImage?: string
  youtubeChannel?: string
}

export default function AboutPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [youtubeVideos, setYoutubeVideos] = useState<
    Array<{
      id: string
      title: string
      thumbnail: string
    }>
  >([])

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch("/api/settings")
        if (res.ok) {
          const data = await res.json()
          setSettings(data)

          // Fetch YouTube videos if channel is set
          if (data.youtubeChannel) {
            fetchYoutubeVideos(data.youtubeChannel)
          }
        }
      } catch (error) {
        console.error("Failed to fetch settings:", error)
      } finally {
        setLoading(false)
      }
    }

    async function fetchYoutubeVideos(channelId: string) {
      // This would require YouTube API integration
      // For now, we'll show placeholder for YouTube integration
      console.log("YouTube channel:", channelId)
    }

    fetchSettings()
  }, [])

  if (loading) return <div className="py-12 text-center">Loading...</div>

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* About Author Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {settings.authorImage ? (
              <img
                src={settings.authorImage || "/placeholder.svg"}
                alt="Author"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <span className="text-muted-foreground">Author Photo</span>
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-foreground mb-4">{settings.siteName || "Author Name"}</h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {settings.authorBio || "Learn more about the author and their literary journey."}
            </p>
          </div>
        </div>

        {/* YouTube Videos Section */}
        {settings.youtubeChannel && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Latest Videos</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="cursor-pointer hover:border-primary transition">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <span className="text-muted-foreground">Video {i}</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-foreground line-clamp-2">Video Title {i}</h3>
                      <p className="text-sm text-muted-foreground mt-2">{settings.youtubeChannel}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <p className="text-muted-foreground mb-4">Subscribe to see more videos</p>
              <a
                href={`https://youtube.com/${settings.youtubeChannel}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block px-6 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition"
              >
                Visit YouTube Channel
              </a>
            </div>
          </div>
        )}

        {/* Books & Poetry Section */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Explore Poems</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Dive into a collection of carefully crafted poems exploring themes of nature, love, and human
                connection.
              </p>
              <a
                href="/poems"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition"
              >
                Read Poems →
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Browse Books</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Discover published works available in both physical and digital formats. Perfect for readers of all
                kinds.
              </p>
              <a
                href="/books"
                className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded hover:opacity-90 transition"
              >
                Shop Books →
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
