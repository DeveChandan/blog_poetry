"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import CommentsSection from "@/components/comments-section"
import ReactionsBar from "@/components/reactions-bar"
import ReviewsSection from "@/components/reviews-section"
import {
  ShoppingCart,
  BookOpen,
  Eye,
  Star,
  BookText,
  Download,
  User,
  Calendar,
  Globe,
  Shield,
  Truck,
  RotateCcw,
  X,
  Lock,
  File,
  Info,
  FileText,
  Award,
  Loader2,
  Heart,
  Share2,
  Bookmark,
  ChevronRight,
  Clock,
  CheckCircle,
  Sparkles,
  Zap,
  Tag,
  Users,
  BarChart,
  BookmarkCheck,
  TrendingUp,
  Menu,
  ChevronLeft,
  Maximize2,
  Minimize2
} from "lucide-react"
import { toast } from "sonner"
import { useLanguage } from "@/lib/language-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Dynamically import DocumentViewer
const DocumentViewer = dynamic(() => import("@/components/document-viewer"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] md:h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl md:rounded-2xl">
      <BookOpen className="w-8 h-8 md:w-12 md:h-12 text-primary/60 animate-pulse" />
    </div>
  ),
})

// Dynamically import PdfViewer
const PdfViewer = dynamic(() => import('@/components/pdf-viewer'), {
  ssr: false,
  loading: () => <PdfViewerLoading />,
})

// PDF Viewer loading component
const PdfViewerLoading = () => (
  <div className="h-[400px] md:h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700 rounded-xl md:rounded-2xl">
    <div className="text-center space-y-4 md:space-y-6 px-4">
      <div className="relative mx-auto w-12 h-12 md:w-20 md:h-20">
        <BookOpen className="relative w-12 h-12 md:w-20 md:h-20 text-primary animate-pulse" />
      </div>
      <div className="space-y-2">
        <p className="text-base md:text-lg font-semibold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Loading Viewer
        </p>
        <p className="text-xs md:text-sm text-muted-foreground">Preparing your reading experience...</p>
      </div>
    </div>
  </div>
)

interface Book {
  _id: string
  title: string
  description: string
  price: number
  type: string
  cover: string
  isbn: string
  filePath?: string
  stock?: number
  author?: string
  pages?: number
  rating?: number
  publishedDate?: string
  language?: string
  genre?: string[]
  publisher?: string
  format?: string
  dimensions?: string
  weight?: string
  bestseller?: boolean
  featured?: boolean
  readingTime?: number
  totalReviews?: number
  downloadCount?: number
  viewCount?: number
  ziffybeesLink?: string
  amazonLink?: string
  flipkartLink?: string
}

const PDF_PREVIEW_LIMIT = 30

// Custom hook for media queries
const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    const listener = () => setMatches(media.matches)
    window.addEventListener('resize', listener)
    return () => window.removeEventListener('resize', listener)
  }, [matches, query])

  return matches
}

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [showFullCover, setShowFullCover] = useState(false)
  const [fileType, setFileType] = useState<string>("")
  const [viewerMode, setViewerMode] = useState<"pdf" | "document">("pdf")
  const [hasPurchased, setHasPurchased] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [activeTab, setActiveTab] = useState("overview")
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [viewCount, setViewCount] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const isMobile = useMediaQuery("(max-width: 768px)")
  const isTablet = useMediaQuery("(max-width: 1024px)")

  // Translation states for app-wide language
  const { currentLanguage } = useLanguage()
  const [translatedTitle, setTranslatedTitle] = useState<string | null>(null)
  const [translatedDescription, setTranslatedDescription] = useState<string | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    async function fetchBook() {
      try {
        setLoading(true)

        const res = await fetch(`/api/books/${id}`)
        if (!res.ok) throw new Error("Failed to fetch book")

        const data = await res.json()
        setBook(data)

        // Update view count
        try {
          await fetch(`/api/books/${id}/view`, {
            method: 'POST'
          })
        } catch (e) {
          console.error('Failed to update view count:', e)
        }

        if (data.filePath) {
          const extension = data.filePath.substring(data.filePath.lastIndexOf('.')).toLowerCase()
          setFileType(extension)
          setViewerMode(extension === '.pdf' ? "pdf" : "document")
        }

        // Default purchase status is true for direct reading
        setHasPurchased(true)

        // Check bookmark status
        const bookmarkStatus = localStorage.getItem(`bookmark_${id}`)
        setIsBookmarked(!!bookmarkStatus)

        // Check like status
        const likeStatus = localStorage.getItem(`like_${id}`)
        setIsLiked(!!likeStatus)

        setViewCount(data.viewCount || 0)

      } catch (error) {
        console.error("Failed to fetch book:", error)
        toast.error("Could not load book details")
        setTimeout(() => router.push("/books"), 3000)
      } finally {
        setLoading(false)
      }
    }

    fetchBook()
  }, [id, router, mounted])

  // Auto-translate when navbar language changes
  useEffect(() => {
    if (!book) return

    const translateBook = async () => {
      if (currentLanguage.code === 'en') {
        if (/[\u0900-\u097F]/.test(book.title) || /[\u0900-\u097F]/.test(book.description)) {
          setIsTranslating(true)
          try {
            const [titleRes, descRes] = await Promise.all([
              fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: book.title, targetLang: 'en' })
              }),
              fetch('/api/translate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: book.description, targetLang: 'en' })
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
        } else {
          setTranslatedTitle(null)
          setTranslatedDescription(null)
        }
        return
      }

      setIsTranslating(true)
      try {
        const [titleRes, descRes] = await Promise.all([
          fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: book.title, targetLang: currentLanguage.code })
          }),
          fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: book.description, targetLang: currentLanguage.code })
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

    translateBook()
  }, [currentLanguage.code, book?._id])

  const handleAddToCart = async () => {
    if (!book) return
    if (book.stock !== undefined && book.stock <= 0) {
      toast.error("This book is currently out of stock")
      return
    }

    setIsAddingToCart(true)
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: id,
          quantity: 1,
          price: book.price,
          title: book.title,
          cover: book.cover
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("Added to cart!", {
          action: {
            label: "View Cart",
            onClick: () => router.push("/cart")
          },
          description: `${book.title} has been added to your cart`,
          duration: isMobile ? 3000 : 5000,
        })

        // Update cart count in local storage for cart badge
        const cartCount = localStorage.getItem('cart_count') || '0'
        localStorage.setItem('cart_count', (parseInt(cartCount) + 1).toString())

        // Dispatch custom event for cart update
        window.dispatchEvent(new Event('cart-updated'))

      } else {
        toast.error(data.message || "Please login to add items to cart")
        if (data.redirect) {
          router.push('/login')
        }
      }
    } catch (error) {
      console.error("Failed to add to cart:", error)
      toast.error("Failed to add item to cart. Please try again.")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handlePurchase = async () => {
    if (!book) return
    if (book.stock !== undefined && book.stock <= 0) {
      toast.error("This book is currently out of stock")
      return
    }

    setIsPurchasing(true)
    try {
      const res = await fetch("/api/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: id,
          price: book.price,
          title: book.title,
          author: book.author
        }),
      })

      const data = await res.json()

      if (res.ok) {
        localStorage.setItem(`purchased_${id}`, "true")
        // Add to purchase history
        const purchases = JSON.parse(localStorage.getItem('purchases') || '[]')
        purchases.push({
          id,
          title: book.title,
          date: new Date().toISOString(),
          price: book.price
        })
        localStorage.setItem('purchases', JSON.stringify(purchases))

        setHasPurchased(true)
        setShowPurchaseModal(false)

        toast.success("Purchase successful!", {
          description: "You now have full access to this book",
          action: !isMobile ? {
            label: "Start Reading",
            onClick: () => document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth' })
          } : undefined,
          duration: 5000,
        })

        // Update download count
        try {
          await fetch(`/api/books/${id}/download`, { method: 'POST' })
        } catch (e) {
          console.error('Failed to update download count:', e)
        }

      } else {
        toast.error(data.message || "Purchase failed. Please try again.")
        if (data.redirect) {
          router.push('/login')
        }
      }
    } catch (error) {
      console.error("Purchase failed:", error)
      toast.error("An error occurred during purchase.")
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleDownload = async () => {
    if (!book?.filePath) return
    if (!hasPurchased) {
      setShowPurchaseModal(true)
      return
    }

    try {
      const response = await fetch(`/api/download?url=${encodeURIComponent(book.filePath)}&filename=${encodeURIComponent(book.title + fileType)}`)
      if (!response.ok) throw new Error("Download failed")

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = book.title + fileType
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(downloadUrl)

      // Update download count
      try {
        await fetch(`/api/books/${id}/download`, { method: 'POST' })
      } catch (e) {
        console.error('Failed to update download count:', e)
      }

      toast.success("Download started!")
    } catch (error) {
      console.error("Download failed:", error)
      toast.error("Failed to download file.")
    }
  }

  const handleReadPreview = () => {
    const previewSection = document.getElementById('preview-section')
    if (previewSection) {
      previewSection.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })

      // Add visual feedback
      previewSection.classList.add('ring-2', 'ring-primary', 'ring-offset-2')
      setTimeout(() => {
        previewSection.classList.remove('ring-2', 'ring-primary', 'ring-offset-2')
      }, 2000)
    }
  }

  const toggleBookmark = async () => {
    try {
      if (isBookmarked) {
        localStorage.removeItem(`bookmark_${id}`)
        setIsBookmarked(false)
        toast("Bookmark removed")

        // API call to remove bookmark
        await fetch(`/api/books/${id}/bookmark`, {
          method: 'DELETE'
        })
      } else {
        localStorage.setItem(`bookmark_${id}`, "true")
        setIsBookmarked(true)
        toast("Bookmarked!", {
          description: "Added to your collection",
          icon: <BookmarkCheck className="h-4 w-4" />,
        })

        // API call to add bookmark
        await fetch(`/api/books/${id}/bookmark`, {
          method: 'POST'
        })
      }
    } catch (error) {
      console.error('Failed to update bookmark:', error)
    }
  }

  const toggleLike = async () => {
    try {
      if (isLiked) {
        localStorage.removeItem(`like_${id}`)
        setIsLiked(false)
        toast("Removed from likes")

        await fetch(`/api/books/${id}/like`, {
          method: 'DELETE'
        })
      } else {
        localStorage.setItem(`like_${id}`, "true")
        setIsLiked(true)
        toast("Added to likes")

        await fetch(`/api/books/${id}/like`, {
          method: 'POST'
        })
      }
    } catch (error) {
      console.error('Failed to update like:', error)
    }
  }

  const shareBook = () => {
    const shareData = {
      title: book?.title,
      text: `Check out "${book?.title}" by ${book?.author} on our platform!`,
      url: window.location.href,
    }

    if (navigator.share && isMobile) {
      navigator.share(shareData)
        .then(() => console.log('Shared successfully'))
        .catch((error) => console.log('Error sharing:', error))
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast("Link copied to clipboard!")
    }
  }

  const getDocumentTypeName = () => {
    if (!fileType) return "Document"
    if (fileType === '.pdf') return "PDF Document"
    if (['.doc', '.docx'].includes(fileType)) return "Word Document"
    if (['.epub', '.mobi'].includes(fileType)) return "E-book"
    return "Document"
  }

  const getReadingTime = () => {
    if (book?.readingTime) return book.readingTime
    if (book?.pages) return Math.ceil(book.pages / 2.5) // Average reading speed
    return 60 // Default
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
      setIsFullscreen(true)
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
        setIsFullscreen(false)
      }
    }
  }

  // Mobile bottom navigation
  const MobileBottomNav = () => (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden animate-in slide-in-from-bottom duration-300">
      <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t shadow-2xl">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1">
              <div className="text-sm font-semibold truncate">{book?.title}</div>
              <div className="text-xs text-muted-foreground">Free to Read</div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-10 px-3"
                onClick={toggleBookmark}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-primary' : ''}`} />
              </Button>
              {book?.filePath && (
                <Button
                  size="sm"
                  className="h-10 px-4 bg-gradient-to-r from-primary to-secondary"
                  onClick={handleReadPreview}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Read
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <BookOpen className="w-16 h-16 md:w-24 md:h-24 mx-auto text-primary/60 animate-pulse" />
        <p className="text-muted-foreground">Loading book details...</p>
      </div>
    </div>
  )

  if (!book) return (
    <div className="min-h-screen flex items-center justify-center text-center p-4">
      <div className="space-y-6 max-w-md">
        <BookOpen className="w-16 h-16 md:w-24 md:h-24 mx-auto text-muted-foreground/50" />
        <div>
          <h2 className="text-2xl md:text-3xl font-bold">Book Not Found</h2>
          <p className="text-muted-foreground mt-2">The book you're looking for doesn't exist or has been removed.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            onClick={() => router.push("/books")}
            className="group"
          >
            Browse Library
            <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
          <Button
            variant="outline"
            onClick={() => router.back()}
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-gray-50/50 to-white dark:from-gray-950 dark:via-gray-900/50 dark:to-gray-950">
      <AnimatePresence mode="wait">
        {/* Mobile Bottom Navigation */}
        {mounted && isMobile && <MobileBottomNav />}

        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pb-20 md:pb-12 px-4 container mx-auto max-w-7xl pt-6"
        >
          <div className="mb-6">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/books")}
              className="-ml-2 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Books
            </Button>
          </div>
          {/* Main Content Grid - Responsive */}
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-12 md:mb-16">
            {/* Cover Section - Mobile optimized */}
            <div className="lg:col-span-1 space-y-6">
              <div className="lg:sticky lg:top-24 space-y-6">
                {/* Cover Image */}
                <div
                  className="relative group cursor-pointer rounded-2xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl"
                  onClick={() => setShowFullCover(true)}
                >
                  <div className="aspect-[3/4] relative overflow-hidden bg-muted flex items-center justify-center p-4">
                    <img
                      src={book.cover || '/placeholder.jpg'}
                      alt={book.title}
                      className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-105"
                      loading="eager"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-3 md:p-4">
                        <Eye className="w-5 h-5 md:w-8 md:h-8 text-white" />
                      </div>
                    </div>
                    {book.bestseller && (
                      <div className="absolute top-3 left-3 md:top-4 md:left-4">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 shadow-lg text-xs md:text-sm">
                          <TrendingUp className="w-3 h-3 mr-1" /> Bestseller
                        </Badge>
                      </div>
                    )}
                    {book.stock !== undefined && book.stock < 10 && book.stock > 0 && (
                      <div className="absolute top-3 right-3 md:top-4 md:right-4">
                        <Badge className="bg-red-500 text-white border-0 shadow-lg text-xs">
                          Only {book.stock} left
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Stats - Mobile optimized */}
                <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 border-0 shadow-lg">
                  <CardContent className="p-4 md:p-6">
                    <div className="grid grid-cols-4 gap-2 md:gap-4">
                      <TooltipProvider>
                        {[
                          { icon: <Star className="h-3 w-3 md:h-4 md:w-4" />, label: "Rating", value: book.rating?.toFixed(1) || "N/A" },
                          { icon: <BookText className="h-3 w-3 md:h-4 md:w-4" />, label: "Pages", value: book.pages || "N/A" },
                          { icon: <Clock className="h-3 w-3 md:h-4 md:w-4" />, label: "Time", value: `${getReadingTime()}m` },
                          { icon: <Users className="h-3 w-3 md:h-4 md:w-4" />, label: "Readers", value: viewCount > 1000 ? `${(viewCount / 1000).toFixed(1)}k` : viewCount },
                        ].map((stat, index) => (
                          <Tooltip key={index}>
                            <TooltipTrigger asChild>
                              <div className="flex flex-col items-center p-2 md:p-3 rounded-xl bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 border">
                                <div className="text-muted-foreground mb-1">{stat.icon}</div>
                                <div className="text-lg md:text-2xl font-bold">{stat.value}</div>
                                <div className="text-xs text-muted-foreground mt-1 hidden md:block">{stat.label}</div>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{stat.label}: {stat.value}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions - Hidden on mobile (moved to bottom nav) */}
                {!isMobile && (
                  <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
                    <CardContent className="p-6">
                      <div className="flex gap-3 justify-center">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className={`rounded-full ${isLiked ? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800' : ''}`}
                                onClick={toggleLike}
                              >
                                <Heart className={`h-5 w-5 ${isLiked ? 'fill-red-500' : ''}`} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{isLiked ? "Remove from likes" : "Add to likes"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className={`rounded-full ${isBookmarked ? 'bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-900/20 dark:border-blue-800' : ''}`}
                                onClick={toggleBookmark}
                              >
                                <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-blue-500' : ''}`} />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{isBookmarked ? "Remove bookmark" : "Add bookmark"}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                size="icon"
                                variant="outline"
                                className="rounded-full"
                                onClick={shareBook}
                              >
                                <Share2 className="h-5 w-5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Share book</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        {hasPurchased && book.filePath && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="rounded-full"
                                  onClick={handleDownload}
                                >
                                  <Download className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Download book</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            {/* Details Section - Mobile optimized */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Title & Author */}
              <div className="space-y-4">
                <div dir={currentLanguage.rtl ? 'rtl' : 'ltr'}>
                  <h1 className={`text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight ${isTranslating ? 'opacity-70' : ''}`}>
                    {translatedTitle || book.title}
                  </h1>
                </div>

                {/* Price - Mobile optimized */}
                <div className="flex items-center justify-between md:justify-start md:gap-8">
                  <Badge className="text-sm font-bold bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full">
                    <BookOpen className="h-4 w-4 mr-2" /> Free Reading Access
                  </Badge>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {book.genre?.slice(0, isMobile ? 3 : 5).map((g, i) => (
                    <Badge
                      key={g}
                      variant="secondary"
                      className="rounded-full px-3 py-1 text-xs md:text-sm"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {g}
                    </Badge>
                  ))}
                  {book.genre && book.genre.length > (isMobile ? 3 : 5) && (
                    <Badge variant="outline" className="rounded-full">
                      +{book.genre.length - (isMobile ? 3 : 5)} more
                    </Badge>
                  )}
                </div>

                {/* Stats - Mobile optimized */}
                <div className="grid grid-cols-2 md:flex md:flex-wrap items-center gap-3 md:gap-6 pt-2">
                  {[
                    { icon: <Star className="w-4 h-4 md:w-5 md:h-5" />, text: book.rating ? `${book.rating.toFixed(1)}/5.0` : "No ratings" },
                    { icon: <BookText className="w-4 h-4 md:w-5 md:h-5" />, text: book.pages ? `${book.pages} pages` : "N/A" },
                    { icon: <Globe className="w-4 h-4 md:w-5 md:h-5" />, text: book.language || "English" },
                    { icon: <Calendar className="w-4 h-4 md:w-5 md:h-5" />, text: book.publishedDate ? new Date(book.publishedDate).getFullYear() : "N/A" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border"
                    >
                      <div className="text-primary">{item.icon}</div>
                      <span className="font-medium text-sm md:text-base">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-gray-900/50 p-4 md:p-6 rounded-xl md:rounded-2xl border shadow-lg">
                <h3 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
                  About This Book
                </h3>
                <p className="text-sm md:text-lg leading-relaxed">{translatedDescription || book.description}</p>
              </div>

              {/* Tabs - Mobile optimized */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-4 mb-4 md:mb-8 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 p-1 rounded-xl md:rounded-2xl">
                  {[
                    { id: "overview", label: "Overview", icon: <Info className="w-3 h-3 md:w-4 md:h-4" /> },
                    { id: "details", label: "Details", icon: <FileText className="w-3 h-3 md:w-4 md:h-4" /> },
                    { id: "preview", label: "Preview", icon: <Eye className="w-3 h-3 md:w-4 md:h-4" /> },
                    { id: "reviews", label: "Reviews", icon: <Star className="w-3 h-3 md:w-4 md:h-4" /> },
                  ].map((tab) => (
                    <TabsTrigger
                      key={tab.id}
                      value={tab.id}
                      className="data-[state=active]:bg-white data-[state=active]:dark:bg-gray-800 data-[state=active]:shadow-lg rounded-lg text-xs md:text-sm"
                    >
                      <span className="hidden md:inline">{tab.icon}</span>
                      <span className="ml-0 md:ml-2">{tab.label}</span>
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value="overview" className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    {[
                      { label: "Format", value: book.format || "Digital", icon: <File className="w-3 h-3 md:w-4 md:h-4" /> },
                      { label: "ISBN", value: book.isbn || "N/A", icon: <BookText className="w-3 h-3 md:w-4 md:h-4" /> },
                      { label: "Publisher", value: book.publisher || "Unknown", icon: <Award className="w-3 h-3 md:w-4 md:h-4" /> },
                      { label: "Stock", value: book.stock ? `${book.stock} available` : "Limited", icon: <BarChart className="w-3 h-3 md:w-4 md:h-4" /> },
                    ].map((item, index) => (
                      <Card key={index} className="border-0 shadow-sm">
                        <CardContent className="p-3 md:p-4">
                          <div className="flex items-center gap-2 md:gap-3">
                            <div className="p-1.5 md:p-2 rounded-lg bg-primary/10 text-primary">
                              {item.icon}
                            </div>
                            <div>
                              <p className="text-xs md:text-sm text-muted-foreground">{item.label}</p>
                              <p className="text-sm md:font-semibold truncate">{item.value}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="details" className="space-y-3 md:space-y-4">
                  {book.dimensions && (
                    <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
                      <div className="flex items-center gap-2 md:gap-3">
                        <Truck className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
                        <span className="text-sm md:text-base">Dimensions</span>
                      </div>
                      <span className="font-semibold text-sm md:text-base">{book.dimensions}</span>
                    </div>
                  )}
                  {book.weight && (
                    <div className="flex items-center justify-between p-3 md:p-4 rounded-lg bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
                      <div className="flex items-center gap-2 md:gap-3">
                        <Zap className="w-4 h-4 md:w-5 md:h-5 text-green-600" />
                        <span className="text-sm md:text-base">Weight</span>
                      </div>
                      <span className="font-semibold text-sm md:text-base">{book.weight}</span>
                    </div>
                  )}
                </TabsContent>
              </Tabs>

              {/* Action Buttons - Hidden on mobile (moved to bottom nav) */}
              {!isMobile && book.filePath && (
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <Button
                      size="lg"
                      className="flex-1 h-14 text-lg shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
                      onClick={handleReadPreview}
                    >
                      <BookOpen className="w-6 h-6 mr-3" />
                      Start Reading
                    </Button>
                  </div>
                </div>
              )}

              {/* Buy Links Section */}
              {(book.ziffybeesLink || book.amazonLink || book.flipkartLink) && (
                <div className="mt-6 space-y-3">
                  <h3 className="font-semibold text-lg">Purchase Options</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {book.ziffybeesLink && (
                      <a href={book.ziffybeesLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <Button className="w-full bg-[#f4a100] hover:bg-[#e09400] text-black font-semibold h-11 flex items-center justify-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          ZiffyBees
                        </Button>
                      </a>
                    )}
                    {book.amazonLink && (
                      <a href={book.amazonLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <Button className="w-full bg-[#FF9900] hover:bg-[#e68a00] text-black font-semibold h-11 flex items-center justify-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          Amazon
                        </Button>
                      </a>
                    )}
                    {book.flipkartLink && (
                      <a href={book.flipkartLink} target="_blank" rel="noopener noreferrer" className="block w-full">
                        <Button className="w-full bg-[#2874F0] hover:bg-[#1a5ebf] text-white font-semibold h-11 flex items-center justify-center gap-2">
                          <ShoppingCart className="w-4 h-4" />
                          Flipkart
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Document Preview Section */}
          {mounted && book.filePath && (
            <section
              id="preview-section"
              className="my-8 md:my-16"
            >
              <div className="relative">
                <div className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-2xl md:rounded-3xl p-4 md:p-8 shadow-xl md:shadow-2xl border">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                    <div>
                      <h2 className="text-xl md:text-3xl font-bold flex items-center gap-2 md:gap-3">
                        <CheckCircle className="w-5 h-5 md:w-8 md:h-8 text-green-500" />
                        Full Access: {getDocumentTypeName()}
                      </h2>
                      <p className="text-sm md:text-base text-muted-foreground mt-1 md:mt-2">
                        You have full access to this document
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {!isMobile && (
                        <Button
                          variant="outline"
                          onClick={toggleFullscreen}
                        >
                          {isFullscreen ? (
                            <Minimize2 className="w-4 h-4 mr-2" />
                          ) : (
                            <Maximize2 className="w-4 h-4 mr-2" />
                          )}
                          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="relative rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-inner">
                    <div className="h-[500px] md:h-[1200px] bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                      <Suspense fallback={<PdfViewerLoading />}>
                        {viewerMode === 'pdf' ? (
                          <PdfViewer
                            fileUrl={book.filePath}
                            isPreview={false}
                            previewLimit={PDF_PREVIEW_LIMIT}
                            onRequirePurchase={() => {}}
                            isMobile={isMobile}
                          />
                        ) : (
                          <DocumentViewer
                            fileUrl={book.filePath}
                            fileName={book.title}
                            fileType={fileType}
                            bookId={book._id}
                          />
                        )}
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Interactive Sections - Mobile optimized */}
          <div className="space-y-8 md:space-y-12">
            <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2 space-y-6 md:space-y-8">
                <ReviewsSection contentId={id} contentType="book" />
                <CommentsSection contentId={id} contentType="book" />
              </div>
              <div className="space-y-6 md:space-y-8">
                <ReactionsBar contentId={id} contentType="book" />

                {/* Related Info Card */}
                <Card className="border-0 shadow-lg md:shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
                  <CardContent className="p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                      Why Choose This Book?
                    </h3>
                    <ul className="space-y-2 md:space-y-3">
                      {[
                        "Digital & Physical Formats",
                        "Lifetime Access",
                        "Regular Updates",
                        "Community Access",
                        "Money-back Guarantee"
                      ].map((item, index) => (
                        <li key={index} className="flex items-center gap-2 md:gap-3">
                          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-primary" />
                          <span className="text-sm md:text-base">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </motion.main>

        {/* Purchase dialog completely removed */}

        {/* Full Cover Modal - Mobile optimized */}
        {showFullCover && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
            <div className="relative w-full max-w-2xl">
              <Button
                size="icon"
                variant="ghost"
                className="absolute -top-10 md:-top-12 right-0 text-white hover:bg-white/20"
                onClick={() => setShowFullCover(false)}
              >
                <X className="w-5 h-5 md:w-6 md:h-6" />
              </Button>
              <img
                src={book.cover || '/placeholder.jpg'}
                alt={book.title}
                className="w-full h-auto max-h-[80vh] md:max-h-[90vh] object-contain rounded-lg shadow-2xl"
              />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
