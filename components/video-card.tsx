"use client"

import { useState } from "react"
import { Play, Eye, Clock, Tag, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface VideoCardProps {
  id: string
  title: string
  description: string
  thumbnail: string
  views: number
  duration?: number
  category?: string
  layout?: "grid" | "list"
}

export default function VideoCard({ 
  id, 
  title, 
  description, 
  thumbnail, 
  views, 
  duration,
  category,
  layout = "grid"
}: VideoCardProps) {
  const [imgSrc, setImgSrc] = useState(thumbnail)
  const [hasError, setHasError] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const { resolvedTheme } = useTheme()

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

  const formatDuration = (seconds?: number) => {
    if (!seconds) return "N/A"
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Grid Layout
  if (layout === "grid") {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        whileTap={{ scale: 0.98 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative bg-card border rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer"
      >
        {/* Thumbnail Container */}
        <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30">
          {!hasError && imgSrc ? (
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <img
                src={imgSrc}
                alt={`${title} thumbnail`}
                className="w-full h-full object-cover"
                onError={handleImageError}
                loading="lazy"
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <div className="text-center">
                <div className="text-primary/40 text-6xl mb-3">📹</div>
                <p className="text-muted-foreground text-sm">No thumbnail available</p>
              </div>
            </div>
          )}

          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Play Button */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: isHovered ? 1 : 0.8, 
              opacity: isHovered ? 1 : 0 
            }}
            transition={{ type: "spring", stiffness: 200 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center shadow-2xl">
              <Play className="h-7 w-7 text-white ml-1" fill="white" />
            </div>
          </motion.div>

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {category && (
              <Badge variant="secondary" className="px-2 py-1 text-xs backdrop-blur-sm bg-white/80 dark:bg-black/80">
                <Tag className="h-3 w-3 mr-1" />
                {category}
              </Badge>
            )}
            {duration && (
              <Badge variant="secondary" className="px-2 py-1 text-xs backdrop-blur-sm bg-black/80 text-white">
                <Clock className="h-3 w-3 mr-1" />
                {formatDuration(duration)}
              </Badge>
            )}
          </div>

          {/* Views Badge */}
          <Badge variant="secondary" className="absolute top-3 right-3 px-2 py-1 text-xs backdrop-blur-sm bg-black/60 text-white">
            <Eye className="h-3 w-3 mr-1" />
            {views.toLocaleString()}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-5">
          <motion.h3 
            animate={{ color: isHovered ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}
            className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors"
          >
            {title}
          </motion.h3>
          
          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
            {description}
          </p>

          <div className="flex items-center justify-between pt-3 border-t">
            <Button 
              variant="ghost" 
              size="sm"
              className="gap-2 text-primary hover:text-primary/80 hover:bg-primary/10"
              asChild
            >
              <a href={`/videos/${id}`}>
                Watch Now
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Eye className="h-3 w-3 mr-1" />
              {views.toLocaleString()} views
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // List Layout
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ x: 4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group flex gap-5 bg-card border rounded-2xl p-5 hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="relative flex-shrink-0 w-48 rounded-xl overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-muted/50 to-muted/30 relative">
          {!hasError && imgSrc ? (
            <motion.div
              animate={{ scale: isHovered ? 1.05 : 1 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <img
                src={imgSrc}
                alt={`${title} thumbnail`}
                className="w-full h-full object-cover"
                onError={handleImageError}
                loading="lazy"
              />
            </motion.div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5">
              <Play className="h-8 w-8 text-primary/40" />
            </div>
          )}
          
          {/* Play Overlay */}
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 bg-primary/20 flex items-center justify-center"
            >
              <div className="w-12 h-12 bg-primary/90 rounded-full flex items-center justify-center shadow-2xl">
                <Play className="h-5 w-5 text-white ml-0.5" fill="white" />
              </div>
            </motion.div>
          )}
          
          {/* Duration Badge */}
          {duration && (
            <Badge variant="secondary" className="absolute bottom-2 right-2 px-2 py-1 text-xs bg-black/80 text-white">
              {formatDuration(duration)}
            </Badge>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <motion.h3 
              animate={{ color: isHovered ? "hsl(var(--primary))" : "hsl(var(--foreground))" }}
              className="font-bold text-xl line-clamp-2 group-hover:text-primary transition-colors"
            >
              {title}
            </motion.h3>
            
            <Badge variant="secondary" className="ml-2 flex-shrink-0">
              <Eye className="h-3 w-3 mr-1" />
              {views.toLocaleString()}
            </Badge>
          </div>
          
          {category && (
            <Badge variant="outline" className="mb-3">
              <Tag className="h-3 w-3 mr-1" />
              {category}
            </Badge>
          )}
          
          <p className="text-muted-foreground line-clamp-2 mb-4">
            {description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button 
            variant="default" 
            size="sm"
            className="gap-2"
            asChild
          >
            <a href={`/videos/${id}`}>
              <Play className="h-4 w-4" />
              Watch Video
            </a>
          </Button>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            {duration ? formatDuration(duration) : "Duration not specified"}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
