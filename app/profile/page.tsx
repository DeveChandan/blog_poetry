"use client"

import { useSession } from "@/hooks/use-session"
import { useRouter } from "next/navigation"
import { useEffect, useState, useCallback } from "react" // Import useCallback
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface OrderItem {
  bookId: string
  title: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  items: OrderItem[]
  totalAmount: number
  status: string
  createdAt: string
}

interface UserComment {
  _id: string
  contentId: string
  contentType: string
  comment: string
  createdAt: string
}

interface UserReview {
  _id: string
  contentId: string
  contentType: string
  rating: number
  comment: string
  createdAt: string
}

interface UserReaction {
  _id: string
  contentId: string
  contentType: string
  type: string
  createdAt: string
}

export default function ProfilePage() {
  const { user, loading: sessionLoading } = useSession()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [comments, setComments] = useState<UserComment[]>([])
  const [reviews, setReviews] = useState<UserReview[]>([])
  const [reactions, setReactions] = useState<UserReaction[]>([])
  const [activityLoading, setActivityLoading] = useState(true)

  useEffect(() => {
    if (!sessionLoading && !user) {
      router.push("/login")
    }
  }, [user, sessionLoading, router])

  const fetchUserActivity = useCallback(async () => {
    if (user) {
      setActivityLoading(true)
      try {
        const [ordersRes, commentsRes, reviewsRes, reactionsRes] = await Promise.all([
          fetch("/api/orders"),
          fetch("/api/user/comments"),
          fetch("/api/user/reviews"),
          fetch("/api/user/reactions"),
        ])

        if (ordersRes.ok) {
          const data: Order[] = await ordersRes.json()
          setOrders(data)
        } else {
          console.error("Failed to fetch orders:", ordersRes.statusText)
        }

        if (commentsRes.ok) {
          const data: UserComment[] = await commentsRes.json()
          setComments(data)
        } else {
          console.error("Failed to fetch comments:", commentsRes.statusText)
        }

        if (reviewsRes.ok) {
          const data: UserReview[] = await reviewsRes.json()
          setReviews(data)
        } else {
          console.error("Failed to fetch reviews:", reviewsRes.statusText)
        }

        if (reactionsRes.ok) {
          const data: UserReaction[] = await reactionsRes.json()
          setReactions(data)
        } else {
          console.error("Failed to fetch reactions:", reactionsRes.statusText)
        }
      } catch (error) {
        console.error("Error fetching user activity:", error)
      } finally {
        setActivityLoading(false)
      }
    }
  }, [user])

  useEffect(() => {
    fetchUserActivity()
  }, [fetchUserActivity])

  if (sessionLoading || activityLoading) {
    return (
      <main className="min-h-screen bg-background py-12 text-center">
        <p>Loading profile...</p>
      </main>
    )
  }

  if (!user) {
    return (
      <main className="min-h-screen bg-background py-12 text-center text-red-500">
        <p>Access Denied. Please log in.</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Email:</p>
              <p className="text-lg font-semibold">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">User ID:</p>
              <p className="text-lg font-semibold">{user.userId}</p>
            </div>
            {user.isAdmin && (
              <div>
                <p className="text-sm text-muted-foreground">Role:</p>
                <p className="text-lg font-semibold text-primary">Admin</p>
              </div>
            )}
            <Button onClick={() => router.push("/logout")}>Logout</Button>
          </CardContent>
        </Card>

        {/* Ordered Books Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <p className="text-center text-muted-foreground">Loading your orders...</p>
            ) : orders.length === 0 ? (
              <p className="text-center text-muted-foreground">You have not placed any orders yet.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <Card key={order._id} className="p-4">
                    <h3 className="font-semibold text-lg mb-2">Order ID: {order._id}</h3>
                    <p className="text-sm text-muted-foreground">Status: {order.status}</p>
                    <p className="text-sm text-muted-foreground">
                      Order Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                    <p className="font-bold text-primary mt-2">Total: ${order.totalAmount.toFixed(2)}</p>
                    <div className="mt-4 border-t border-border pt-4">
                      <h4 className="font-medium mb-2">Items:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {order.items.map((item) => (
                          <li key={item.bookId} className="text-sm">
                            {item.title} (x{item.quantity}) - ${item.price.toFixed(2)} each
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Comments Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Comments</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <p className="text-center text-muted-foreground">Loading your comments...</p>
            ) : comments.length === 0 ? (
              <p className="text-center text-muted-foreground">You have not posted any comments yet.</p>
            ) : (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment._id} className="p-4">
                    <p className="text-sm text-muted-foreground">
                      On {comment.contentType} (ID: {comment.contentId})
                    </p>
                    <p className="mt-2">{comment.comment}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Posted: {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Reviews Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <p className="text-center text-muted-foreground">Loading your reviews...</p>
            ) : reviews.length === 0 ? (
              <p className="text-center text-muted-foreground">You have not posted any reviews yet.</p>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <Card key={review._id} className="p-4">
                    <p className="text-sm text-muted-foreground">
                      On {review.contentType} (ID: {review.contentId})
                    </p>
                    <p className="mt-2">Rating: {review.rating} / 5</p>
                    <p className="mt-2">{review.comment}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Posted: {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Reactions Section */}
        <Card>
          <CardHeader>
            <CardTitle>Your Reactions</CardTitle>
          </CardHeader>
          <CardContent>
            {activityLoading ? (
              <p className="text-center text-muted-foreground">Loading your reactions...</p>
            ) : reactions.length === 0 ? (
              <p className="text-center text-muted-foreground">You have not posted any reactions yet.</p>
            ) : (
              <div className="space-y-4">
                {reactions.map((reaction) => (
                  <Card key={reaction._id} className="p-4">
                    <p className="text-sm text-muted-foreground">
                      On {reaction.contentType} (ID: {reaction.contentId})
                    </p>
                    <p className="mt-2">Reaction Type: {reaction.type}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Posted: {new Date(reaction.createdAt).toLocaleDateString()}
                    </p>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
