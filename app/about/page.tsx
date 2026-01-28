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
              <h2 className="text-primary font-serif font-medium text-xl mb-2">About the Author</h2>
              <h1 className="text-4xl md:text-5xl font-bold font-serif text-foreground mb-4">
                Dr. Rupesh Kumar Singh
              </h1>
              <div className="h-1 w-20 bg-primary rounded-full"></div>
            </div>

            <div className="prose prose-lg dark:prose-invert text-muted-foreground">
              <p className="lead text-xl text-foreground font-medium">
                संवेदना, स्मृति और शब्द - ये तीन तत्व डॉ. रूपेश कुमार सिंह की लेखनी की आत्मा हैं।
              </p>
              <p>
                उनका लेखन जीवन के उन कोनों से जन्म लेता है, जहाँ भावनाएँ शब्दों से पहले जागती हैं, और फिर कविता, ग़ज़ल या कहानी बनकर पाठक के मन में अपनी गहरी छाप छोड़ जाती हैं।
              </p>
              <p>
                डॉ. सिंह ने इनफॉर्मेशन टेक्नोलॉजी के क्षेत्र में अपनी गहन दृष्टि और नेतृत्व से एक अलग पहचान बनाई है। आज वे Big 4 में Partner के रूप में कार्यरत हैं - जहाँ वे दुनिया भर की यात्राएँ करते हुए नई संस्कृतियों, अनुभवों और मानवीय पहलुओं को आत्मसात करते हैं।
              </p>
              <p>
                परंतु सफलता के इस शिखर पर भी उनके भीतर का लेखक अब भी जीवित, सजग और संवेदनशील है - जो हर यात्रा, हर मिलन, हर बिछोह से एक नया अर्थ खोज लेता है। उनके लिए साहित्य केवल अभिव्यक्ति नहीं, बल्कि आत्मा की वह भाषा है जो शब्दों से नहीं, संवेदनाओं से बोली जाती है।
              </p>
              <p>
                उनकी कविताएँ और कहानियाँ स्मृतियों की रौशनी में डूबकर प्रेम, वियोग और जीवन के गहरे अर्थों को उजागर करती हैं। “अब सब याद आता है, छूटे हुए का दर्द बहुत सताता है” जैसी कविताएँ और “स्मृतियों की रोशनी” जैसी रचनाएँ इस बात का प्रमाण हैं कि उनके शब्द अँधेरे को मिटाते नहीं, बल्कि उसे सुंदर बना देते हैं।
              </p>
              <p className="font-medium text-foreground italic">
                डॉ. रूपेश कुमार सिंह का लेखन एक ऐसी यात्रा है - जहाँ पाठक अपने भीतर झाँकता है, और हर स्मृति एक नई रौशनी बनकर झिलमिला उठती है।
              </p>
            </div>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button className="font-serif gap-2" asChild>
                <a href={`mailto:${settings.email || 'contact@example.com'}`}>
                  <Mail className="h-4 w-4" />
                  Contact Me
                </a>
              </Button>
              <Button variant="outline" className="font-serif gap-2" asChild>
                <Link href="/poems">
                  <Feather className="h-4 w-4" />
                  Read Poems
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
                Latest Videos
              </h2>
              <Button variant="ghost" className="text-primary" asChild>
                <Link href="/videos">View All</Link>
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
                Recent Poems
              </h2>
              <Button variant="ghost" className="text-primary" asChild>
                <Link href="/poems">Read More</Link>
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
                Latest from Blog
              </h2>
              <Button variant="ghost" className="text-primary" asChild>
                <Link href="/blog">Visit Blog</Link>
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
