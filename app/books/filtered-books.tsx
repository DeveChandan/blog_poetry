"use client"

import { useState, useEffect } from "react"
import BookCard from "@/components/book-card"
import { Input } from "@/components/ui/input"

interface Book {
  _id: string
  title: string
  description: string
  price: number
  type: string
  cover: string
  // Add other properties that are used in BookCard or filtering
  rating?: number;
  publishedYear?: number;
  tags?: string[];
  createdAt?: string;
}

export default function FilteredBooks({ books }: { books: Book[] }) {
  const [filteredBooks, setFilteredBooks] = useState<Book[]>(books)
  const [search, setSearch] = useState("")
  const [typeFilter, setTypeFilter] = useState("all")

  useEffect(() => {
    let filtered = books.filter(
      (book) =>
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.description.toLowerCase().includes(search.toLowerCase()) ||
        (book.tags && book.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase())))
    )

    if (typeFilter !== "all") {
      filtered = filtered.filter((book) => book.type === typeFilter)
    }

    setFilteredBooks(filtered)
  }, [search, typeFilter, books])

  return (
    <div>
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

      {filteredBooks.length === 0 ? (
        <div className="text-center text-muted-foreground">No books found</div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBooks.map((book) => (
            <BookCard
              key={book._id}
              id={book._id}
              title={book.title}
              description={book.description}
              price={book.price}
              type={book.type}
              cover={book.cover}
              // Pass other props if needed by BookCard
              rating={book.rating}
              publishedYear={book.publishedYear}
            />
          ))}
        </div>
      )}
    </div>
  )
}
