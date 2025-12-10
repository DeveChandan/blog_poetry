"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, BookOpen, Heart, Eye, Calendar, Tag } from "lucide-react"
import CommentsSection from "@/components/comments-section"
import ReactionsBar from "@/components/reactions-bar"
import ReviewsSection from "@/components/reviews-section"

interface Poem {
  _id: string
  title: string
  content: string
  excerpt: string
  tags: string[]
  views: number
  createdAt: string
}

export default function PoemDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [poem, setPoem] = useState<Poem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPoem() {
      try {
        const res = await fetch(`/api/poems/${id}`)
        if (res.ok) {
          const data = await res.json()
          setPoem(data)
        }
      } catch (error) {
        console.error("Failed to fetch poem:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPoem()
  }, [id])

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-6"
        >
          <BookOpen className="w-full h-full text-primary/60" />
        </motion.div>
        <p className="text-lg text-muted-foreground animate-pulse">Unfolding verses...</p>
      </div>
    </div>
  )

  if (!poem) return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="text-center">
        <Sparkles className="w-20 h-20 mx-auto mb-6 text-muted-foreground/50" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">Poem Not Found</h2>
        <p className="text-muted-foreground">The verses you seek have vanished into the ether.</p>
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
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute left-10 top-1/4 w-32 h-32 bg-primary/5 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute right-10 top-2/3 w-40 h-40 bg-purple-500/5 rounded-full blur-3xl"
          />
          <div className="absolute left-1/4 top-1/3 w-16 h-16 border border-primary/10 rounded-full" />
          <div className="absolute right-1/3 bottom-1/4 w-8 h-8 border border-purple-500/10 rounded-full" />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          {/* Poem Header */}
          <motion.article
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card/50 backdrop-blur-sm p-8 rounded-2xl border border-border/50 mb-8 shadow-2xl shadow-primary/5 relative overflow-hidden"
          >
            {/* Decorative corner accents */}
            <div className="absolute top-0 left-0 w-20 h-20 border-t border-l border-primary/20 rounded-tl-2xl" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b border-r border-primary/20 rounded-br-2xl" />
            
            {/* Title with animation */}
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              className="relative"
            >
              <Sparkles className="absolute -left-6 -top-6 w-6 h-6 text-primary/40" />
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 bg-gradient-to-r from-foreground via-foreground to-primary/80 bg-clip-text text-transparent leading-tight">
                {poem.title}
              </h1>
            </motion.div>

            {/* Tags */}
            <div className="flex flex-wrap gap-3 mb-8">
              {poem.tags.map((tag, index) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-primary px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 backdrop-blur-sm hover:shadow-lg hover:shadow-primary/10 transition-all duration-300"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </motion.span>
              ))}
            </div>

            {/* Content with animated reveal */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative mb-8"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary/30 via-primary/20 to-transparent rounded-full" />
              <div className="pl-6">
                <p className="text-foreground whitespace-pre-wrap text-lg md:text-xl leading-relaxed font-serif tracking-wide bg-gradient-to-b from-foreground to-foreground/90 bg-clip-text">
                  {poem.content}
                </p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.6 }}
              className="flex flex-wrap items-center gap-6 text-sm text-muted-foreground border-t border-border/50 pt-6"
            >
              <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Eye className="w-4 h-4" />
                <span>{poem.views.toLocaleString()} views</span>
              </div>
              <div className="flex items-center gap-2 hover:text-foreground transition-colors">
                <Calendar className="w-4 h-4" />
                <span>{new Date(poem.createdAt).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="ml-auto flex items-center gap-2 text-primary"
              >
                <Heart className="w-4 h-4 fill-current" />
                <span>Poem</span>
              </motion.div>
            </motion.div>
          </motion.article>

          {/* Interactions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            <ReactionsBar contentId={id} contentType="poem" />
          </motion.div>

          {/* Reviews Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <ReviewsSection contentId={id} contentType="poem" />
          </motion.div>

          {/* Comments Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <CommentsSection contentId={id} contentType="poem" />
          </motion.div>
        </div>

        {/* Floating decorative elements */}
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="fixed right-8 bottom-8 w-6 h-6 border border-primary/20 rounded-full"
        />
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="fixed left-8 top-24 w-4 h-4 border border-purple-500/20 rounded-full"
        />
      </motion.main>
    </AnimatePresence>
  )
}