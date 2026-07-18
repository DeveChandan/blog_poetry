"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminGuard } from "@/components/admin-guard"

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  )
}

function AdminDashboardContent() {
  const [stats, setStats] = useState({
    poems: 0,
    books: 0,
    orders: 0,
    reviews: 0,
    quotes: 0,
    gallery: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        const [poemsRes, booksRes, ordersRes, reviewsRes, quotesRes, galleryRes] = await Promise.all([
          fetch("/api/poems"),
          fetch("/api/books"),
          fetch("/api/orders"),
          fetch("/api/reviews"),
          fetch("/api/quotes"),
          fetch("/api/gallery"),
        ])

        if (poemsRes.ok && booksRes.ok && ordersRes.ok && reviewsRes.ok) {
          const poems = await poemsRes.json()
          const books = await booksRes.json()
          const orders = await ordersRes.json()
          const reviews = await reviewsRes.json()
          const quotes = quotesRes.ok ? await quotesRes.json() : []
          const gallery = galleryRes.ok ? await galleryRes.json() : []

          setStats({
            poems: poems.length,
            books: books.length,
            orders: orders.length,
            reviews: reviews.length,
            quotes: quotes.length,
            gallery: gallery.length,
          })
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-foreground">Admin Dashboard</h1>
          <Button asChild>
            <Link href="/admin/logout">Logout</Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-12">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Poems</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.poems}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Books</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.books}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.orders}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.reviews}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Quotes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.quotes}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Total Gallery</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-primary">{stats.gallery}</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/admin/poems">Manage Poems</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin/poems/create">Create New Poem</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Books Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/admin/books">Manage Books</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin/books/create">Add New Book</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders & Sales</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/admin/orders">View All Orders</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Community</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/admin/reviews">Manage Reviews</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin/comments">Manage Comments</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin/contacts">View Contact Messages</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Videos Management Card */}
          <Card>
            <CardHeader>
              <CardTitle>Videos Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/admin/videos">Manage Videos</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin/videos/create">Add New Video</Link>
              </Button>
            </CardContent>
          </Card>

          {/* New Content Management */}
          <Card>
            <CardHeader>
              <CardTitle>Poetry & Blog</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/admin/shayari">Manage Shayari</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin/sher">Manage Sher</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin/quotes">Manage Quotes</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin/blogs">Manage Blogs</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin/gallery">Manage Gallery</Link>
              </Button>
            </CardContent>
          </Card>

          {/* Interactive & Home */}
          <Card>
            <CardHeader>
              <CardTitle>Interactive & Home</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button asChild className="w-full">
                <Link href="/admin/quiz">Manage Quiz</Link>
              </Button>
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/admin/sliders">Home Sliders</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Settings & Configuration */}
        <div className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Settings & Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full md:w-auto" size="lg">
                <Link href="/admin/settings">Manage About Section & Site Settings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
