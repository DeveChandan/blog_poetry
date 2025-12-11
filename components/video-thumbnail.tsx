// components/video-thumbnail.tsx
"use client"

import { useState } from "react"
import { Play } from "lucide-react"

interface VideoThumbnailProps {
  videoId: string
  title: string
}

export default function VideoThumbnail({ videoId, title }: VideoThumbnailProps) {
  const [currentThumbnail, setCurrentThumbnail] = useState<string>(getThumbnailUrl(videoId, 'maxresdefault'))
  const [hasError, setHasError] = useState(false)

  // All YouTube thumbnail quality options
  const thumbnailQualities = [
    'maxresdefault',
    'sddefault',
    'hqdefault',
    'mqdefault',
    'default'
  ]

  function getThumbnailUrl(id: string, quality: string) {
    return `https://img.youtube.com/vi/${id}/${quality}.jpg`
  }

  function handleImageError() {
    const currentUrl = currentThumbnail
    const currentQuality = thumbnailQualities.find(q => currentUrl.includes(q))
    
    if (currentQuality) {
      const currentIndex = thumbnailQualities.indexOf(currentQuality)
      if (currentIndex < thumbnailQualities.length - 1) {
        // Try next quality
        const nextQuality = thumbnailQualities[currentIndex + 1]
        setCurrentThumbnail(getThumbnailUrl(videoId, nextQuality))
      } else {
        // All YouTube options failed, try i.ytimg.com
        setCurrentThumbnail(`https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`)
        setHasError(true)
      }
    }
  }

  return (
    <div className="relative pb-[56.25%] overflow-hidden">
      <img
        src={currentThumbnail}
        alt={title}
        className="absolute top-0 left-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        onError={handleImageError}
      />
      {hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-2">📹</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Video Preview</p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 scale-90 group-hover:scale-100">
        <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center shadow-2xl">
          <Play className="h-7 w-7 text-white ml-1" fill="white" />
        </div>
      </div>
    </div>
  )
}
