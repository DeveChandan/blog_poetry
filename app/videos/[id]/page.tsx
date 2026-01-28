"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/lib/language-context"

interface Video {
  _id: string
  title: string
  description: string
  youtubeId: string
  views: number
  createdAt: string
}

export default function VideoDetailPage() {
  const params = useParams()
  const [video, setVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)

  // Translation states
  const { currentLanguage } = useLanguage()
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null)
  const [translatedDescription, setTranslatedDescription] = useState<string | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    async function fetchVideo() {
      try {
        const res = await fetch(`/api/videos/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setVideo(data)
        }
      } catch (error) {
        console.error("Failed to fetch video:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchVideo()
  }, [params.id])

  // Auto-translate when navbar language changes
  useEffect(() => {
    if (!video) return

    const translateVideo = async () => {
      if (currentLanguage.code === 'en') {
        setTranslatedTitle(null)
        setTranslatedDescription(null)
        return
      }

      setIsTranslating(true)
      try {
        const [titleRes, descRes] = await Promise.all([
          fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: video.title, targetLang: currentLanguage.code })
          }),
          fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: video.description, targetLang: currentLanguage.code })
          })
        ])

        const [titleData, descData] = await Promise.all([titleRes.json(), descRes.json()])

        if (titleData.translatedText) setTranslatedTitle(titleData.translatedText)
        if (descData.translatedText) setTranslatedDescription(descData.translatedText)
      } catch (error) {
        console.error('Translation error:', error)
      } finally {
        setIsTranslating(false)
      }
    }

    translateVideo()
  }, [currentLanguage.code, video?._id])

  if (loading) return <main className="min-h-screen bg-background py-12 text-center">Loading...</main>

  if (!video)
    return <main className="min-h-screen bg-background py-12 text-center text-muted-foreground">Video not found</main>

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Video Player */}
        <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-8">
          <iframe
            width="100%"
            height="100%"
            src={`https://www.youtube.com/embed/${video.youtubeId}`}
            title={video.title}
            allowFullScreen
            className="w-full h-full"
          />
        </div>

        {/* Video Info */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle
              className={`text-3xl ${isTranslating ? 'opacity-70' : ''}`}
              dir={currentLanguage.rtl ? 'rtl' : 'ltr'}
            >
              {translatedTitle || video.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
                <p className="text-sm text-muted-foreground mb-2">Description</p>
                <p className={`text-foreground leading-relaxed ${isTranslating ? 'opacity-70' : ''}`}>
                  {translatedDescription || video.description}
                </p>
              </div>
              <div className="flex gap-8 pt-4 border-t border-border">
                <div>
                  <p className="text-sm text-muted-foreground">Views</p>
                  <p className="text-lg font-semibold text-foreground">{video.views.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Published</p>
                  <p className="text-lg font-semibold text-foreground">
                    {new Date(video.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
