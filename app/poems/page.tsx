"use client"

import { useEffect, useState } from "react"
import PoemCard from "@/components/poem-card"
import { Input } from "@/components/ui/input"

interface Poem {
  _id: string
  title: string
  excerpt: string
  tags: string[]
  views: number
}

export default function PoemsPage() {
  const [poems, setPoems] = useState<Poem[]>([])
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPoems() {
      try {
        const res = await fetch("/api/poems")
        const data = await res.json()
        setPoems(data)
        setFilteredPoems(data)
      } catch (error) {
        console.error("Failed to fetch poems:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPoems()
  }, [])

  useEffect(() => {
    const filtered = poems.filter(
      (poem) =>
        poem.title.toLowerCase().includes(search.toLowerCase()) ||
        poem.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())),
    )
    setFilteredPoems(filtered)
  }, [search, poems])

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">My Poems</h1>

        <div className="mb-8">
          <Input
            placeholder="Search poems by title or tag..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-md"
          />
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading poems...</div>
        ) : filteredPoems.length === 0 ? (
          <div className="text-center text-muted-foreground">No poems found</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPoems.map((poem) => (
              <PoemCard key={poem._id} id={poem._id} {...poem} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
