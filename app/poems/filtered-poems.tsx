"use client"

import { useState, useEffect } from "react"
import PoemCard from "@/components/poem-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, X } from "lucide-react"

interface Poem {
  _id: string
  title: string
  excerpt: string
  tags: string[]
  views: number
  content: string
  createdAt: string
}

// Primary letters shown as buttons
const PRIMARY_LETTERS = ['All', 'A', 'B', 'C', 'D', 'E']
// Additional letters shown in dropdown
const MORE_LETTERS = ['F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

export default function FilteredPoems({ poems }: { poems: Poem[] }) {
  const [filteredPoems, setFilteredPoems] = useState<Poem[]>(poems)
  const [search, setSearch] = useState("")
  const [selectedLetter, setSelectedLetter] = useState<string>("All")
  const [dropdownOpen, setDropdownOpen] = useState(false)

  useEffect(() => {
    let filtered = poems

    // Apply alphabetical filter first
    if (selectedLetter && selectedLetter !== "All") {
      filtered = filtered.filter(
        (poem) => poem.title.charAt(0).toUpperCase() === selectedLetter
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
  }, [search, selectedLetter, poems])

  const handleLetterSelect = (letter: string) => {
    setSelectedLetter(letter)
    setDropdownOpen(false)
  }

  const clearFilter = () => {
    setSelectedLetter("All")
    setSearch("")
  }

  const isMoreLetterSelected = MORE_LETTERS.includes(selectedLetter)

  return (
    <div>
      {/* Search and Filter Controls */}
      <div className="mb-8 space-y-4">
        {/* Search Input */}
        <Input
          placeholder="Search poems by title or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-md"
        />

        {/* Alphabetical Filter Bar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Primary Letter Buttons */}
          {PRIMARY_LETTERS.map((letter) => (
            <Button
              key={letter}
              variant={selectedLetter === letter ? "default" : "outline"}
              size="sm"
              onClick={() => handleLetterSelect(letter)}
              className={`min-w-[40px] font-medium transition-all ${selectedLetter === letter
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "hover:bg-primary/10 hover:border-primary"
                }`}
            >
              {letter}
            </Button>
          ))}

          {/* More Letters Dropdown */}
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <Button
                variant={isMoreLetterSelected ? "default" : "outline"}
                size="sm"
                className={`min-w-[60px] font-medium ${isMoreLetterSelected
                    ? "bg-primary text-primary-foreground"
                    : ""
                  }`}
              >
                {isMoreLetterSelected ? selectedLetter : "More"}
                <ChevronDown className="ml-1 h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              className="w-[280px] p-2"
            >
              <div className="grid grid-cols-7 gap-1">
                {MORE_LETTERS.map((letter) => (
                  <DropdownMenuItem
                    key={letter}
                    onClick={() => handleLetterSelect(letter)}
                    className={`flex items-center justify-center p-2 cursor-pointer rounded-md ${selectedLetter === letter
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-primary/10"
                      }`}
                  >
                    {letter}
                  </DropdownMenuItem>
                ))}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filter Button */}
          {(selectedLetter !== "All" || search) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilter}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>

        {/* Active Filter Indicator */}
        {selectedLetter !== "All" && (
          <p className="text-sm text-muted-foreground">
            Showing poems starting with "{selectedLetter}"
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
          <p className="text-muted-foreground text-lg mb-4">No poems found</p>
          <Button variant="outline" onClick={clearFilter}>
            Clear filters
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
              content={poem.content}
              createdAt={poem.createdAt}
            />
          ))}
        </div>
      )}
    </div>
  )
}
