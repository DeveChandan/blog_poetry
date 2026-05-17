"use client"

import { useState, useEffect } from "react"
import PoemCard from "@/components/poem-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useTranslations } from "@/lib/language-context"
import { X } from "lucide-react"

interface Poem {
  _id: string
  title: string
  excerpt: string
  tags: string[]
  views: number
  content: string
  createdAt: string
}

export default function FilteredPoems({ poems }: { poems: Poem[] }) {
  const { t } = useTranslations()
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>(poems)
  const [search, setSearch] = useState("")
  const [selectedTag, setSelectedTag] = useState<string>("All")
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    // Extract unique, non-empty tags from all poems
    const uniqueTags = Array.from(
      new Set(
        poems
          .flatMap((poem) => poem.tags || [])
          .map((tag) => tag.trim())
          .filter((tag) => tag.length > 0)
      )
    ).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }))
    setTags(uniqueTags)
  }, [poems])

  useEffect(() => {
    let filtered = poems

    // Apply tag filter first
    if (selectedTag && selectedTag !== "All") {
      filtered = filtered.filter(
        (poem) => poem.tags && poem.tags.some(tag => tag.toLowerCase() === selectedTag.toLowerCase())
      )
    }

    // Then apply search filter
    if (search) {
      filtered = filtered.filter(
        (poem) =>
          poem.title.toLowerCase().includes(search.toLowerCase()) ||
          (poem.tags && poem.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())))
      )
    }

    setFilteredPoems(filtered)
  }, [search, selectedTag, poems])

  const clearFilter = () => {
    setSelectedTag("All")
    setSearch("")
  }

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <Input
          placeholder={t('search') + "..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        {/* Tags Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={selectedTag === "All" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag("All")}
            className={`min-w-[50px] font-medium transition-all rounded-full ${
              selectedTag === "All"
                ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/95"
                : "hover:bg-primary/10 hover:border-primary text-muted-foreground hover:text-primary bg-transparent"
            }`}
          >
            {t('all')}
          </Button>

          {tags.map((tag) => (
            <Button
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedTag(tag)}
              className={`font-medium transition-all rounded-full ${
                selectedTag === tag
                  ? "bg-primary text-primary-foreground shadow-md hover:bg-primary/95"
                  : "hover:bg-primary/10 hover:border-primary text-muted-foreground hover:text-primary bg-transparent"
              }`}
            >
              #{tag}
            </Button>
          ))}

          {/* Clear Filter Button */}
          {(selectedTag !== "All" || search) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilter}
              className="text-muted-foreground hover:text-foreground rounded-full"
            >
              <X className="h-4 w-4 mr-1" />
              {t('clear')}
            </Button>
          )}
        </div>

        {/* Active Filter Indicator */}
        {selectedTag !== "All" && (
          <p className="text-sm text-muted-foreground">
            Showing poems tagged with <span className="font-semibold text-primary">#{selectedTag}</span>
            {search && ` matching "${search}"`}
            <span className="ml-2 text-primary font-medium">
              ({filteredPoems.length} {filteredPoems.length === 1 ? 'poem' : 'poems'})
            </span>
          </p>
        )}
      </div>

      {/* Poems Grid */}
      {filteredPoems.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg mb-4">{t('noResults')}</p>
          <Button variant="outline" onClick={clearFilter}>
            {t('clear')}
          </Button>
        </div>
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
            />
          ))}
        </div>
      )}
    </div>
  )
}
