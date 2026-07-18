"use client"

import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AdminGuard } from "@/components/admin-guard"
import { toast } from "sonner"
import { Plus, Trash2, Edit, Image as ImageIcon, UploadCloud, Folder, RefreshCw, X, Eye } from "lucide-react"

interface GalleryItem {
  _id: string
  title: string
  url: string
  originalUrl: string
  group: string
  createdAt: string
}

export default function AdminGalleryPage() {
  return (
    <AdminGuard>
      <AdminGalleryContent />
    </AdminGuard>
  )
}

function AdminGalleryContent() {
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileInputKey, setFileInputKey] = useState(0)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  const [formData, setFormData] = useState({
    title: "",
    group: "",
    url: "",
  })

  // Track unique existing group names for quick auto-fill
  const [existingGroups, setExistingGroups] = useState<string[]>([])

  const fetchGallery = async () => {
    try {
      const res = await fetch("/api/gallery")
      if (res.ok) {
        const data = await res.json()
        setGalleryList(data)
        // Extract unique groups
        const groups = Array.from(new Set(data.map((item: GalleryItem) => item.group))) as string[]
        setExistingGroups(groups.filter(Boolean))
      }
    } catch (error) {
      console.error("Failed to fetch gallery items:", error)
      toast.error("Failed to fetch gallery items")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGallery()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      // Autofill title if empty
      if (!formData.title) {
        const fileName = e.target.files[0].name.split(".")[0]
        setFormData(prev => ({ ...prev, title: fileName }))
      }
    } else {
      setSelectedFile(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile && !formData.url.trim()) {
      toast.error("Please select an image file to upload or enter a URL")
      return
    }

    if (!formData.group.trim()) {
      toast.error("Please specify a group/category name")
      return
    }

    setUploadingImage(true)
    let finalImageUrl = formData.url

    try {
      // 1. Upload to Vercel Blob if a file is selected
      if (selectedFile) {
        try {
          const { upload } = await import('@vercel/blob/client')
          const newBlob = await upload(selectedFile.name, selectedFile, {
            access: 'public',
            handleUploadUrl: '/api/upload',
          })
          finalImageUrl = newBlob.url
        } catch (uploadError) {
          console.error("Error uploading image:", uploadError)
          toast.error("Failed to upload image file")
          setUploadingImage(false)
          return
        }
      }

      // 2. Submit to API
      const url = editingId ? `/api/gallery/${editingId}` : "/api/gallery"
      const method = editingId ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          url: finalImageUrl,
          group: formData.group,
        }),
      })

      if (res.ok) {
        toast.success(editingId ? "Gallery image updated!" : "Gallery image added!")
        resetForm()
        fetchGallery()
      } else {
        const data = await res.json()
        toast.error(data.error || "Failed to save gallery item")
      }
    } catch (error) {
      console.error("Error saving gallery item:", error)
      toast.error("An error occurred while saving")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setFormData({
      title: item.title,
      group: item.group,
      url: item.originalUrl || item.url, // Edit original Google Drive url if possible
    })
    setSelectedFile(null)
    setEditingId(item._id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this image?")) return

    try {
      const res = await fetch(`/api/gallery/${id}`, { method: "DELETE" })
      if (res.ok) {
        toast.success("Image deleted from gallery")
        fetchGallery()
      } else {
        toast.error("Failed to delete image")
      }
    } catch (error) {
      console.error("Failed to delete gallery item:", error)
      toast.error("An error occurred during deletion")
    }
  }

  const resetForm = () => {
    setFormData({ title: "", group: "", url: "" })
    setSelectedFile(null)
    setFileInputKey(prev => prev + 1)
    setEditingId(null)
    setShowForm(false)
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Gallery Management</h1>
            <p className="text-muted-foreground mt-1">Manage public site photo albums. Upload files or paste Google Drive shared links.</p>
          </div>
          {!showForm && (
            <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
              <Plus className="w-4 h-4" /> Add Image
            </Button>
          )}
        </div>

        {showForm && (
          <Card className="mb-12 border-[#3c2a1e]/10 dark:border-[#e6dfcd]/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{editingId ? "Edit Gallery Image" : "Add New Image to Gallery"}</CardTitle>
              <Button size="icon" variant="ghost" onClick={resetForm}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Left Column Fields */}
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Image Title / Caption</label>
                      <Input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g. Book Launch Event, Autumn Poetry Recital"
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">Group / Album Name</label>
                      <Input
                        type="text"
                        value={formData.group}
                        onChange={(e) => setFormData(prev => ({ ...prev, group: e.target.value }))}
                        placeholder="e.g. Launch 2024, Recitals, Events"
                        required
                      />
                      
                      {/* Existing groups list for easy autoselect */}
                      {existingGroups.length > 0 && (
                        <div className="mt-2">
                          <span className="text-xs text-muted-foreground block mb-1">Or choose an existing group:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {existingGroups.map((group) => (
                              <button
                                key={group}
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, group }))}
                                className="text-xs px-2.5 py-1 rounded bg-[#3c2a1e]/5 dark:bg-[#e6dfcd]/5 text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/10 dark:hover:bg-[#e6dfcd]/10 border transition-all"
                              >
                                {group}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">
                        Image File (Upload)
                      </label>
                      <div className="flex gap-2">
                        <Input
                          key={fileInputKey}
                          type="file"
                          accept="image/*"
                          onChange={handleFileChange}
                          className="flex-1"
                        />
                        {selectedFile && (
                          <Button
                            type="button"
                            variant="destructive"
                            onClick={() => {
                              setSelectedFile(null)
                              setFileInputKey(prev => prev + 1)
                            }}
                          >
                            Clear
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-muted" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">OR</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">
                        Google Drive Share Link or Direct Image URL
                      </label>
                      <Input
                        type="url"
                        value={formData.url}
                        onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                        placeholder="https://drive.google.com/file/d/... or direct image link"
                        disabled={!!selectedFile}
                      />
                      <p className="text-[11px] text-muted-foreground mt-1">
                        * Note: Google Drive files must be shared as <strong>&quot;Anyone with the link can view&quot;</strong>.
                      </p>
                    </div>
                  </div>

                  {/* Right Column Preview */}
                  <div className="flex flex-col justify-start">
                    <span className="text-sm font-medium text-muted-foreground mb-2 block">Image Preview</span>
                    <div className="border border-border/80 rounded-xl overflow-hidden shadow-sm bg-muted flex items-center justify-center relative aspect-video w-full">
                      {selectedFile ? (
                        <img
                          src={URL.createObjectURL(selectedFile)}
                          alt="Local preview"
                          className="w-full h-full object-contain"
                        />
                      ) : formData.url.trim() ? (
                        <img
                          src={formData.url.includes("drive.google.com") 
                            // Extract ID quickly for client-side preview check as well
                            ? `https://lh3.googleusercontent.com/u/0/d/${formData.url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1] || formData.url.match(/[?&]id=([a-zA-Z0-9_-]+)/)?.[1] || ""}`
                            : formData.url
                          }
                          alt="External preview"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // If direct render fails, fallback or clear
                            e.currentTarget.style.display = 'none'
                          }}
                          onLoad={(e) => {
                            e.currentTarget.style.display = 'block'
                          }}
                        />
                      ) : (
                        <div className="text-center p-6 text-muted-foreground">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
                          <p className="text-xs">No image selected or URL specified.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 border-t pt-6">
                  <Button type="submit" disabled={uploadingImage}>
                    {uploadingImage ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> Saving Image...
                      </>
                    ) : (
                      editingId ? "Save Changes" : "Save Image"
                    )}
                  </Button>
                  <Button type="button" variant="outline" className="bg-transparent" onClick={resetForm} disabled={uploadingImage}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Listing Grid */}
        <h2 className="text-xl font-bold text-foreground mb-4">Existing Photos ({galleryList.length})</h2>
        {loading ? (
          <div className="text-center py-12">Loading gallery database...</div>
        ) : galleryList.length === 0 ? (
          <div className="text-center py-16 border border-dashed rounded-lg bg-card/50 text-muted-foreground">
            <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-20" />
            No images in the gallery yet. Click &quot;Add Image&quot; to begin.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {galleryList.map((item) => (
              <Card key={item._id} className="overflow-hidden group border-[#3c2a1e]/10 dark:border-[#e6dfcd]/10 flex flex-col justify-between">
                <div className="aspect-video w-full relative bg-muted border-b overflow-hidden">
                  <img
                    src={item.url}
                    alt={item.title || "Gallery image"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] flex items-center gap-1">
                    <Folder className="w-3 h-3" /> {item.group}
                  </div>
                </div>
                <CardContent className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="font-semibold text-sm text-foreground line-clamp-1 mb-2">
                    {item.title || "Untitled Image"}
                  </h3>
                  <div className="flex gap-2 justify-end pt-2 border-t mt-auto">
                    <Button size="icon" variant="outline" className="h-8 w-8 text-primary" onClick={() => handleEdit(item)}>
                      <Edit className="w-3.5 h-3.5" />
                    </Button>
                    <Button size="icon" variant="outline" className="h-8 w-8 text-destructive" onClick={() => handleDelete(item._id)}>
                      <Trash2 className="w-3.5 h-3.5" />
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
