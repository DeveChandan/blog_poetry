"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Review {
  _id: string
  rating: number
  comment: string
  userName: string
  createdAt: string
}

interface ReviewsSectionProps {
  contentId: string
  contentType: "poem" | "book"
}

export default function ReviewsSection({ contentId, contentType }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await fetch(`/api/reviews?contentId=${contentId}&contentType=${contentType}`)
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
  }, [contentId, contentType])

  const handleSubmitReview = async () => {
    if (!comment.trim()) {
      alert("Please write a review")
      return
    }

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId, contentType, rating, comment }),
      })

      if (res.ok) {
        setComment("")
        setRating(5)
        // Refetch reviews
        const reviewRes = await fetch(`/api/reviews?contentId=${contentId}&contentType=${contentType}`)
        if (reviewRes.ok) {
          const data = await reviewRes.json()
          setReviews(data)
        }
      } else {
        alert("Please login to submit a review")
      }
    } catch (error) {
      console.error("Failed to submit review:", error)
    }
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold text-foreground mb-6">Reviews</h2>

      {/* Review Form */}
      <Card className="mb-8">
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-2 block">Rating</label>
            <select
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r} Star{r !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2 rounded border border-border bg-background text-foreground min-h-24"
          />
          <Button onClick={handleSubmitReview}>Submit Review</Button>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet</p>
        ) : (
          reviews.map((review) => (
            <Card key={review._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-bold text-foreground">{review.userName}</p>
                    <p className="text-sm text-muted-foreground">{"⭐".repeat(review.rating)}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{new Date(review.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="text-foreground">{review.comment}</p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
