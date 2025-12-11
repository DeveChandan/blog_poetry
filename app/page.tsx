import Link from "next/link"
import { Suspense } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  PenTool, 
  Users, 
  Calendar, 
  ArrowRight,
  Sparkles,
  Heart,
  Quote,
  Feather,
  Coffee,
  TrendingUp,
  Notebook,
  Star
} from "lucide-react"

import { connectDB } from "@/lib/db"

async function getFeaturedPoems() {
  const db = await connectDB()
  let poems = await db.collection("poems").find({ featured: true }).sort({ createdAt: -1 }).limit(3).toArray()
  if (poems.length === 0) {
    poems = await db.collection("poems").find({}).sort({ createdAt: -1 }).limit(3).toArray()
  }
  return poems
}

async function getRecentBooks() {
  const db = await connectDB()
  return db.collection("books").find({}).sort({ createdAt: -1 }).limit(2).toArray()
}

async function getFeaturedVideos() {
  const db = await connectDB()
  let videos = await db.collection("videos").find({ featured: true }).sort({ createdAt: -1 }).limit(3).toArray()
  // If no featured videos, get any 3 recent videos
  if (videos.length === 0) {
    videos = await db.collection("videos").find({}).sort({ createdAt: -1 }).limit(3).toArray()
  }

  const serializedVideos = videos.map(video => ({
    ...video,
    _id: video._id.toString(),
    createdAt: video.createdAt?.toISOString(),
  }))
  console.log("Fetched featured videos:", serializedVideos)
  return serializedVideos
}
async function getStats() {
  const db = await connectDB()
  const totalPoems = await db.collection("poems").countDocuments()
  const booksPublished = await db.collection("books").countDocuments()
  const totalReaders = await db.collection("users").countDocuments(); 
  const totalVideos = await db.collection("videos").countDocuments();
  const yearsWriting = new Date().getFullYear() - 2016; 

  return {
    totalPoems,
    booksPublished,
    totalReaders,
    totalVideos,
    yearsWriting,
  }
}

const testimonials = [
    {
      content: "Reading Chandan's poetry is like finding a quiet corner in a noisy world. Each verse resonates deeply.",
      author: "Priya Sharma",
      role: "Literature Professor"
    },
    {
      content: "The way emotions are woven into words is simply breathtaking. A must-read for poetry lovers!",
      author: "Rahul Mehta",
      role: "Book Critic"
    },
    {
      content: "Modern poetry at its finest. Relatable, profound, and beautifully crafted.",
      author: "Anjali Patel",
      role: "Author"
    }
  ]
const categories = [
    { name: "Nature", icon: Sparkles, count: 42 },
    { name: "Love", icon: Heart, count: 38 },
    { name: "Urban Life", icon: TrendingUp, count: 28 },
    { name: "Reflections", icon: Coffee, count: 34 },
    { name: "Haiku", icon: Feather, count: 56 }
  ]

function Hero() {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/10 z-0" />
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
      </div>
      <div className="relative z-10 max-w-6xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
          <Sparkles className="h-4 w-4" />
          <span className="text-sm font-medium">Welcome to My Literary World</span>
        </div>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          Where <span className="text-primary">Words</span> Paint<br />
          <span className="relative">
            Emotions
            <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
          Dive into a collection of modern poetry, heartfelt verses, and literary explorations by Chandan Mondal — where technology meets creativity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="group">
            <Link href="/poems" className="flex items-center gap-2">
              <PenTool className="h-5 w-5" />
              Explore Poems
              <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="group">
            <Link href="/about" className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              About the Author
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function StatsSection({ stats }: { stats: any }) {
  return (
    <section className="py-16 bg-card/50 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard icon={PenTool} value={stats.totalPoems} label="Poems Published" />
          <StatCard icon={Users} value={stats.totalReaders.toLocaleString()} label="Readers Worldwide" />
          <StatCard icon={BookOpen} value={stats.booksPublished} label="Published Books" />
        
          <StatCard icon={Calendar} value={`${stats.yearsWriting}+`} label="Years Writing" />
        </div>
      </div>
    </section>
  )
}

function StatCard({ icon: Icon, value, label }: { icon: any, value: string | number, label: string }) {
  return (
    <div className="text-center p-6 rounded-xl bg-background border hover:border-primary/50 transition-colors">
      <div className="text-3xl md:text-4xl font-bold text-primary mb-2">{value}</div>
      <div className="text-sm text-muted-foreground flex items-center justify-center gap-2">
        <Icon className="h-4 w-4" />
        {label}
      </div>
    </div>
  )
}

function FeaturedPoems({ poems }: { poems: any[] }) {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Featured <span className="text-primary">Poems</span>
            </h2>
            <p className="text-muted-foreground">Handpicked verses that capture the essence of emotion and experience</p>
          </div>
          <Button variant="ghost" asChild className="group">
            <Link href="/poems" className="flex items-center gap-2">
              View All
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {poems.map((poem) => (
            <Card key={poem._id} className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{poem.tags?.[0] || 'General'}</Badge>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {new Date(poem.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{poem.title}</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed italic line-clamp-3">"{poem.excerpt}"</p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1 text-muted-foreground"><Heart className="h-4 w-4" />{poem.views || 0}</span>
                    <span className="flex items-center gap-1 text-muted-foreground"><BookOpen className="h-4 w-4" />{Math.ceil(poem.content.split(' ').length / 200)} min read</span>
                  </div>
                  <Link href={`/poems/${poem._id}`} className="text-primary hover:underline font-medium flex items-center gap-1">
                    Read Full
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function RecentBooks({ books }: { books: any[] }) {
    if (books.length === 0) return null
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                Published <span className="text-primary">Books</span>
              </h2>
              <p className="text-muted-foreground">Collections of poetry and literary works in print and digital</p>
            </div>
            <Button variant="ghost" asChild className="group">
              <Link href="/books" className="flex items-center gap-2">
                View All Books
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>
        <div className="grid md:grid-cols-2 gap-8">
          {books.map((book) => (
            <Card key={book._id} className="group overflow-hidden hover:shadow-xl transition-shadow">
               <div className="md:flex">
                    <div className="md:w-1/3 p-6 flex items-center justify-center">
                      <div className="relative w-48 h-64 rounded-lg overflow-hidden shadow-lg">
                        <img
                          src={book.cover || '/placeholder.jpg'}
                          alt={book.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                         <div className="absolute top-3 right-3">
                          <Badge className="bg-primary/90 backdrop-blur-sm">
                            <Star className="h-3 w-3 mr-1" />
                            {book.rating || "N/A"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="md:w-2/3 p-6">
                      <Badge variant="outline" className="mb-3">{book.tags?.[0] || 'Book'}</Badge>
                      <h3 className="text-2xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">{book.title}</h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{book.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Published {new Date(book.createdAt).getFullYear()}
                        </span>
                        <Button asChild size="sm">
                          <Link href={`/books/${book._id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedVideos({ videos }: { videos: any[] }) {
    if (videos.length === 0) {
        return (
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto text-center text-muted-foreground">
                    No featured videos found at the moment.
                </div>
            </section>
        )
    }
    return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Featured <span className="text-primary">Videos</span>
            </h2>
            <p className="text-muted-foreground">Visual journeys through poetry and literary insights</p>
          </div>  
          <Button variant="ghost" asChild className="group">
            <Link href="/videos" className="flex items-center gap-2">
              View All Videos
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <Card key={video._id} className="group cursor-pointer overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-border/50">
              <CardContent className="p-0">
                <div className="relative pb-[56.25%] overflow-hidden rounded-t-lg">
                  <iframe
                    src={`https://www.youtube.com/embed/${video.videoId}`}
                    title={video.title}
                    className="absolute top-0 left-0 w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">{video.title}</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed line-clamp-3">{video.description}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-muted-foreground"><Users className="h-4 w-4" />{video.views || 0} views</span>
                    <Link href={`/videos/${video._id}`} className="text-primary hover:underline font-medium flex items-center gap-1">
                      Watch Video
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
function CategoriesSection() {
    return (
         <section className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Explore by <span className="text-primary">Theme</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover poems that resonate with your mood and moments
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/poems?category=${category.name.toLowerCase()}`}
                className="group"
              >
                <div className="aspect-square rounded-xl bg-background border border-border/50 p-6 flex flex-col items-center justify-center text-center hover:border-primary hover:bg-primary/5 transition-all duration-300 hover:scale-105">
                  <div className="p-3 rounded-lg bg-primary/10 text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <category.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.count} poems</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    )
}

function TestimonialsSection() {
    return (
         <section className="py-20 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Quote className="h-4 w-4" />
              <span className="text-sm font-medium">What Readers Say</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Voices from the <span className="text-primary">Community</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative overflow-hidden border-border/50">
                <CardContent className="p-6">
                  <div className="text-4xl text-primary/20 mb-4">"</div>
                  <p className="text-muted-foreground mb-6 italic leading-relaxed">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-bold text-primary">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{testimonial.author}</h4>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
}

function CTASection() {
    return (
         <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative">
            <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
              <div className="w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
            </div>
            
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-primary/10 via-background to-purple-500/5">
              <CardContent className="pt-16 pb-16 px-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-primary mb-6">
                  <Notebook className="h-4 w-4" />
                  <span className="text-sm font-medium">Join the Journey</span>
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Stay Connected with the Words
                </h2>
                
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
                  Subscribe to receive new poems, writing insights, and literary updates directly in your inbox.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="flex-1 px-4 py-3 rounded-lg bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                  <Button size="lg" className="whitespace-nowrap">
                    Subscribe
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
                
                <p className="text-sm text-muted-foreground mt-6">
                  No spam, only poetry. Unsubscribe anytime.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
}

export default async function Home() {
  const stats = await getStats()
  const featuredPoems = await getFeaturedPoems()
  const recentBooks = await getRecentBooks()

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      <Hero />
      <StatsSection stats={stats} />
      <Suspense fallback={<div className="text-center p-12">Loading poems...</div>}>
         <FeaturedPoems poems={featuredPoems} />
      </Suspense>
     <Suspense fallback={<div className="text-center p-12">Loading books...</div>}>
        <RecentBooks books={recentBooks} />
      </Suspense>
      <Suspense fallback={<div className="text-center p-12">Loading videos...</div>}>
        <FeaturedVideos videos={await getFeaturedVideos()} />
      </Suspense>
      <CategoriesSection />
      <TestimonialsSection />
      <CTASection />
    </main>
  )
}