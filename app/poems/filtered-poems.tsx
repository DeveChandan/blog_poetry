"use client"

import { useState, useEffect } from "react"
import PoemCard from "@/components/poem-card"
import { Input } from "@/components/ui/input"

interface Poem {
  _id: string
  title: string
  excerpt: string
  tags: string[]
  views: number
  content: string;
  createdAt: string;
}

export default function FilteredPoems({ poems }: { poems: Poem[] }) {
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>(poems)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const filtered = poems.filter(
      (poem) =>
        poem.title.toLowerCase().includes(search.toLowerCase()) ||
        (poem.tags && poem.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()))),
    )
    setFilteredPoems(filtered)
  }, [search, poems])

  return (
    <div>
      <div className="mb-8">
        <Input
          placeholder="Search poems by title or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />
      </div>

      {filteredPoems.length === 0 ? (
        <div className="text-center text-muted-foreground">No poems found</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoems.map((poem) => (
             <PoemCard
              key={poem._id}
              id={poem._id}
              title={poem.title}
              excerpt={poem.excerpt}
              tags={poem.tags}
              views={poem.views}
              content={poem.content}
              createdAt={poem.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  )
}
