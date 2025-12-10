"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Comment {
  _id: string
  comment: string
  userName: string
  createdAt: string
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch("/api/comments")
        if (res.ok) {
          const data = await res.json()
          setComments(data)
        }
      } catch (error) {
        console.error("Failed to fetch comments:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchComments()
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm("Delete this comment?")) {
      try {
        const res = await fetch(`/api/comments/${id}`, { method: "DELETE" })
        if (res.ok) {
          setComments(comments.filter((c) => c._id !== id))
        }
      } catch (error) {
        console.error("Failed to delete comment:", error)
      }
    }
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Manage Comments</h1>

        {loading ? (
          <div className="text-center text-muted-foreground">Loading...</div>
        ) : comments.length === 0 ? (
          <div className="text-center text-muted-foreground">No comments</div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment._id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <p className="font-bold text-foreground">{comment.userName}</p>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(comment._id)}>
                      Delete
                    </Button>
                  </div>
                  <p className="text-foreground">{comment.comment}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
