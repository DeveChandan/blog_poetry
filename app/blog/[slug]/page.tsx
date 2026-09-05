"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Eye, Clock, Share2, Bookmark, Heart } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useLanguage } from "@/lib/language-context"
import { getGoogleDriveDirectLink } from "@/lib/gallery-utils"

interface Blog {
    _id: string
    title: string
    slug: string
    content: string
    excerpt: string
    image: string
    tags: string[]
    category: string
    views: number
    likes: number
    createdAt: string
}

export default function BlogDetailPage() {
    const params = useParams()
    const slug = params.slug as string
    const [blog, setBlog] = useState<Blog | null>(null)
    const [loading, setLoading] = useState(true)
    const [isLiked, setIsLiked] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)

    // Translation
    const { currentLanguage } = useLanguage()
    const [translatedContent, setTranslatedContent] = useState<string | null>(null)
    const [translatedTitle, setTranslatedTitle] = useState<string | null>(null)
    const [isTranslating, setIsTranslating] = useState(false)

    useEffect(() => {
        async function fetchBlog() {
            try {
                const res = await fetch(`/api/blogs/${slug}`)
                if (res.ok) {
                    const data = await res.json()
                    setBlog(data)

                    const liked = localStorage.getItem(`blog_like_${data._id}`)
                    const bookmarked = localStorage.getItem(`blog_bookmark_${data._id}`)
                    setIsLiked(!!liked)
                    setIsBookmarked(!!bookmarked)
                }
            } catch (error) {
                console.error("Failed to fetch blog:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchBlog()
    }, [slug])

    // Auto-translate when language changes
    useEffect(() => {
        if (!blog) return

        const translateBlog = async () => {
            if (currentLanguage.code === 'en') {
                if (/[\u0900-\u097F]/.test(blog.title) || /[\u0900-\u097F]/.test(blog.content)) {
                    setIsTranslating(true)
                    try {
                        const [titleRes, contentRes] = await Promise.all([
                            fetch('/api/translate', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ text: blog.title, targetLang: 'en' })
                            }),
                            fetch('/api/translate', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ text: blog.content, targetLang: 'en' })
                            })
                        ])
                        const [titleData, contentData] = await Promise.all([titleRes.json(), contentRes.json()])

                        if (titleData.translatedText) setTranslatedTitle(titleData.translatedText)
                        if (contentData.translatedText) setTranslatedContent(contentData.translatedText)
                    } catch (error) {
                        console.error('Translation error:', error)
                    } finally {
                        setIsTranslating(false)
                    }
                } else {
                    setTranslatedContent(null)
                    setTranslatedTitle(null)
                }
                return
            }

            setIsTranslating(true)
            try {
                const [titleRes, contentRes] = await Promise.all([
                    fetch('/api/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: blog.title, targetLang: currentLanguage.code })
                    }),
                    fetch('/api/translate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ text: blog.content, targetLang: currentLanguage.code })
                    })
                ])
                const [titleData, contentData] = await Promise.all([titleRes.json(), contentRes.json()])

                if (titleData.translatedText) setTranslatedTitle(titleData.translatedText)
                if (contentData.translatedText) setTranslatedContent(contentData.translatedText)
            } catch (error) {
                console.error('Translation error:', error)
            } finally {
                setIsTranslating(false)
            }
        }

        translateBlog()
    }, [currentLanguage.code, blog?._id])

    const handleLike = () => {
        if (!blog) return
        if (isLiked) {
            localStorage.removeItem(`blog_like_${blog._id}`)
            setIsLiked(false)
        } else {
            localStorage.setItem(`blog_like_${blog._id}`, 'true')
            setIsLiked(true)
            toast.success("Added to likes!")
        }
    }

    const handleBookmark = () => {
        if (!blog) return
        if (isBookmarked) {
            localStorage.removeItem(`blog_bookmark_${blog._id}`)
            setIsBookmarked(false)
        } else {
            localStorage.setItem(`blog_bookmark_${blog._id}`, 'true')
            setIsBookmarked(true)
            toast.success("Bookmarked!")
        }
    }

    const handleShare = async () => {
        try {
            await navigator.share({
                title: blog?.title,
                text: blog?.excerpt,
                url: window.location.href
            })
        } catch {
            navigator.clipboard.writeText(window.location.href)
            toast.success("Link copied!")
        }
    }

    const getReadingTime = () => {
        if (!blog) return 0
        const words = blog.content.split(/\s+/).length
        return Math.ceil(words / 200)
    }

    if (loading) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="animate-pulse">Loading...</div>
            </main>
        )
    }

    if (!blog) {
        return (
            <main className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-muted-foreground text-lg">Blog not found</p>
                    <Button asChild className="mt-4">
                        <Link href="/blog">Back to Blog</Link>
                    </Button>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Hero Image */}
            {blog.image && (
                <div className="relative h-[40vh] md:h-[50vh] w-full">
                    <img
                        src={getGoogleDriveDirectLink(blog.image)}
                        alt={blog.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                {/* Back Button */}
                <Button variant="secondary" asChild className="mb-8">
                    <Link href="/blog" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog
                    </Link>
                </Button>

                <motion.article
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-card rounded-2xl shadow-xl p-8 md:p-12"
                >
                    {/* Category & Tags */}
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                        <Badge>{blog.category}</Badge>
                        {blog.tags?.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline">{tag}</Badge>
                        ))}
                    </div>

                    {/* Title */}
                    <h1
                        className={`text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight ${isTranslating ? 'opacity-70' : ''}`}
                        dir={currentLanguage.rtl ? 'rtl' : 'ltr'}
                    >
                        {translatedTitle || blog.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-8 pb-8 border-b">
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                month: 'long',
                                day: 'numeric',
                                year: 'numeric'
                            })}
                        </span>
                        <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {getReadingTime()} min read
                        </span>
                        <span className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {blog.views} views
                        </span>
                    </div>

                    {/* Content */}
                    <div
                        className={`blog-content max-w-none ${isTranslating ? 'opacity-70' : ''}`}
                        dir={currentLanguage.rtl ? 'rtl' : 'ltr'}
                    >
                        {(() => {
                            const rawContent = translatedContent || blog.content;
                            const isHtml = /<\/?[a-z][\s\S]*>/i.test(rawContent);
                            if (isHtml) {
                                return <div dangerouslySetInnerHTML={{ __html: rawContent }} />;
                            } else {
                                return rawContent.split('\n').map((paragraph, i) => (
                                    <p key={i} className="mb-4 leading-relaxed">
                                        {paragraph}
                                    </p>
                                ));
                            }
                        })()}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between mt-12 pt-8 border-t">
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={handleLike}
                                className={isLiked ? 'text-red-500' : ''}
                            >
                                <Heart className={`h-5 w-5 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                                Like
                            </Button>
                            <Button variant="ghost" size="sm" onClick={handleBookmark}>
                                <Bookmark className={`h-5 w-5 mr-2 ${isBookmarked ? 'fill-primary text-primary' : ''}`} />
                                Save
                            </Button>
                        </div>
                        <Button variant="ghost" size="sm" onClick={handleShare}>
                            <Share2 className="h-5 w-5 mr-2" />
                            Share
                        </Button>
                    </div>
                </motion.article>
            </div>
        </main>
    )
}
