"use client"

import { useEffect, useState } from "react"
import VideoCard from "@/components/video-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  RefreshCw,
  TrendingUp,
  Clock,
  SortAsc,
  SortDesc
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"

interface Video {
  _id: string
  title: string
  description: string
  thumbnail: string
  views: number
  youtubeId?: string
  createdAt?: string
  duration?: number
  category?: string
}

type SortOption = "newest" | "oldest" | "views" | "title"
type ViewMode = "grid" | "list"

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption>("newest")
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [refreshing, setRefreshing] = useState(false)
  const { theme, resolvedTheme } = useTheme()
  
  // Extract unique categories
  const categories = ["all", ...new Set(videos.map(v => v.category || "Uncategorized").filter(Boolean))]

  useEffect(() => {
    fetchVideos()
  }, [])

  async function fetchVideos() {
    try {
      setRefreshing(true)
      setError(null)
      const res = await fetch("/api/videos")
      
      if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.status}`)
      }
      
      const data = await res.json()
      
      // Validate and transform data
      const validatedVideos = data.map((video: any) => ({
        _id: video._id || video.id || '',
        title: video.title || 'Untitled',
        description: video.description || '',
        thumbnail: video.thumbnail || '',
        views: video.views || 0,
        youtubeId: video.youtubeId || '',
        createdAt: video.createdAt || new Date().toISOString(),
        duration: video.duration || 0,
        category: video.category || "Uncategorized"
      })).filter((video: Video) => video._id)
      
      console.log("Fetched videos:", validatedVideos.length)
      
      setVideos(validatedVideos)
    } catch (error) {
      console.error("Failed to fetch videos:", error)
      setError("Failed to load videos. Please check your connection and try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    let result = [...videos]
    
    // Apply search filter
    if (search) {
      result = result.filter(
        (video) =>
          video.title?.toLowerCase().includes(search.toLowerCase()) ||
          video.description?.toLowerCase().includes(search.toLowerCase()) ||
          video.category?.toLowerCase().includes(search.toLowerCase())
      )
    }
    
    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(video => 
        video.category?.toLowerCase() === categoryFilter.toLowerCase() ||
        (!video.category && categoryFilter === "Uncategorized")
      )
    }
    
    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime())
        break
      case "views":
        result.sort((a, b) => b.views - a.views)
        break
      case "title":
        result.sort((a, b) => a.title.localeCompare(b.title))
        break
    }
    
    setFilteredVideos(result)
  }, [search, videos, sortBy, categoryFilter])

  const handleRetry = () => {
    setLoading(true)
    fetchVideos()
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  if (loading) {
    return (
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh]"
          >
            <div className="relative">
              <div className="w-16 h-16 border-4 border-primary/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground font-medium"
            >
              Loading videos...
            </motion.p>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.4 }}
              className="mt-2 text-sm text-muted-foreground"
            >
              Preparing your viewing experience
            </motion.p>
          </motion.div>
        </div>
      </motion.main>
    )
  }

  if (error) {
    return (
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center"
          >
            <div className="w-24 h-24 bg-destructive/10 rounded-full flex items-center justify-center mb-6">
              <div className="w-12 h-12 bg-destructive/20 rounded-full flex items-center justify-center">
                <div className="w-6 h-6 bg-destructive/30 rounded-full"></div>
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Oops! Something went wrong</h2>
            <p className="text-muted-foreground mb-6 max-w-md">{error}</p>
            <div className="flex gap-3">
              <Button 
                onClick={handleRetry}
                variant="default"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Try Again
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Refresh Page
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.main>
    )
  }

  const totalViews = videos.reduce((sum, video) => sum + video.views, 0)

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-b from-background to-muted/20 dark:from-background dark:to-muted/5 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                My Videos
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Browse and watch all uploaded videos. {videos.length} video{videos.length !== 1 ? 's' : ''} available
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="gap-2 px-3 py-1.5">
                <TrendingUp className="h-4 w-4" />
                <span>{totalViews.toLocaleString()} views</span>
              </Badge>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      onClick={fetchVideos}
                      variant="ghost"
                      size="icon"
                      className={refreshing ? "animate-spin" : ""}
                    >
                      <RefreshCw className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Refresh videos</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Stats Bar */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
          >
            <div className="bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Videos</p>
                  <p className="text-2xl font-bold">{videos.length}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                  <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500/10 rounded-lg">
                  <Filter className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categories</p>
                  <p className="text-2xl font-bold">{categories.length - 1}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Controls Section */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between p-6 bg-card/50 border rounded-2xl shadow-sm backdrop-blur-sm">
            {/* Search */}
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                placeholder="Search videos by title, description, or category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12 py-6 text-base rounded-xl border-2 focus-visible:ring-primary"
              />
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px] rounded-xl">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort */}
              <Select value={sortBy} onValueChange={(value: SortOption) => setSortBy(value)}>
                <SelectTrigger className="w-[180px] rounded-xl">
                  {sortBy === "views" ? (
                    <TrendingUp className="h-4 w-4 mr-2" />
                  ) : sortBy === "title" ? (
                    <SortAsc className="h-4 w-4 mr-2" />
                  ) : (
                    <Clock className="h-4 w-4 mr-2" />
                  )}
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="views">Most Views</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>

              {/* View Toggle */}
              <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("grid")}
                        className="h-9 w-9 rounded-lg"
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Grid view</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="icon"
                        onClick={() => setViewMode("list")}
                        className="h-9 w-9 rounded-lg"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>List view</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>

          {/* Search Results Info */}
          {search && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 flex items-center justify-between"
            >
              <p className="text-muted-foreground">
                Found <span className="font-semibold text-foreground">{filteredVideos.length}</span> video{filteredVideos.length !== 1 ? 's' : ''} for "{search}"
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearch("")}
                className="text-primary hover:text-primary/80"
              >
                Clear search
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Videos Grid/List */}
        <AnimatePresence mode="wait">
          {filteredVideos.length === 0 ? (
            <motion.div 
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-16"
            >
              <div className="inline-flex items-center justify-center w-24 h-24 bg-muted rounded-full mb-6">
                <Search className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No videos found</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                {search 
                  ? `No videos match "${search}". Try different keywords or clear the search.`
                  : "No videos have been uploaded yet. Check back later!"}
              </p>
              {search && (
                <Button 
                  variant="outline"
                  onClick={() => setSearch("")}
                  className="gap-2"
                >
                  <Search className="h-4 w-4" />
                  Clear search and show all
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div 
              key="videos"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className={viewMode === "grid" 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }
            >
              {filteredVideos.map((video, index) => (
                <motion.div
                  key={video._id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.05 }}
                  layout
                >
                  <VideoCard 
                    id={video._id}
                    title={video.title}
                    description={video.description}
                    thumbnail={video.thumbnail}
                    views={video.views}
                    duration={video.duration}
                    category={video.category}
                    layout={viewMode}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading animation for refresh */}
        {refreshing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed bottom-6 right-6 bg-card border rounded-full shadow-lg p-3"
          >
            <RefreshCw className="h-5 w-5 animate-spin text-primary" />
          </motion.div>
        )}
      </div>
    </motion.main>
  )
}
