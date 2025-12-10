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
  BookText
} from "lucide-react"
import { toast } from "sonner"

// Dynamically import PdfViewer with ssr: false
const PdfViewer = dynamic(() => import("@/components/pdf-viewer"), {
  ssr: false,
  loading: () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="rounded-full h-12 w-12 border-2 border-primary/30 border-t-primary mx-auto mb-4"
      />
      <p className="text-lg text-muted-foreground">Preparing your reading experience...</p>
    </motion.div>
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
}

export default function BookDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [book, setBook] = useState<Book | null>(null)
  const [loading, setLoading] = useState(true)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [hoverCover, setHoverCover] = useState(false)

  // Fetch book data
  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`/api/books/${id}`)
        if (res.ok) {
          const data = await res.json()
          setBook(data)
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

  // Loading state
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-20 h-20 mx-auto mb-6"
        >
          <BookOpen className="w-full h-full text-primary/60" />
        </motion.div>
        <p className="text-lg text-muted-foreground animate-pulse">Discovering literary treasures...</p>
      </div>
    </div>
  )

  // Not found state
  if (!book) return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="text-center">
        <BookOpen className="w-24 h-24 mx-auto mb-6 text-muted-foreground/50" />
        <h2 className="text-3xl font-semibold text-foreground mb-4">Book Not Found</h2>
        <p className="text-muted-foreground mb-8">The literary adventure you seek is currently unwritten.</p>
        <Button onClick={() => router.push("/books")}>Browse Library</Button>
      </div>
    </div>
  )

  return (
    <AnimatePresence mode="wait">
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{ y: [0, -30, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-10 top-1/4 w-48 h-48 bg-primary/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 30, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-10 top-2/3 w-56 h-56 bg-purple-500/5 rounded-full blur-3xl"
          />
          <div className="absolute left-1/4 top-1/3 w-24 h-24 border border-primary/10 rounded-full" />
          <div className="absolute right-1/3 bottom-1/4 w-12 h-12 border border-purple-500/10 rounded-full" />
        </div>

        {/* Floating decoration */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="fixed right-8 top-24 w-8 h-8 border border-primary/20 rounded-full hidden lg:block"
        />

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Book Header Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="grid lg:grid-cols-2 gap-12 mb-16"
          >
            {/* Cover Section */}
            <div className="relative">
              <motion.div
                whileHover={{ scale: 1.02 }}
                onHoverStart={() => setHoverCover(true)}
                onHoverEnd={() => setHoverCover(false)}
                className="relative aspect-[3/4] bg-gradient-to-br from-primary/10 via-background to-background rounded-2xl overflow-hidden shadow-2xl shadow-primary/10 border border-border/50"
              >
                {book.cover ? (
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="w-full h-full object-cover transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8">
                    <BookOpen className="w-24 h-24 text-primary/40 mb-4" />
                    <span className="text-xl font-medium text-muted-foreground">No Cover Available</span>
                  </div>
                )}
                
                {/* Overlay effect on hover */}
                {hoverCover && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"
                  />
                )}

                {/* Decorative corner accents */}
                <div className="absolute top-4 left-4 w-8 h-8 border-t border-l border-primary/30 rounded-tl-2xl" />
                <div className="absolute bottom-4 right-4 w-8 h-8 border-b border-r border-primary/30 rounded-br-2xl" />
              </motion.div>

              {/* Bookmark button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleBookmark}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-lg flex items-center justify-center z-10"
              >
                <Bookmark className={`w-5 h-5 ${isBookmarked ? "fill-primary text-primary" : "text-muted-foreground"}`} />
              </motion.button>
            </div>

            {/* Details Section */}
            <div className="space-y-8">
              <div>
                {/* Title with decorative elements */}
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-primary uppercase tracking-wider">Featured Book</span>
                </div>
                
                <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                  {book.title}
                </h1>
                
                {/* Author and rating */}
                <div className="flex items-center gap-6 mb-8">
                  {book.author && (
                    <div className="flex items-center gap-2">
                      <Feather className="w-4 h-4 text-muted-foreground" />
                      <span className="text-lg text-muted-foreground">{book.author}</span>
                    </div>
                  )}
                  {book.rating && (
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-lg font-medium">{book.rating}/5.0</span>
                    </div>
                  )}
                </div>

                {/* Description */}
                <p className="text-xl text-muted-foreground leading-relaxed mb-8 font-light">
                  {book.description.substring(0, 200)}...
                </p>
              </div>

              {/* Metadata grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">ISBN</span>
                  </div>
                  <span className="text-lg font-semibold">{book.isbn}</span>
                </div>
                
                <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                    <span className="text-sm text-muted-foreground">Type</span>
                  </div>
                  <span className="text-lg font-semibold capitalize">{book.type}</span>
                </div>
                
                {book.pages && (
                  <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <BookText className="w-4 h-4 text-primary" />
                      <span className="text-sm text-muted-foreground">Pages</span>
                    </div>
                    <span className="text-lg font-semibold">{book.pages}</span>
                  </div>
                )}
                
                <div className="bg-card/50 backdrop-blur-sm p-4 rounded-xl border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    {book.stock !== undefined && book.stock > 0 ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <Eye className="w-4 h-4 text-red-500" />
                    )}
                    <span className="text-sm text-muted-foreground">Stock</span>
                  </div>
                  <span className={`text-lg font-semibold ${book.stock !== undefined && book.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                    {book.stock !== undefined ? (book.stock > 0 ? `${book.stock} In Stock` : "Out of Stock") : "Available"}
                  </span>
                </div>
              </div>

              {/* Price and Actions */}
              <div className="space-y-6 pt-6 border-t border-border/50">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">Price</div>
                    <div className="flex items-center">
                      <DollarSign className="w-8 h-8 text-primary mr-1" />
                      <span className="text-5xl font-bold text-foreground">{book.price.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toast.info("Preview feature coming soon!")}
                      className="px-6 py-3 rounded-xl bg-card border border-border hover:border-primary/50 transition-colors flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      Preview
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddToCart}
                      disabled={book.stock !== undefined && book.stock <= 0}
                      className={`px-8 py-3 rounded-xl flex items-center gap-3 ${
                        book.stock !== undefined && book.stock <= 0
                          ? "bg-gray-500/20 cursor-not-allowed"
                          : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      {book.stock !== undefined && book.stock <= 0 ? "Out of Stock" : "Add to Cart"}
                    </motion.button>
                  </div>
                </div>
                
                {/* Additional info */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>Usually ships in 3-5 days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    <span>Best Seller</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Full Description Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-16"
          >
            <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookText className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">About This Book</h2>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {book.description}
                </p>
              </div>
              
              {/* Reading time estimate */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Coffee className="w-4 h-4" />
                  <span>Reading time: Approximately {Math.ceil(book.description.length / 1500)} hours</span>
                </div>
              </div>
            </div>
          </motion.section>

          {/* PDF Preview Section */}
          {book.type !== "physical" && book.filePath && (
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mb-16"
            >
              <div className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-lg">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-foreground">E-book Preview</h2>
                      <p className="text-muted-foreground mt-1">Read the first few chapters for free</p>
                    </div>
                  </div>
                  <Button variant="outline" className="gap-2">
                    Download Sample
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="rounded-xl overflow-hidden border border-border">
                  <Suspense fallback={
                    <div className="h-96 flex items-center justify-center bg-card">
                      <div className="animate-pulse text-center">
                        <BookOpen className="w-12 h-12 mx-auto mb-4 text-primary/40" />
                        <p className="text-muted-foreground">Loading preview...</p>
                      </div>
                    </div>
                  }>
                    <PdfViewer fileUrl={book.filePath} />
                  </Suspense>
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
              className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Reader Reactions</h2>
              </div>
              <ReactionsBar contentId={id} contentType="book" />
            </motion.section>

            {/* Reviews */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Star className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Customer Reviews</h2>
              </div>
              <ReviewsSection contentId={id} contentType="book" />
            </motion.section>

            {/* Comments */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 shadow-lg"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Feather className="w-6 h-6 text-primary" />
                </div>
                <h2 className="text-3xl font-bold text-foreground">Community Discussion</h2>
              </div>
              <CommentsSection contentId={id} contentType="book" />
            </motion.section>
          </div>
        </div>

        {/* Bottom decorative wave */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-primary/5 to-transparent" />
      </motion.main>
    </AnimatePresence>
  )
}