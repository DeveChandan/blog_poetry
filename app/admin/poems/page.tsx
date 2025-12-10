"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AdminGuard } from "@/components/admin-guard"

interface Poem {
  _id: string
  title: string
  excerpt: string
  views: number
  createdAt: string
}

function AdminPoemsContent() {
  const [poems, setPoems] = useState<Poem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPoems() {
      try {
        const res = await fetch("/api/poems")
        if (res.ok) {
          const data = await res.json()
          setPoems(data)
        }
      } catch (error) {
        console.error("Failed to fetch poems:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPoems()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this poem?")) {
      try {
        const res = await fetch(`/api/poems/${id}`, { method: "DELETE" })
        if (res.ok) {
          setPoems(poems.filter((p) => p._id !== id))
        }
      } catch (error) {
        console.error("Failed to delete poem:", error)
      }
    }
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Poems</h1>
          <Button asChild>
            <Link href="/admin/poems/create">Create New</Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : poems.length === 0 ? (
          <div className="text-center text-muted-foreground">No poems yet</div>
        ) : (
          <div className="space-y-4">
            {poems.map((poem) => (
              <Card key={poem._id}>
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-foreground">{poem.title}</h3>
                    <p className="text-sm text-muted-foreground">Views: {poem.views}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="bg-transparent">
                      <Link href={`/admin/poems/${poem._id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(poem._id)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default function AdminPoemsPage() {
  return (
    <AdminGuard>
      <AdminPoemsContent />
    </AdminGuard>
  )
}
