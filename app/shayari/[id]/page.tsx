"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Feather, Eye, Heart, Share2, Bookmark, ArrowLeft, Quote } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useLanguage } from "@/lib/language-context"

interface Shayari {
    _id: string
    title: string
    content: string
    author: string
    tags: string[]
    language: string
    views: number
    likes: number
    createdAt: string
}

export default function ShayariDetailPage() {
    const params = useParams()
    const id = params.id as string
    const [shayari, setShayari] = useState<Shayari | null>(null)
    const [loading, setLoading] = useState(true)
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)

    // Translation
    const { currentLanguage } = useLanguage()
    const [translatedContent, setTranslatedContent] = useState<string | null>(null)
    const [isTranslating, setIsTranslating] = useState(false)

    useEffect(() => {
        async function fetchShayari() {
            try {
                const res = await fetch(`/api/shayari/${id}`)
                if (res.ok) {
                    const data = await res.json()
                    setShayari(data)

                    // Check local storage for like/bookmark status
                    const liked = localStorage.getItem(`shayari_like_${id}`)
                    const bookmarked = localStorage.getItem(`shayari_bookmark_${id}`)
                    setIsLiked(!!liked)
                    setIsBookmarked(!!bookmarked)
                }
            } catch (error) {
                console.error("Failed to fetch shayari:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchShayari()
    }, [id])

    // Auto-translate when language changes
    useEffect(() => {
        if (!shayari) return

        const translateContent = async () => {
            if (currentLanguage.code === 'en') {
                if (/[\u0900-\u097F]/.test(shayari.content)) {
                    setIsTranslating(true)
                    try {
                        const res = await fetch('/api/translate', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ text: shayari.content, targetLang: 'en' })
                        })
                        const data = await res.json()
                        if (data.translatedText) {
                            setTranslatedContent(data.translatedText)
                        }
                    } catch (error) {
                        console.error('Translation error:', error)
                    } finally {
                        setIsTranslating(false)
                    }
                } else {
                    setTranslatedContent(null)
                }
                return
            }

            setIsTranslating(true)
            try {
                const res = await fetch('/api/translate', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ text: shayari.content, targetLang: currentLanguage.code })
                })
                const data = await res.json()
                if (data.translatedText) {
                    setTranslatedContent(data.translatedText)
                }
            } catch (error) {
                console.error('Translation error:', error)
            } finally {
                setIsTranslating(false)
            }
        }

        translateContent()
    }, [currentLanguage.code, shayari?._id])

    const handleLike = () => {
        if (isLiked) {
            localStorage.removeItem(`shayari_like_${id}`)
            setIsLiked(false)
        } else {
            localStorage.setItem(`shayari_like_${id}`, 'true')
            setIsLiked(true)
            toast.success("Added to likes!")
        }
    }

    const handleBookmark = () => {
        if (isBookmarked) {
            localStorage.removeItem(`shayari_bookmark_${id}`)
            setIsBookmarked(false)
        } else {
            localStorage.setItem(`shayari_bookmark_${id}`, 'true')
            setIsBookmarked(true)
            toast.success("Bookmarked!")
        }
    }

    const handleShare = async () => {
        try {
            await navigator.share({
                title: shayari?.title || 'Shayari',
                text: shayari?.content.substring(0, 100),
                url: window.location.href
            })
        } catch {
            navigator.clipboard.writeText(window.location.href)
            toast.success("Link copied!")
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <Feather className="h-12 w-12 text-primary animate-pulse" />
            </main>
        )
    }

    if (!shayari) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground text-lg">Shayari not found</p>
                    <Button asChild className="mt-4">
                        <Link href="/shayari">Back to Shayari</Link>
                    </Button>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                {/* Back Button */}
                <Button variant="ghost" asChild className="mb-8">
                    <Link href="/shayari" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Shayari
                    </Link>
                </Button>

                {/* Shayari Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm">
                        <CardContent className="p-8 md:p-12">
                            {/* Quote Icon */}
                            <Quote className="h-12 w-12 text-primary/30 mb-6" />

                            {/* Title */}
                            {shayari.title && (
                                <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
                                    {shayari.title}
                                </h1>
                            )}

                            {/* Content */}
                            <div
                                className={`text-xl md:text-2xl leading-relaxed whitespace-pre-line text-foreground/90 italic ${isTranslating ? 'opacity-70' : ''}`}
                                dir={currentLanguage.rtl ? 'rtl' : 'ltr'}
                            >
                                "{translatedContent || shayari.content}"
                            </div>

                            {/* Author */}
                            {shayari.author && (
                                <p className="text-right text-primary font-semibold mt-8">
                                    — {shayari.author}
                                </p>
                            )}

                            {/* Tags */}
                            {shayari.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border/50">
                                    {shayari.tags.map((tag) => (
                                        <Badge key={tag} variant="secondary">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Actions */}
                            <div className="flex items-center justify-between mt-8 pt-6 border-t border-border/50">
                                <div className="flex items-center gap-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleLike}
                                        className={isLiked ? 'text-red-500' : ''}
                                    >
                                        <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                                        {shayari.likes || 0}
                                    </Button>
                                    <span className="flex items-center gap-2 text-muted-foreground">
                                        <Eye className="h-5 w-5" />
                                        {shayari.views || 0}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" onClick={handleBookmark}>
                                        <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
                                    </Button>
                                    <Button variant="ghost" size="icon" onClick={handleShare}>
                                        <Share2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </main>
    )
}
