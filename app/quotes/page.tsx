"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Quote, Search, Copy, Share2, Sparkles, Check, RefreshCw, Heart, Download, Eye, MoreHorizontal, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import ContentRenderer from "@/components/content-renderer"
import { toast } from "sonner"
import { useTranslations } from "@/lib/language-context"

interface QuoteItem {
  _id: string
  content: string
  author: string
  tags: string[]
  backgroundImage?: string
  views: number
  likes?: number
  createdAt: string
}

function TranslatedQuote({ content, targetLang }: { content: string; targetLang: string }) {
  const [translatedText, setTranslatedText] = useState(content)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log("TranslatedQuote: targetLang =", targetLang, "original content =", content.slice(0, 30))
    if (targetLang === 'hi' || targetLang === 'en') {
      console.log("TranslatedQuote: Bypassing translation for hi/en")
      setTranslatedText(content)
      return
    }

    let active = true
    const doTranslate = async () => {
      setLoading(true)
      try {
        console.log("TranslatedQuote: Triggering translation for", targetLang)
        const response = await fetch('/api/translate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: content, targetLang }),
        })
        if (response.ok) {
          const data = await response.json()
          console.log("TranslatedQuote: Translation result =", data.translatedText?.slice(0, 30))
          if (active && data.translatedText) {
            setTranslatedText(data.translatedText)
          }
        }
      } catch (err) {
        console.error("TranslatedQuote: Error translating quote:", err)
      } finally {
        if (active) setLoading(false)
      }
    }

    doTranslate()
    return () => {
      active = false
    }
  }, [content, targetLang])

  if (loading) {
    return <div className="opacity-50 text-xs text-center py-2 animate-pulse">Translating...</div>
  }

  return <ContentRenderer content={translatedText} />
}

export default function QuotesPage() {
  const [quotes, setQuotes] = useState<QuoteItem[]>([])
  const [filteredQuotes, setFilteredQuotes] = useState<QuoteItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  
  // Local storage likes persistence
  const [likedQuotes, setLikedQuotes] = useState<string[]>([])
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const { t, lang } = useTranslations()

  const fetchQuotes = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/quotes")
      if (res.ok) {
        const data = await res.json()
        setQuotes(data)
        setFilteredQuotes(data)
      }
    } catch (error) {
      console.error("Failed to fetch quotes:", error)
      toast.error("Failed to load quotes")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotes()
    // Load liked quotes from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("liked_quotes")
      if (saved) {
        try {
          setLikedQuotes(JSON.parse(saved))
        } catch (e) {
          console.error(e)
        }
      }
    }
  }, [])

  useEffect(() => {
    let result = quotes

    // Apply search filter
    if (search.trim() !== "") {
      const query = search.toLowerCase()
      result = result.filter(
        (q) =>
          q.content.toLowerCase().includes(query) ||
          q.author.toLowerCase().includes(query) ||
          (q.tags && q.tags.some((tag) => tag.toLowerCase().includes(query)))
      )
    }

    // Apply tag filter
    if (selectedTag) {
      result = result.filter((q) => q.tags && q.tags.includes(selectedTag))
    }

    setFilteredQuotes(result)
  }, [search, selectedTag, quotes])

  const handleCopy = (quote: QuoteItem) => {
    let textToCopy = quote.content
    if (typeof window !== "undefined") {
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = quote.content
      textToCopy = tempDiv.innerText || tempDiv.textContent || quote.content
    }
    
    const formattedCopy = `"${textToCopy.trim()}"\n— ${quote.author}`
    
    navigator.clipboard.writeText(formattedCopy).then(() => {
      setCopiedId(quote._id)
      toast.success("Quote copied to clipboard!")
      setTimeout(() => setCopiedId(null), 2000)
    }).catch(() => {
      toast.error("Failed to copy quote")
    })
  }

  const handleLike = (id: string) => {
    let newLikes = [...likedQuotes]
    const isLiked = likedQuotes.includes(id)
    
    if (isLiked) {
      newLikes = newLikes.filter(item => item !== id)
      // Decrement locally
      setQuotes(prev => prev.map(q => q._id === id ? { ...q, likes: Math.max(0, (q.likes || 0) - 1) } : q))
    } else {
      newLikes.push(id)
      // Increment locally
      setQuotes(prev => prev.map(q => q._id === id ? { ...q, likes: (q.likes || 0) + 1 } : q))
    }
    
    setLikedQuotes(newLikes)
    localStorage.setItem("liked_quotes", JSON.stringify(newLikes))
    
    // Optionally call API to register reaction
    fetch(`/api/quotes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        likes: isLiked ? Math.max(0, (quotes.find(q => q._id === id)?.likes || 0) - 1) : (quotes.find(q => q._id === id)?.likes || 0) + 1
      })
    }).catch(err => console.error("Error updating likes:", err))
  }

  const handleShare = async (quote: QuoteItem) => {
    let textToShare = quote.content
    if (typeof window !== "undefined") {
      const tempDiv = document.createElement("div")
      tempDiv.innerHTML = quote.content
      textToShare = tempDiv.innerText || tempDiv.textContent || quote.content
    }

    const shareData = {
      title: "Quote by " + quote.author,
      text: `"${textToShare.trim()}" — ${quote.author}`,
      url: typeof window !== "undefined" ? window.location.href : ""
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
        // Increment views
        fetch(`/api/quotes/${quote._id}`)
      } else {
        navigator.clipboard.writeText(shareData.text)
        toast.success("Quote text copied to share!")
      }
    } catch (err) {
      console.log("Error sharing:", err)
    }
  }

  // Draw and download quote card as image via canvas
  const handleDownload = async (quote: QuoteItem) => {
    setDownloadingId(quote._id)
    toast("Generating high-quality quote image...", { duration: 1500 })

    try {
      // Create high-res canvas (1080x1080 px for social posts)
      const canvas = document.createElement("canvas")
      canvas.width = 1080
      canvas.height = 1080
      const ctx = canvas.getContext("2d")
      if (!ctx) throw new Error("Could not get canvas context")

      // Load logo watermark image concurrently
      const logoImg = new Image()
      logoImg.src = "/IMG_1790.PNG"
      const logoLoadPromise = new Promise((resolve) => {
        logoImg.onload = () => resolve(true)
        logoImg.onerror = () => resolve(false)
      })

      // 1. Draw Background
      if (quote.backgroundImage) {
        const img = new Image()
        img.crossOrigin = "anonymous" // Allow cross-origin images
        img.src = quote.backgroundImage

        await new Promise((resolve, reject) => {
          img.onload = resolve
          img.onerror = (e) => reject(new Error("Failed to load background image"))
        })

        // Draw image cover-style
        const imgRatio = img.width / img.height
        const canvasRatio = canvas.width / canvas.height
        let drawWidth, drawHeight, drawX, drawY

        if (imgRatio > canvasRatio) {
          drawHeight = canvas.height
          drawWidth = canvas.height * imgRatio
          drawX = (canvas.width - drawWidth) / 2
          drawY = 0
        } else {
          drawWidth = canvas.width
          drawHeight = canvas.width / imgRatio
          drawX = 0
          drawY = (canvas.height - drawHeight) / 2
        }

        ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight)

        // Draw dark overlay to ensure text readability
        ctx.fillStyle = "rgba(0, 0, 0, 0.45)"
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        // Draw elegant gradient background if no image
        const gradient = ctx.createLinearGradient(0, 0, 1080, 1080)
        gradient.addColorStop(0, "#2c2217") // Deep warm brown
        gradient.addColorStop(1, "#120e0a") // Darker brown/black
        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      // 2. Draw Decorative Quotes Icon
      ctx.fillStyle = "rgba(255, 255, 255, 0.08)"
      ctx.font = "bold 260px Georgia, serif"
      ctx.textAlign = "center"
      ctx.fillText("“", canvas.width / 2, 280)

      // 3. Render Quote Text (Word wrapping & centering)
      // Extract plaintext from HTML content
      let textContent = quote.content
      if (typeof window !== "undefined") {
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = quote.content
        textContent = tempDiv.innerText || tempDiv.textContent || quote.content
      }
      textContent = `"${textContent.trim()}"`

      ctx.fillStyle = "#ffffff"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      
      // Calculate font size dynamically based on length
      let fontSize = 44
      if (textContent.length > 200) fontSize = 36
      if (textContent.length > 350) fontSize = 30
      
      ctx.font = `italic ${fontSize}px Georgia, serif`
      
      // Helper function to split text into wrapped lines
      const wrapText = (text: string, maxWidth: number) => {
        const words = text.split(" ")
        const lines: string[] = []
        let currentLine = ""

        for (let n = 0; n < words.length; n++) {
          let testLine = currentLine + words[n] + " "
          let metrics = ctx.measureText(testLine)
          let testWidth = metrics.width
          if (testWidth > maxWidth && n > 0) {
            lines.push(currentLine.trim())
            currentLine = words[n] + " "
          } else {
            currentLine = testLine
          }
        }
        lines.push(currentLine.trim())
        return lines
      }

      const lines = wrapText(textContent, 840) // 120px margins on left/right
      const lineHeight = fontSize * 1.5
      const totalTextHeight = lines.length * lineHeight
      const startY = (canvas.height - totalTextHeight) / 2

      // Draw shadow for maximum legibility
      ctx.shadowColor = "rgba(0, 0, 0, 0.6)"
      ctx.shadowBlur = 10
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 4

      // Draw each wrapped line of quote
      lines.forEach((line, index) => {
        ctx.fillText(line, canvas.width / 2, startY + index * lineHeight)
      })

      // Reset shadows for signature
      ctx.shadowColor = "transparent"
      ctx.shadowBlur = 0

      // 4. Draw Divider Line
      ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(canvas.width / 2 - 80, startY + totalTextHeight + 40)
      ctx.lineTo(canvas.width / 2 + 80, startY + totalTextHeight + 40)
      ctx.stroke()

      // 5. Draw Author Signature
      ctx.fillStyle = "rgba(255, 255, 255, 0.85)"
      ctx.font = "italic 32px Georgia, serif"
      ctx.fillText(`— ${quote.author}`, canvas.width / 2, startY + totalTextHeight + 90)

      // 6. Draw Site Branding/Watermark at the very bottom
      const hasLogo = await logoLoadPromise
      if (hasLogo) {
        // Draw a beautiful semi-transparent white pill background for the dark logo
        const pillWidth = 200
        const pillHeight = 50
        const pillX = (canvas.width - pillWidth) / 2
        const pillY = canvas.height - 90
        
        ctx.fillStyle = "rgba(255, 255, 255, 0.85)"
        ctx.beginPath()
        if (typeof ctx.roundRect === "function") {
          ctx.roundRect(pillX, pillY, pillWidth, pillHeight, 25)
        } else {
          ctx.rect(pillX, pillY, pillWidth, pillHeight)
        }
        ctx.fill()

        // Draw logo centered inside the pill
        const logoWidth = 160
        const logoHeight = 40
        const logoX = pillX + (pillWidth - logoWidth) / 2
        const logoY = pillY + (pillHeight - logoHeight) / 2
        
        ctx.drawImage(logoImg, logoX, logoY, logoWidth, logoHeight)
      } else {
        // Fallback if logo fails to load
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.font = "normal 20px sans-serif"
        ctx.fillText("drrupeshkumarsingh.com", canvas.width / 2, canvas.height - 60)
      }

      // 7. Export and Trigger Download
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95)
      const link = document.createElement("a")
      link.download = `quote-${quote._id}.jpg`
      link.href = dataUrl
      link.click()
      
      toast.success("Quote card downloaded successfully!")

      // Increment views count in DB
      fetch(`/api/quotes/${quote._id}`)
    } catch (err) {
      console.error(err)
      toast.error("Failed to generate image download")
    } finally {
      setDownloadingId(null)
    }
  }

  // Get all unique tags from quotes
  const allTags = Array.from(
    new Set(quotes.flatMap((q) => q.tags || []))
  ).filter(Boolean)

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f4e8d4]/40 to-[#e6dfcd]/40 dark:from-[#171412] dark:to-[#120f0d] py-16 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-serif italic"
          >
            <Sparkles className="w-3.5 h-3.5" />
            {t("poetryRay") || "Literary Sparks"}
          </motion.div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif text-[#3c2a1e] dark:text-[#e6dfcd] tracking-tight">
            {t("quotes") || "Quotes & Reflections"}
          </h1>
  
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col gap-4 bg-card/65 dark:bg-[#1a1613]/60 border border-[#3c2a1e]/10 dark:border-[#e6dfcd]/10 p-4 rounded-xl shadow-sm backdrop-blur-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by quote, tag, or author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 w-full bg-background/50 border-[#3c2a1e]/15"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none">
            <Button
              variant={selectedTag === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(null)}
              className="whitespace-nowrap rounded-full text-xs"
              style={selectedTag === null ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' } : {}}
            >
              All Tags
            </Button>
            {allTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTag === tag ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
                className="whitespace-nowrap rounded-full text-xs"
                style={selectedTag === tag ? { backgroundColor: 'var(--primary)', color: 'var(--primary-foreground)' } : {}}
              >
                #{tag}
              </Button>
            ))}
          </div>
        </div>

        {/* Facebook-style Feed Column */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <RefreshCw className="w-8 h-8 text-primary animate-spin" />
            <span className="text-muted-foreground text-sm font-medium">Fetching feed...</span>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[#3c2a1e]/20 rounded-2xl bg-card/40 text-muted-foreground">
            <Quote className="w-12 h-12 mx-auto mb-3 opacity-10" />
            <p className="text-sm">No quotes in feed matching filters.</p>
            <Button variant="link" onClick={() => { setSearch(""); setSelectedTag(null); }} className="mt-2 text-primary text-xs">
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredQuotes.map((quote) => {
              const isLiked = likedQuotes.includes(quote._id)
              return (
                <div key={quote._id}>
                    {/* Facebook Feed Like Card */}
                    <Card className="overflow-hidden border border-[#3c2a1e]/10 dark:border-[#e6dfcd]/10 bg-card shadow-sm hover:shadow-md transition duration-300">
                      
                      {/* Post Header */}
                      <CardHeader className="p-4 flex flex-row items-center justify-between space-y-0 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 flex items-center justify-center font-serif text-sm font-bold text-primary select-none">
                            RK
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-[#3c2a1e] dark:text-[#e6dfcd] leading-none">
                              {quote.author}
                            </h3>
                            <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1.5">
                              <span>Published</span>
                              <span className="inline-block w-1 h-1 rounded-full bg-muted-foreground/45" />
                              <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" /> {quote.views} views</span>
                            </p>
                          </div>
                        </div>
                      
                      </CardHeader>

                      {/* Post Content Area */}
                      <div className="relative aspect-video sm:aspect-[4/3] w-full bg-muted flex flex-col justify-between p-6 sm:p-8">
                        {quote.backgroundImage ? (
                          <div 
                            className="absolute inset-0 bg-cover bg-center transition-opacity duration-300"
                            style={{ backgroundImage: `url(${quote.backgroundImage})` }}
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-[#f4e8d4] to-[#e8d5b5] dark:from-[#2a221a] dark:to-[#171310]" />
                        )}

                        {/* Dark overlay for readability */}
                        {quote.backgroundImage && (
                          <div className="absolute inset-0 bg-black/50" />
                        )}

                        <div className="relative z-10 w-full flex-1 flex flex-col justify-center text-center">
                          <Quote className="w-8 h-8 opacity-20 mx-auto mb-2 text-foreground" style={quote.backgroundImage ? { color: '#ffffff', opacity: 0.3 } : {}} />
                          <div 
                            className="font-serif text-base sm:text-xl leading-relaxed max-h-[180px] overflow-y-auto px-4"
                            style={quote.backgroundImage ? { color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' } : { color: 'var(--foreground)' }}
                          >
                            <TranslatedQuote content={quote.content} targetLang={lang} />
                          </div>
                        </div>

                        {/* Small Author stamp inside card for sharing downloads */}
                        <div className="relative z-10 w-full text-center mt-3 pt-2 border-t border-foreground/10" style={quote.backgroundImage ? { borderColor: 'rgba(255,255,255,0.15)' } : {}}>
                          <p 
                            className="font-serif italic text-xs"
                            style={quote.backgroundImage ? { color: '#ffffff', textShadow: '0 1px 2px rgba(0,0,0,0.8)' } : { color: 'var(--foreground)' }}
                          >
                            — {quote.author}
                          </p>
                        </div>
                      </div>

                      {/* Tags and Stats Indicators */}
                      <div className="px-4 py-2 flex items-center justify-between border-t border-border/40 text-xs text-muted-foreground bg-muted/20">
                        <div className="flex gap-1 flex-wrap">
                          {quote.tags && quote.tags.map(tag => (
                            <span 
                              key={tag} 
                              onClick={() => setSelectedTag(tag)}
                              className="text-[10px] bg-muted hover:bg-muted/80 text-muted-foreground px-2 py-0.5 rounded cursor-pointer transition-colors"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-3 text-[10px]">
                          <span>{quote.likes || 0} Likes</span>
                          <span>0 Comments</span>
                        </div>
                      </div>

                      {/* Post Actions (Like, Comment, Download, Share) */}
                      <div className="grid grid-cols-4 border-t border-[#3c2a1e]/10 dark:border-[#e6dfcd]/10 py-1 px-2 text-[#3c2a1e]/85 dark:text-[#e6dfcd]/85">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleLike(quote._id)}
                          className="flex items-center gap-1.5 h-9 rounded-md hover:bg-muted text-xs bg-transparent"
                        >
                          <Heart className="w-4 h-4" style={isLiked ? { fill: '#ef4444', color: '#ef4444' } : {}} />
                          <span style={isLiked ? { color: '#ef4444', fontWeight: 'bold' } : {}}>Like</span>
                        </Button>

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => toast("Comments section coming soon!")}
                          className="flex items-center gap-1.5 h-9 rounded-md hover:bg-muted text-xs bg-transparent"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>Comment</span>
                        </Button>

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          disabled={downloadingId === quote._id}
                          onClick={() => handleDownload(quote)}
                          className="flex items-center gap-1.5 h-9 rounded-md hover:bg-muted text-xs bg-transparent"
                        >
                          {downloadingId === quote._id ? (
                            <RefreshCw className="w-4 h-4 animate-spin text-primary" />
                          ) : (
                            <Download className="w-4 h-4" />
                          )}
                          <span>Download</span>
                        </Button>

                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleShare(quote)}
                          className="flex items-center gap-1.5 h-9 rounded-md hover:bg-muted text-xs bg-transparent"
                        >
                          <Share2 className="w-4 h-4" />
                          <span>Share</span>
                        </Button>
                      </div>

                    </Card>
                  </div>
                )
              })}
          </div>
        )}
      </div>
    </main>
  )
}
