"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  BookOpen,
  PenTool,
  Video,
  Globe,
  Mail,
  Twitter,
  Instagram,
  Facebook,
  Youtube,
  Feather,
  Quote
} from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslations } from "@/lib/language-context"

interface DataItem {
  _id: string
  title: string
  excerpt?: string
  description?: string
  thumbnail?: string
  cover?: string
  createdAt: string
  slug?: string
}

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const [recentVideos, setRecentVideos] = useState<DataItem[]>([])
  const [recentPoems, setRecentPoems] = useState<DataItem[]>([])
  const [recentBlogs, setRecentBlogs] = useState<DataItem[]>([])
  const { t } = useTranslations()

  const [settings, setSettings] = useState<any>({})

  useEffect(() => {
    async function fetchData() {
      try {
        const [videosRes, poemsRes, blogsRes, settingsRes] = await Promise.all([
          fetch("/api/videos?limit=3"),
          fetch("/api/poems?limit=3"),
          fetch("/api/blogs?limit=3"),
          fetch("/api/settings")
        ])

        if (videosRes.ok) setRecentVideos(await videosRes.json())
        if (poemsRes.ok) setRecentPoems(await poemsRes.json())
        if (blogsRes.ok) setRecentBlogs(await blogsRes.json())
        if (settingsRes.ok) setSettings(await settingsRes.json())

      } catch (error) {
        console.error("Failed to fetch data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen bg-background py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
          <div className="h-64 bg-muted rounded-xl"></div>
          <div className="h-40 bg-muted rounded-xl"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/10 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-20">

        {/* Hero / About Section */}
        <section className="grid md:grid-cols-[1fr_2fr] gap-12 items-start">
          <div className="relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-xl border-4 border-background bg-muted">
              {settings.authorImage ? (
                <img
                  src={settings.authorImage}
                  alt={settings.authorBio || "Dr. Rupesh Kumar Singh"}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary">
                  <span className="text-6xl">👨‍🏫</span>
                </div>
              )}
            </div>
            <div className="absolute -bottom-6 -right-6 bg-card p-4 rounded-xl shadow-lg border border-border">
              <div className="flex gap-4 text-primary">
                {/* YouTube Link - Supports both legacy channel handle and full URL */}
                {(settings.youtube || settings.youtubeChannel) && (
                  <a
                    href={settings.youtube || `https://youtube.com/${settings.youtubeChannel}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-primary/80 transition-colors"
                  >
                    <Youtube className="h-6 w-6" />
                  </a>
                )}
                {settings.instagram && (
                  <a href={settings.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-primary/80 transition-colors">
                    <Instagram className="h-6 w-6" />
                  </a>
                )}
                {settings.facebook && (
                  <a href={settings.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-primary/80 transition-colors">
                    <Facebook className="h-6 w-6" />
                  </a>
                )}
                {settings.twitter && (
                  <a href={settings.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-primary/80 transition-colors">
                    <Twitter className="h-6 w-6" />
                  </a>
                )}
                {settings.linkedin && (
                  <a href={settings.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-primary/80 transition-colors">
                    <Globe className="h-6 w-6" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-primary font-serif font-medium text-xl mb-2">{t("aboutAuthor")}</h2>
              <h1 className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-4">
                Dr. Rupesh Kumar Singh
              </h1>
              <div className="h-1 w-20 bg-primary rounded-full"></div>
            </div>

            <div className="prose prose-lg dark:prose-invert text-muted-foreground">
              <p className="lead text-xl text-foreground font-medium">
                {t("about_p1")}
              </p>
              <p>{t("about_p2")}</p>
              <p>{t("about_p3")}</p>
              <p>{t("about_p4")}</p>
              <p>{t("about_p5")}</p>
              <p className="font-medium text-foreground italic">
                {t("about_p6")}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="font-serif gap-2" asChild>
                <a href={`mailto:${settings.email || 'contact@example.com'}`}>
                  <Mail className="h-4 w-4" />
                  {t("contactMe")}
                </a>
              </Button>
              <Button variant="outline" className="font-serif gap-2" asChild>
                <Link href="/poems">
                  <Feather className="h-4 w-4" />
                  {t("readPoemsContent")}
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Latest Videos */}
        {recentVideos.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-3xl font-serif font-bold flex items-center gap-3">
                <Video className="h-6 w-6 text-primary" />
                {t("latestVideos")}
              </h2>
              <Button variant="ghost" className="text-primary" asChild>
                <Link href="/videos">{t("viewAll")}</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recentVideos.map(video => (
                <Link href={`/videos/${video._id}`} key={video._id} className="group">
                  <div className="aspect-video rounded-xl overflow-hidden bg-muted mb-3">
                    {video.thumbnail ? (
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5"><Video className="h-10 w-10 text-primary/20" /></div>
                    )}
                  </div>
                  <h3 className="font-bold group-hover:text-primary transition-colors line-clamp-2">{video.title}</h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Latest Poems */}
        {recentPoems.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-3xl font-serif font-bold flex items-center gap-3">
                <Feather className="h-6 w-6 text-primary" />
                {t("recentPoemsTitle")}
              </h2>
              <Button variant="ghost" className="text-primary" asChild>
                <Link href="/poems">{t("readMore")}</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recentPoems.map(poem => (
                <Card key={poem._id} className="hover:shadow-lg transition-all hover:-translate-y-1">
                  <CardContent className="p-6 space-y-4">
                    <Quote className="h-8 w-8 text-primary/20" />
                    <div>
                      <h3 className="text-xl font-bold font-serif mb-2">{poem.title}</h3>
                      <p className="text-muted-foreground line-clamp-3 text-sm italic">
                        {poem.excerpt || "Click to read full poem..."}
                      </p>
                    </div>
                    <Button variant="link" className="p-0 h-auto text-primary" asChild>
                      <Link href={`/poems/${poem._id}`}>Read Full Poem &rarr;</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Latest Blogs */}
        {recentBlogs.length > 0 && (
          <section className="space-y-8">
            <div className="flex items-center justify-between border-b pb-4">
              <h2 className="text-3xl font-serif font-bold flex items-center gap-3">
                <BookOpen className="h-6 w-6 text-primary" />
                {t("latestFromBlog")}
              </h2>
              <Button variant="ghost" className="text-primary" asChild>
                <Link href="/blog">{t("viewAll")}</Link>
              </Button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {recentBlogs.map(blog => (
                <Link href={`/blog/${blog.slug || blog._id}`} key={blog._id} className="group block">
                  <div className="aspect-[16/9] rounded-xl overflow-hidden bg-muted mb-4 shadow-sm">
                    {blog.cover ? (
                      <img src={blog.cover} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-primary/5 text-primary/20"><BookOpen className="h-10 w-10" /></div>
                    )}
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{blog.title}</h3>
                  <p className="text-muted-foreground line-clamp-2 text-sm">{blog.excerpt || blog.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

      </div>
    </main>
  )
}
