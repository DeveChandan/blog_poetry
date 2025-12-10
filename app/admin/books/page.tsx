"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AdminGuard } from "@/components/admin-guard"

interface Book {
  _id: string
  title: string
  price: number
  type: string
  stock?: number
}

function AdminBooksContent() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchBooks() {
      try {
        const res = await fetch("/api/books")
        if (res.ok) {
          const data = await res.json()
          setBooks(data)
        }
      } catch (error) {
        console.error("Failed to fetch books:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this book?")) {
      try {
        const res = await fetch(`/api/books/${id}`, { method: "DELETE" })
        if (res.ok) {
          setBooks(books.filter((b) => b._id !== id))
        }
      } catch (error) {
        console.error("Failed to delete book:", error)
      }
    }
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Manage Books</h1>
          <Button asChild>
            <Link href="/admin/books/create">Add Book</Link>
          </Button>
        </div>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : books.length === 0 ? (
          <div className="text-center text-muted-foreground">No books yet</div>
        ) : (
          <div className="space-y-4">
            {books.map((book) => (
              <Card key={book._id}>
                <CardContent className="p-6 flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-foreground">{book.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      ${book.price} • {book.type}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm" className="bg-transparent">
                      <Link href={`/admin/books/${book._id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(book._id)}>
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

export default function AdminBooksPage() {
  return (
    <AdminGuard>
      <AdminBooksContent />
    </AdminGuard>
  )
}
