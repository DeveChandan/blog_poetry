"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface Comment {
  _id: string
  comment: string
  userName: string
  replies: Reply[]
  createdAt: string
}

interface Reply {
  _id: string
  comment: string
  userName: string
  createdAt: string
}

interface CommentsSectionProps {
  contentId: string
  contentType: "poem" | "book"
}

export default function CommentsSection({ contentId, contentType }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchComments() {
      try {
        const res = await fetch(`/api/comments?contentId=${contentId}&contentType=${contentType}`)
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
  }, [contentId, contentType])

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      alert("Please write a comment")
      return
    }

    try {
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId, contentType, comment: newComment }),
      })

      if (res.ok) {
        setNewComment("")
        // Refetch comments
        const commentRes = await fetch(`/api/comments?contentId=${contentId}&contentType=${contentType}`)
        if (commentRes.ok) {
          const data = await commentRes.json()
          setComments(data)
        }
      } else {
        alert("Please login to comment")
      }
    } catch (error) {
      console.error("Failed to submit comment:", error)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-foreground mb-6">Comments</h2>

      {/* Comment Form */}
      <Card className="mb-8">
        <CardContent className="p-6 space-y-4">
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full px-3 py-2 rounded border border-border bg-background text-foreground min-h-20"
          />
          <Button onClick={handleSubmitComment}>Post Comment</Button>
        </CardContent>
      </Card>

      {/* Comments List */}
      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted-foreground">No comments yet</p>
        ) : (
          comments.map((comment) => (
            <Card key={comment._id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-foreground">{comment.userName}</p>
                  <p className="text-sm text-muted-foreground">{new Date(comment.createdAt).toLocaleDateString()}</p>
                </div>
                <p className="text-foreground mb-4">{comment.comment}</p>

                {/* Replies */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-6 space-y-3 border-l border-border pl-4 pt-4">
                    {comment.replies.map((reply) => (
                      <div key={reply._id}>
                        <div className="flex justify-between items-start mb-1">
                          <p className="font-semibold text-sm text-foreground">{reply.userName}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(reply.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">{reply.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
