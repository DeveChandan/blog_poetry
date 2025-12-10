"use client"

import { useState } from "react"

interface VideoCardProps {
  id: string
  title: string
  description: string
  thumbnail: string
  views: number
}

export default function VideoCard({ id, title, description, thumbnail, views }: VideoCardProps) {
  const [imgSrc, setImgSrc] = useState(thumbnail)
  const [hasError, setHasError] = useState(false)

  console.log(`VideoCard ${id} - Thumbnail URL:`, thumbnail)

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    console.log(`Image failed to load: ${thumbnail}`)
    setHasError(true)
    
    // Try fallback URLs for YouTube thumbnails
    if (thumbnail.includes('youtube.com') || thumbnail.includes('ytimg.com')) {
      const videoId = thumbnail.match(/vi\/([^\/]+)/)?.[1] || 
                     thumbnail.match(/youtu\.be\/([^\/\?]+)/)?.[1]
      
      if (videoId) {
        const fallbacks = [
          `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,
          `https://img.youtube.com/vi/${videoId}/default.jpg`
        ]
        
        const currentIndex = fallbacks.indexOf(thumbnail)
        if (currentIndex < fallbacks.length - 1) {
          const nextFallback = fallbacks[currentIndex + 1]
          console.log(`Trying fallback: ${nextFallback}`)
          setImgSrc(nextFallback)
          return
        }
      }
    }
    
    // Ultimate fallback
    e.currentTarget.style.display = 'none'
  }

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 bg-white">
      <div className="relative aspect-video bg-gray-100">
        {!hasError && imgSrc ? (
          <img
            src={imgSrc}
            alt={`${title} thumbnail`}
            className="w-full h-full object-cover"
            onError={handleImageError}
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
            <div className="text-center">
              <div className="text-gray-400 text-4xl mb-2">📹</div>
              <p className="text-gray-500 text-sm">No thumbnail</p>
            </div>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
        <div className="flex justify-between items-center text-sm">
          <span className="text-gray-500">{views.toLocaleString()} views</span>
          <a 
            href={`/videos/${id}`} 
            className="text-blue-600 hover:underline font-medium"
          >
            Watch →
          </a>
        </div>
      </div>
    </div>
  )
}
