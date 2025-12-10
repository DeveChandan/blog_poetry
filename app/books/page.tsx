"use client"

import { useEffect, useState } from "react"
import BookCard from "@/components/book-card"
import { Input } from "@/components/ui/input"

interface Book {
  _id: string
  title: string
  description: string
  price: number
  type: string
  cover: string
}

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([])
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books")
        const data = await res.json()
        if (Array.isArray(data)) { // Ensure data is an array
          setBooks(data)
          setFilteredBooks(data)
        } else {
          console.error("API returned non-array data:", data)
          setBooks([])
          setFilteredBooks([])
        }
      } catch (error) {
        console.error("Failed to fetch books:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  useEffect(() => {
    let filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.description.toLowerCase().includes(search.toLowerCase()),
    )

    if (typeFilter !== "all") {
      filtered = filtered.filter((book) => book.type === typeFilter)
    }

    setFilteredBooks(filtered)
  }, [search, typeFilter, books])

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-8">Books & E-books</h1>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Input
            placeholder="Search books..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-md"
          />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 rounded-md border border-border bg-background text-foreground"
          >
            <option value="all">All Types</option>
            <option value="physical">Paperback</option>
            <option value="ebook">E-book</option>
            <option value="both">Both</option>
          </select>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading books...</div>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center text-muted-foreground">No books found</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBooks.map((book) => (
              <BookCard key={book._id} id={book._id} {...book} />
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
