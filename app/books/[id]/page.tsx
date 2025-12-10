"use client"

import { useEffect, useState, Suspense } from "react"
import { useParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import CommentsSection from "@/components/comments-section"
import ReactionsBar from "@/components/reactions-bar"
import ReviewsSection from "@/components/reviews-section"
import {
  ShoppingCart,
  BookOpen,
  Layers,
  DollarSign,
  Sparkles,
  Bookmark,
  Eye,
  Clock,
  Award,
  TrendingUp,
  Star,
  ChevronRight,
  Feather,
  Coffee,
  Zap,
  Heart,
  BookText,
  Download,
  User,
  Calendar,
  Globe,
  BookmarkCheck,
  Shield,
  Truck,
  RotateCcw,
  X,
  Lock,
  File,
  Printer,
  Info,
  ExternalLink
} from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Dynamically import DocumentViewer
const DocumentViewer = dynamic(() => import("@/components/document-viewer"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-xl">
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-2 border-primary/30 border-t-primary mx-auto"
        />
        <p className="text-lg text-muted-foreground">Preparing document viewer...</p>
      </div>
    </div>
  ),
})

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
}

const FREE_PREVIEW_PAGES = 5

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [showPurchaseModal, setShowPurchaseModal] = useState(false)
  const [showFullCover, setShowFullCover] = useState(false)
  const [fileType, setFileType] = useState<string>("")

  // Fetch book data
  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`/api/books/${id}`)
        if (res.ok) {
          const data = await res.json()
          setBook(data)
          console.log("Fetched book data:", data)
          
          // Detect file type
          if (data.filePath) {
            const extension = data.filePath.substring(data.filePath.lastIndexOf('.')).toLowerCase()
            setFileType(extension)
            console.log("File type detected:", extension)
          }
          
          // Check if book is bookmarked
          const bookmarked = localStorage.getItem(`bookmark_${id}`)
          setIsBookmarked(!!bookmarked)
        }
      } catch (error) {
        console.error("Failed to fetch book:", error)
        toast.error("Could not load book details")
      } finally {
        setLoading(false)
      }
    }
    fetchBook()
  }, [id])

  // Handle bookmark toggle
  const toggleBookmark = () => {
    if (!book) return
    if (isBookmarked) {
      localStorage.removeItem(`bookmark_${id}`)
      toast.info("Removed from bookmarks")
    } else {
      localStorage.setItem(`bookmark_${id}`, "true")
      toast.success("Added to bookmarks")
    }
    setIsBookmarked(!isBookmarked)
  }

  // Add to cart with toast notification
  const handleAddToCart = async () => {
    if (!book) return
    if (book.stock !== undefined && book.stock <= 0) {
      toast.error("This book is currently out of stock")
      return
    }
    
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: id,
          quantity: 1,
          price: book.price,
        }),
      })
      
      if (res.ok) {
        toast.success("Added to cart!", {
          description: "Continue shopping or proceed to checkout",
          action: {
            label: "View Cart",
            onClick: () => router.push("/cart"),
          },
        })
      } else {
        toast.error("Please login to add items to cart")
      }
    } catch (error) {
      console.error("Failed to add to cart:", error)
      toast.error("Failed to add item to cart")
    }
  }

  // Handle page navigation for preview (PDF only)
  const handlePageChange = (newPage: number) => {
    if (newPage > FREE_PREVIEW_PAGES && book?.type !== "physical" && fileType === '.pdf') {
      setShowPurchaseModal(true)
      return
    }
    setCurrentPage(newPage)
  }

  // Handle document download
  const handleDownload = async () => {
    if (!book?.filePath) {
      toast.error("No file available for download")
      return
    }

    try {
      // Use our secure download API
      const response = await fetch(`/api/download?url=${encodeURIComponent(book.filePath)}&filename=${encodeURIComponent(book.title + fileType)}`)
      
      if (response.ok) {
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = book.title + fileType
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(downloadUrl)
        toast.success("Download started!", {
          description: "Check your downloads folder",
        })
      } else {
        // Fallback to direct download
        const link = document.createElement('a')
        link.href = book.filePath
        link.download = book.title + fileType
        link.click()
        toast.success("Download started!", {
          description: "Using direct download link",
        })
      }
    } catch (error) {
      console.error("Download failed:", error)
      toast.error("Failed to download file")
    }
  }

  // Handle read preview
  const handleReadPreview = () => {
    if (!book) return
    
    if (book.type === "physical") {
      toast.info("Physical books cannot be previewed online")
      return
    }
    
    if (!book.filePath) {
      toast.error("No preview available for this book")
      return
    }

    // Scroll to preview section
    document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  // Check if document can be previewed inline
  const canPreviewInline = () => {
    if (!book?.filePath) return false
    const extension = book.filePath.substring(book.filePath.lastIndexOf('.')).toLowerCase()
    const viewableFormats = ['.pdf', '.doc', '.docx', '.txt', '.rtf', '.jpg', '.jpeg', '.png']
    return viewableFormats.includes(extension)
  }

  // Get document type name
  const getDocumentTypeName = () => {
    if (!book?.filePath) return "Document"
    const extension = book.filePath.substring(book.filePath.lastIndexOf('.')).toLowerCase()
    if (extension === '.pdf') return "PDF Document"
    if (['.doc', '.docx'].includes(extension)) return "Word Document"
    if (['.xls', '.xlsx'].includes(extension)) return "Excel Spreadsheet"
    if (['.ppt', '.pptx'].includes(extension)) return "PowerPoint Presentation"
    if (['.jpg', '.jpeg', '.png', '.gif'].includes(extension)) return "Image File"
    if (['.txt', '.rtf', '.md'].includes(extension)) return "Text File"
    return "Document"
  }

  // Loading state
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="text-center space-y-6">
        <div className="relative">
          <BookOpen className="w-24 h-24 mx-auto text-primary/60 animate-pulse" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-primary/10 rounded-full blur-xl"
          />
        </div>
        <p className="text-lg text-muted-foreground font-medium">Discovering literary treasures...</p>
      </div>
    </div>
  )

  // Not found state
  if (!book) return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md">
        <BookOpen className="w-24 h-24 mx-auto text-muted-foreground/50" />
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">Book Not Found</h2>
          <p className="text-muted-foreground">The literary adventure you seek is currently unwritten.</p>
        </div>
        <Button onClick={() => router.push("/books")} size="lg">
          Browse Library
        </Button>
      </div>
    </div>
  )

  return (
    <AnimatePresence mode="wait">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto">
          {/* Book Header Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-3 gap-8 mb-16"
          >
            {/* Cover Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <motion.div
                  whileHover={{ y: -5 }}
                  className="relative group cursor-pointer"
                  onClick={() => setShowFullCover(true)}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500" />
                  
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl shadow-primary/5 border border-gray-200 dark:border-gray-800">
                    {book.cover ? (
                      <img
                        src={book.cover}
                        alt={book.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                        <BookOpen className="w-24 h-24 text-primary/40 mb-4" />
                        <span className="text-xl font-medium text-muted-foreground">No Cover Available</span>
                      </div>
                    )}
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    {/* View fullscreen button */}
                    <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      <Button size="sm" variant="secondary" className="gap-2 backdrop-blur-sm">
                        <Eye className="w-4 h-4" />
                        View Full
                      </Button>
                    </div>
                  </div>
                  
                  {/* Decorative corner elements */}
                  <div className="absolute -top-2 -left-2 w-6 h-6 border-t border-l border-primary/30 rounded-tl-2xl" />
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b border-r border-primary/30 rounded-br-2xl" />
                </motion.div>

                {/* Bookmark button */}
                <div className="flex justify-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleBookmark}
                    className="flex items-center gap-3 px-6 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    <span className="font-medium">
                      {isBookmarked ? "Bookmarked" : "Add to Bookmarks"}
                    </span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Details Section */}
            <div className="lg:col-span-2 space-y-8">
              <div className="space-y-6">
                {/* Title and author */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                      {book.type === "physical" ? "Physical Copy" : "E-book"}
                    </div>
                    {book.genre?.[0] && (
                      <div className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-muted-foreground text-sm font-medium">
                        {book.genre[0]}
                      </div>
                    )}
                    {book.filePath && (
                      <div className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 text-sm font-medium flex items-center gap-2">
                        <File className="w-3 h-3" />
                        {fileType.toUpperCase().replace('.', '')}
                      </div>
                    )}
                  </div>
                  
                  <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                    {book.title}
                  </h1>
                  
                  {book.author && (
                    <div className="flex items-center gap-3 text-xl text-muted-foreground">
                      <User className="w-5 h-5" />
                      <span>By {book.author}</span>
                    </div>
                  )}
                </div>

                {/* Rating and metadata */}
                <div className="flex items-center gap-8">
                  {book.rating && (
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-5 h-5 ${
                              i < Math.floor(book.rating!)
                                ? "fill-yellow-500 text-yellow-500"
                                : "fill-gray-200 dark:fill-gray-700 text-gray-200 dark:text-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold">{book.rating.toFixed(1)}</span>
                      <span className="text-muted-foreground">• 256 reviews</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    {book.pages && (
                      <div className="flex items-center gap-2">
                        <BookText className="w-4 h-4" />
                        <span>{book.pages} pages</span>
                      </div>
                    )}
                    {book.language && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>{book.language}</span>
                      </div>
                    )}
                    {book.filePath && (
                      <div className="flex items-center gap-2">
                        <File className="w-4 h-4" />
                        <span>{getDocumentTypeName()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price and stock status */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-5xl font-bold text-gray-900 dark:text-white">
                        ${book.price.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {book.type === "physical" ? "+ Shipping" : "Instant Access"}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
                        book.stock !== undefined && book.stock > 0
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                          : "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                      }`}>
                        <div className="w-2 h-2 rounded-full animate-pulse" />
                        {book.stock !== undefined && book.stock > 0
                          ? `${book.stock} in stock`
                          : "Out of stock"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <Button
                    size="lg"
                    className="flex-1 gap-3 h-14"
                    onClick={handleAddToCart}
                    disabled={book.stock !== undefined && book.stock <= 0}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </Button>
                  
                  {book.type !== "physical" && book.filePath && (
                    <Button
                      size="lg"
                      variant="outline"
                      className="flex-1 gap-3 h-14"
                      onClick={handleReadPreview}
                    >
                      <Eye className="w-5 h-5" />
                      {fileType === '.pdf' ? 'Read Preview' : 'View Document'}
                    </Button>
                  )}
                  
                  {book.filePath && (
                    <Button
                      size="lg"
                      variant="secondary"
                      className="h-14 px-6"
                      onClick={handleDownload}
                    >
                      <Download className="w-5 h-5" />
                    </Button>
                  )}
                </div>

                {/* Additional info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200 dark:border-gray-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <div className="font-medium">Free Shipping</div>
                      <div className="text-sm text-muted-foreground">Over $50</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                      <RotateCcw className="w-5 h-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <div className="font-medium">30-Day Returns</div>
                      <div className="text-sm text-muted-foreground">Easy returns</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <div className="font-medium">Secure Access</div>
                      <div className="text-sm text-muted-foreground">Protected documents</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
                      <Award className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <div className="font-medium">Best Seller</div>
                      <div className="text-sm text-muted-foreground">Top rated</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Description Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookText className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About This Book</h2>
                  <p className="text-muted-foreground mt-1">Discover what makes this book special</p>
                </div>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
                  {book.description}
                </p>
                
                {book.publishedDate && (
                  <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Published: {new Date(book.publishedDate).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.section>

          {/* Document Preview Section */}
          {book.type !== "physical" && book.filePath && (
            <motion.section
              id="preview-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-16"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Eye className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {fileType === '.pdf' ? 'PDF Preview' : 'Document Viewer'}
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        {fileType === '.pdf' 
                          ? `Read first ${FREE_PREVIEW_PAGES} pages for free` 
                          : canPreviewInline() 
                            ? 'View document in browser' 
                            : 'Download to view document'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-sm font-medium flex items-center gap-2">
                      <File className="w-4 h-4" />
                      {fileType.toUpperCase()}
                    </div>
                  </div>
                </div>
                
                {/* Page Navigation for PDF only */}
                {fileType === '.pdf' && (
                  <div className="flex items-center justify-between mb-6">
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="gap-2"
                    >
                      Previous Page
                    </Button>
                    
                    <div className="flex items-center gap-4">
                      {[1, 2, 3, 4, 5].map((page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center font-medium transition-all ${
                            currentPage === page
                              ? "bg-primary text-white"
                              : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      className="gap-2"
                    >
                      Next Page
                    </Button>
                  </div>
                )}
                
                {/* Document Viewer */}
                <div className="rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-red-500" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                        <span className="text-sm text-muted-foreground ml-2">
                          {fileType === '.pdf' ? 'PDF Preview' : 'Document Viewer'}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {fileType === '.pdf' 
                          ? `${FREE_PREVIEW_PAGES - currentPage} free pages remaining`
                          : canPreviewInline() ? 'Full document access' : 'Download required'
                        }
                      </div>
                    </div>
                  </div>
                  
                  <div className="h-[600px] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
                    <Suspense fallback={
                      <div className="h-full flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="rounded-full h-12 w-12 border-2 border-primary/30 border-t-primary mx-auto"
                          />
                          <p className="text-lg text-muted-foreground">Loading document viewer...</p>
                        </div>
                      </div>
                    }>
                      <DocumentViewer 
                        fileUrl={book.filePath}
                        fileName={book.title}
                        fileType={fileType}
                        bookId={book._id}
                      />
                    </Suspense>
                  </div>
                  
                  {/* Preview watermark for PDF preview */}
                  {fileType === '.pdf' && currentPage <= FREE_PREVIEW_PAGES && (
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                      <div className="text-8xl font-bold text-gray-200 dark:text-gray-800 opacity-20 rotate-45">
                        PREVIEW
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Page counter for PDF only */}
                {fileType === '.pdf' && (
                  <div className="mt-6 flex items-center justify-between text-sm text-muted-foreground">
                    <span>Reading progress: {currentPage}/{FREE_PREVIEW_PAGES} pages</span>
                    <span>Approx. {Math.ceil((FREE_PREVIEW_PAGES - currentPage) * 2)} minutes left</span>
                  </div>
                )}
                
                {/* Document info */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <Info className="w-5 h-5 text-blue-500" />
                      <div>
                        <div className="font-medium">Format</div>
                        <div className="text-muted-foreground">{getDocumentTypeName()}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <Download className="w-5 h-5 text-green-500" />
                      <div>
                        <div className="font-medium">Download</div>
                        <div className="text-muted-foreground">Save for offline use</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <ExternalLink className="w-5 h-5 text-amber-500" />
                      <div>
                        <div className="font-medium">Compatibility</div>
                        <div className="text-muted-foreground">Works on all devices</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {/* Interactive Sections */}
          <div className="space-y-8">
            {/* Reactions */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Reader Reactions</h2>
              </div>
              <ReactionsBar contentId={id} contentType="book" />
            </motion.section>

            {/* Reviews */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Customer Reviews</h2>
              </div>
              <ReviewsSection contentId={id} contentType="book" />
            </motion.section>

            {/* Comments */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-700"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Feather className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Community Discussion</h2>
              </div>
              <CommentsSection contentId={id} contentType="book" />
            </motion.section>
          </div>
        </div>

        {/* Purchase Modal for PDF */}
        <Dialog open={showPurchaseModal} onOpenChange={setShowPurchaseModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Continue Reading</DialogTitle>
              <DialogDescription>
                You've reached the end of the free preview. Purchase the book to continue reading.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 py-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-16 h-20 object-cover rounded"
                />
                <div>
                  <h4 className="font-semibold">{book.title}</h4>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                  <div className="text-2xl font-bold mt-2">${book.price.toFixed(2)}</div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Format</span>
                  <span className="font-medium">{book.type === "physical" ? "Physical Copy" : "E-book"}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">File Type</span>
                  <span className="font-medium">PDF Document</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Free preview</span>
                  <span className="font-medium">{FREE_PREVIEW_PAGES} pages</span>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowPurchaseModal(false)}
              >
                Continue Preview
              </Button>
              <Button
                className="flex-1 gap-2"
                onClick={() => {
                  handleAddToCart()
                  setShowPurchaseModal(false)
                }}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart & Continue
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Full Cover Modal */}
        <Dialog open={showFullCover} onOpenChange={setShowFullCover}>
          <DialogContent className="max-w-4xl">
            <div className="relative">
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 z-10"
                onClick={() => setShowFullCover(false)}
              >
                <X className="w-4 h-4" />
              </Button>
              <img
                src={book.cover}
                alt={book.title}
                className="w-full h-auto rounded-lg"
              />
            </div>
          </DialogContent>
        </Dialog>
      </motion.main>
    </AnimatePresence>
  )
}
