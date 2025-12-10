"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import AdminGuard from "@/components/admin-guard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateVideoPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    youtubeId: "",
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/videos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        router.push("/admin/videos")
      } else {
        alert("Failed to create video")
      }
    } catch (error) {
      console.error("Error creating video:", error)
      alert("Error creating video")
    } finally {
      setLoading(false)
    }
  }

  return (
    <AdminGuard>
      <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add New Video</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Video Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                    placeholder="Enter video title"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">YouTube Video ID</label>
                  <input
                    type="text"
                    name="youtubeId"
                    value={formData.youtubeId}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                    placeholder="e.g., dQw4w9WgXcQ"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Find this in YouTube URL: youtube.com/watch?v=<span className="font-mono">VIDEO_ID</span>
                  </p>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground min-h-32"
                    placeholder="Enter video description"
                  />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Video"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.back()} className="bg-transparent">
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </AdminGuard>
  )
}
