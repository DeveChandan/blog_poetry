"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ReactionsBarProps {
  contentId: string
  contentType: "poem" | "book"
}

export default function ReactionsBar({ contentId, contentType }: ReactionsBarProps) {
  const [reactions, setReactions] = useState<Record<string, number>>({
    like: 0,
    love: 0,
    inspire: 0,
  })
  const [userReaction, setUserReaction] = useState<string | null>(null)

  useEffect(() => {
    async function fetchReactions() {
      try {
        const res = await fetch(`/api/reactions?contentId=${contentId}&contentType=${contentType}`)
        if (res.ok) {
          const data = await res.json()
          const counts = { like: 0, love: 0, inspire: 0 }
          data.forEach((r: any) => {
            counts[r.type as keyof typeof counts]++
          })
          setReactions(counts)
        }
      } catch (error) {
        console.error("Failed to fetch reactions:", error)
      }
    }
    fetchReactions()
  }, [contentId, contentType])

  const handleReaction = async (type: string) => {
    try {
      const res = await fetch("/api/reactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contentId, contentType, type }),
      })

      if (res.ok) {
        const data = await res.json()
        if (data.removed) {
          setReactions((prev) => ({
            ...prev,
            [userReaction!]: Math.max(0, prev[userReaction as keyof typeof prev] - 1),
          }))
          setUserReaction(null)
        } else {
          if (userReaction) {
            setReactions((prev) => ({
              ...prev,
              [userReaction]: Math.max(0, prev[userReaction as keyof typeof prev] - 1),
            }))
          }
          setReactions((prev) => ({
            ...prev,
            [type]: prev[type as keyof typeof prev] + 1,
          }))
          setUserReaction(type)
        }
      } else {
        alert("Please login to react")
      }
    } catch (error) {
      console.error("Reaction error:", error)
    }
  }

  return (
    <div className="flex gap-4 mb-8 p-4 bg-card rounded border border-border">
      <Button variant={userReaction === "like" ? "default" : "outline"} onClick={() => handleReaction("like")}>
        👍 Like ({reactions.like})
      </Button>
      <Button variant={userReaction === "love" ? "default" : "outline"} onClick={() => handleReaction("love")}>
        ❤️ Love ({reactions.love})
      </Button>
      <Button variant={userReaction === "inspire" ? "default" : "outline"} onClick={() => handleReaction("inspire")}>
        ✨ Inspire ({reactions.inspire})
      </Button>
    </div>
  )
}
