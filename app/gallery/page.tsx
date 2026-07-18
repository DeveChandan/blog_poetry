"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Image as ImageIcon, 
  ZoomIn, 
  ZoomOut, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  RefreshCcw, 
  Folder,
  Maximize2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/language-context"

interface GalleryItem {
  _id: string
  title: string
  url: string
  originalUrl: string
  group: string
  createdAt: string
}

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedGroup, setSelectedGroup] = useState<string>("All")
  
  // Lightbox States
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [zoomScale, setZoomScale] = useState<number>(1)

  const { t, lang } = useTranslations()

  useEffect(() => {
    async function fetchGallery() {
      try {
        const res = await fetch("/api/gallery")
        if (res.ok) {
          const data = await res.json()
          setItems(data)
        }
      } catch (error) {
        console.error("Failed to fetch gallery:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchGallery()
  }, [])

  // Filter items by group
  const filteredItems = selectedGroup === "All" 
    ? items 
    : items.filter(item => item.group === selectedGroup)

  // Get unique group names
  const groups = ["All", ...Array.from(new Set(items.map(item => item.group)))]

  // Lightbox Actions
  const handlePrev = useCallback(() => {
    if (lightboxIndex === null || filteredItems.length === 0) return
    setLightboxIndex((prev) => (prev === 0 ? filteredItems.length - 1 : (prev ?? 0) - 1))
    setZoomScale(1) // Reset zoom when switching images
  }, [lightboxIndex, filteredItems])

  const handleNext = useCallback(() => {
    if (lightboxIndex === null || filteredItems.length === 0) return
    setLightboxIndex((prev) => (prev === filteredItems.length - 1 ? 0 : (prev ?? 0) + 1))
    setZoomScale(1) // Reset zoom when switching images
  }, [lightboxIndex, filteredItems])

  const handleZoomIn = () => {
    setZoomScale(prev => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoomScale(prev => Math.max(prev - 0.25, 1))
  }

  const handleClose = () => {
    setLightboxIndex(null)
    setZoomScale(1)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === "ArrowLeft") handlePrev()
      if (e.key === "ArrowRight") handleNext()
      if (e.key === "Escape") handleClose()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxIndex, handlePrev, handleNext])

  return (
    <main className="min-h-screen bg-[#fcf9f2] dark:bg-[#120e0a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Title */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-serif font-bold text-[#3c2a1e] dark:text-[#e6dfcd] mb-3"
          >
            {t('gallery') || "Photo Gallery"}
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="h-[1px] w-24 bg-primary mx-auto mb-4"
          />
          <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            A visual journey through events, book launches, and memorable recitals.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
            <RefreshCcw className="w-8 h-8 text-primary animate-spin" />
            <span className="text-muted-foreground text-sm font-medium">Opening visual archives...</span>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-24 border border-dashed border-[#3c2a1e]/20 rounded-2xl bg-card/40 text-muted-foreground max-w-lg mx-auto">
            <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-15" />
            <p className="text-sm font-serif">No memories in the gallery yet. Stay tuned!</p>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Category Tabs */}
            <div className="flex justify-center">
              <div className="flex flex-wrap items-center justify-center gap-2 p-1.5 bg-card/60 dark:bg-[#1f1a14]/65 backdrop-blur-md rounded-2xl border border-[#3c2a1e]/5 dark:border-[#e6dfcd]/5 shadow-sm max-w-full overflow-x-auto">
                {groups.map((group) => (
                  <button
                    key={group}
                    onClick={() => {
                      setSelectedGroup(group)
                      setLightboxIndex(null)
                    }}
                    className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-xl transition-all duration-300 relative whitespace-nowrap ${
                      selectedGroup === group
                        ? "text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                    }`}
                  >
                    {selectedGroup === group && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-primary rounded-xl -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {group === "All" ? t('all') || "All Photos" : group}
                  </button>
                ))}
              </div>
            </div>

            {/* Photos Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pt-4"
            >
              <AnimatePresence mode="popLayout">
                {filteredItems.map((item, idx) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.25 }}
                    key={item._id}
                    className="group relative cursor-pointer overflow-hidden rounded-2xl border border-[#3c2a1e]/10 dark:border-[#e6dfcd]/10 bg-card shadow-sm hover:shadow-lg transition-all duration-300 transform-gpu will-change-transform aspect-[4/3] flex items-center justify-center"
                    onClick={() => setLightboxIndex(idx)}
                    style={{ contentVisibility: 'auto', containIntrinsicSize: '0 300px' }}
                  >
                    {/* Thumbnail Image */}
                    <img
                      src={item.url}
                      alt={item.title || "Gallery photo"}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />

                    {/* Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-primary text-primary-foreground font-semibold self-start mb-1 flex items-center gap-1">
                        <Folder className="w-2.5 h-2.5" /> {item.group}
                      </span>
                      <h3 className="text-white font-serif font-semibold text-sm line-clamp-1">
                        {item.title || "View Full Image"}
                      </h3>
                      <p className="text-white/60 text-[10px] flex items-center gap-1 mt-0.5">
                        <Maximize2 className="w-3 h-3" /> Click to enlarge
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </div>

      {/* Lightbox Modal Slider */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredItems[lightboxIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-md flex flex-col justify-between select-none"
          >
            {/* Header controls */}
            <div className="p-4 flex items-center justify-between z-10 w-full bg-gradient-to-b from-black/50 to-transparent">
              <div className="text-white text-left max-w-[60%]">
                <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">
                  {filteredItems[lightboxIndex].group}
                </span>
                <h2 className="font-serif text-sm sm:text-lg line-clamp-1">
                  {filteredItems[lightboxIndex].title || "Gallery View"}
                </h2>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5 sm:gap-3">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={handleZoomOut}
                  disabled={zoomScale <= 1}
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full bg-white/10 text-white hover:bg-white/20"
                  onClick={handleZoomIn}
                  disabled={zoomScale >= 3}
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                
                {zoomScale > 1 && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-xs h-9 text-white bg-white/10 hover:bg-white/20 px-3 rounded-full"
                    onClick={() => setZoomScale(1)}
                  >
                    Reset Zoom
                  </Button>
                )}

                <span className="text-white/60 text-xs px-2 sm:px-3 py-1 bg-white/10 rounded-full">
                  {lightboxIndex + 1} / {filteredItems.length}
                </span>
                
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-9 w-9 rounded-full bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleClose}
                  title="Close (Esc)"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Image Slider Wrapper */}
            <div className="flex-1 relative flex items-center justify-center p-4 overflow-hidden">
              
              {/* Prev Arrow */}
              <button
                onClick={handlePrev}
                className="absolute left-4 z-20 p-2 sm:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-all focus:outline-none"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 sm:w-8 h-6 sm:h-8" />
              </button>

              {/* Main Image View */}
              <div 
                className="w-full h-full max-h-[80vh] flex items-center justify-center relative transition-transform duration-300"
                style={{ transform: `scale(${zoomScale})` }}
              >
                <img
                  src={filteredItems[lightboxIndex].url}
                  alt={filteredItems[lightboxIndex].title || "Enlarged view"}
                  className="max-w-full max-h-full object-contain select-none"
                  draggable="false"
                />
              </div>

              {/* Next Arrow */}
              <button
                onClick={handleNext}
                className="absolute right-4 z-20 p-2 sm:p-3 rounded-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-all focus:outline-none"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 sm:w-8 h-6 sm:h-8" />
              </button>
            </div>

            {/* Footer space */}
            <div className="p-4 text-center text-white/40 text-[11px] bg-gradient-to-t from-black/50 to-transparent">
              Tip: Use Left/Right Arrow keys to navigate, Esc to exit zoom.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
