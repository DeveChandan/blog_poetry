"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Review {
  _id: string
  comment: string
  rating: number
  userName: string
  createdAt: string
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch("/api/reviews")
        if (res.ok) {
          const data = await res.json()
          setReviews(data)
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Delete this review?")) {
      try {
        const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" })
        if (res.ok) {
          setReviews(reviews.filter((r) => r._id !== id))
        }
      } catch (error) {
        console.error("Failed to delete review:", error)
      }
    }
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Manage Reviews</h1>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : reviews.length === 0 ? (
          <div className="text-center text-muted-foreground">No reviews</div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review._id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="font-bold text-foreground">{review.userName}</p>
                      <p className="text-sm text-muted-foreground">{"⭐".repeat(review.rating)}</p>
                    </div>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(review._id)}>
                      Delete
                    </Button>
                  </div>
                  <p className="text-foreground">{review.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
