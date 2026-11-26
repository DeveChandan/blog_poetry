"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AdminGuard } from "@/components/admin-guard"
import { toast } from "sonner"
import { Plus, Trash2, Edit, MapPin, Upload, Play, Users } from "lucide-react"

interface CreatorItem {
  _id: string
  name: string
  city: string
  category: string
  intro: string
  photo: string
  performanceUrl: string
  youtubeId?: string
  order?: number
}

export default function AdminCreatorsPage() {
  return (
    <AdminGuard>
      <AdminCreatorsContent />
    </AdminGuard>
  )
}

function AdminCreatorsContent() {
  const [creators, setCreators] = useState<CreatorItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    city: "",
    category: "Poet",
    intro: "",
    photo: "",
    performanceUrl: "",
    order: "0",
  })

  const [previewUrl, setPreviewUrl] = useState("")

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(formData.photo)
    }
  }, [selectedFile, formData.photo])

  const fetchCreators = async () => {
    try {
      const res = await fetch("/api/creators")
      if (res.ok) {
        const data = await res.json()
        setCreators(data)
      }
    } catch (error) {
      console.error("Failed to fetch creators:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCreators()
  }, [])

  const resetForm = () => {
    setFormData({
      name: "",
      city: "",
      category: "Poet",
      intro: "",
      photo: "",
      performanceUrl: "",
      order: "0",
    })
    setSelectedFile(null)
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (creator: CreatorItem) => {
    setFormData({
      name: creator.name,
      city: creator.city || "",
      category: creator.category || "Poet",
      intro: creator.intro || "",
      photo: creator.photo || "",
      performanceUrl: creator.performanceUrl || "",
      order: String(creator.order ?? 0),
    })
    setSelectedFile(null)
    setEditingId(creator._id)
    setShowForm(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this featured creator?")) return
    try {
      const res = await fetch(`/api/creators/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Creator removed")
        fetchCreators()
      } else {
        toast.error("Failed to remove creator")
      }
    } catch (error) {
      console.error("Delete creator error:", error)
      toast.error("Error removing creator")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.category.trim()) {
      toast.error("Name and literary category are required")
      return
    }

    setSaving(true)
    let finalPhotoUrl = formData.photo

    try {
      if (selectedFile) {
        const { upload } = await import("@vercel/blob/client")
        const blob = await upload(selectedFile.name, selectedFile, {
          access: "public",
          handleUploadUrl: "/api/upload",
        })
        finalPhotoUrl = blob.url
      }

      const url = editingId ? `/api/creators/${editingId}` : "/api/creators"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          photo: finalPhotoUrl,
          order: Number.parseInt(formData.order || "0", 10) || 0,
        }),
      })

      if (res.ok) {
        toast.success(editingId ? "Creator updated!" : "Creator added!")
        resetForm()
        fetchCreators()
      } else {
        const err = await res.json().catch(() => ({}))
        toast.error(err.error || "Failed to save creator")
      }
    } catch (error) {
      console.error("Save creator error:", error)
      toast.error("Error saving creator")
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-7 h-7 text-primary" />
              Featured Creators (Literature Club)
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage creators displayed dynamically on the RSUNKAHI Literature Club page.
            </p>
          </div>
          <Button
            onClick={() => {
              if (showForm) resetForm()
              else setShowForm(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            {showForm ? "Cancel" : "Add Creator"}
          </Button>
        </div>

        {showForm && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>{editingId ? "Edit Featured Creator" : "Add Featured Creator"}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Creator Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Aarav Sharma"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">City</label>
                    <Input
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="e.g., Lucknow"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Literary Category *</label>
                    <Input
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g., Poet, Shayar, Storyteller"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1.5 block">Display Order</label>
                    <Input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                      placeholder="0"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Creator Photograph</label>
                  <div className="flex flex-wrap gap-3 items-center">
                    <Input
                      type="url"
                      value={formData.photo}
                      onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                      placeholder="https://... or upload an image"
                      className="flex-1 min-w-[220px]"
                    />
                    <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-secondary text-secondary-foreground hover:bg-secondary/80 text-sm font-medium">
                      <Upload className="w-4 h-4" />
                      Upload Photo
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) setSelectedFile(e.target.files[0])
                        }}
                      />
                    </label>
                  </div>
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Creator preview"
                      className="mt-3 w-24 h-24 rounded-xl object-cover border border-border"
                    />
                  )}
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">Short Introduction</label>
                  <textarea
                    value={formData.intro}
                    onChange={(e) => setFormData({ ...formData, intro: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground"
                    placeholder="Brief introduction of the creator and their writing style..."
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">
                    Watch Performance Video URL / YouTube ID
                  </label>
                  <Input
                    value={formData.performanceUrl}
                    onChange={(e) => setFormData({ ...formData, performanceUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=... or video ID"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="submit" disabled={saving}>
                    {saving ? "Saving..." : editingId ? "Update Creator" : "Add Creator"}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="text-center py-12 text-muted-foreground">Loading creators...</div>
        ) : creators.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No featured creators added yet. Click &ldquo;Add Creator&rdquo; to feature poets, shayars, and storytellers.
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => (
              <Card key={creator._id} className="overflow-hidden flex flex-col justify-between">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0 border border-border">
                      {creator.photo ? (
                        <img src={creator.photo} alt={creator.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg font-bold text-muted-foreground">
                          {creator.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-foreground leading-tight">{creator.name}</h3>
                      <span className="inline-block text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium mt-1">
                        {creator.category}
                      </span>
                      {creator.city && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {creator.city}
                        </p>
                      )}
                    </div>
                  </div>
                  {creator.intro && (
                    <p className="text-sm text-muted-foreground line-clamp-3">{creator.intro}</p>
                  )}
                  {creator.performanceUrl && (
                    <p className="text-xs text-primary flex items-center gap-1">
                      <Play className="w-3 h-3" /> Performance video linked
                    </p>
                  )}
                </CardContent>
                <div className="px-5 py-3 bg-muted/30 border-t border-border flex justify-end gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(creator)}>
                    <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(creator._id)}>
                    <Trash2 className="w-3.5 h-3.5 mr-1" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
