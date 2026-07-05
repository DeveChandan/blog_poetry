"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { UploadCloud } from "lucide-react"

export default function EditBookPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isbn: "",
    price: "",
    type: "both",
    stock: "",
    tags: "",
    cover: "",
    filePath: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedCoverFile, setSelectedCoverFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)

  useEffect(() => {
    async function fetchBook() {
      try {
        const res = await fetch(`/api/books/${id}`)
        if (res.ok) {
          const data = await res.json()
          setFormData({
            title: data.title,
            description: data.description,
            isbn: data.isbn,
            price: data.price.toString(),
            type: data.type,
            stock: data.stock?.toString() || "",
            tags: data.tags.join(", "),
            cover: data.cover || "",
            filePath: data.filePath || "",
          })
        }
      } catch (error) {
        console.error("Failed to fetch book:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchBook()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    } else {
      setSelectedFile(null)
    }
  }

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedCoverFile(e.target.files[0])
    } else {
      setSelectedCoverFile(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    let uploadedCover = formData.cover
    if (selectedCoverFile) {
      setUploadingCover(true)
      try {
        const { upload } = await import('@vercel/blob/client');
        const newBlob = await upload(selectedCoverFile.name, selectedCoverFile, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        uploadedCover = newBlob.url
        setUploadingCover(false)
      } catch (error) {
        console.error("Error uploading cover image:", error)
        alert("Error uploading cover image")
        setUploadingCover(false)
        setSaving(false)
        return
      }
    }

    let uploadedFilePath = formData.filePath
    if (selectedFile) {
      setUploading(true)
      try {
        const { upload } = await import('@vercel/blob/client');
        const newBlob = await upload(selectedFile.name, selectedFile, {
          access: 'public',
          handleUploadUrl: '/api/upload',
        });
        uploadedFilePath = newBlob.url;
        setUploading(false);
      } catch (error) {
        console.error("Error uploading file:", error)
        alert("Error uploading file")
        setUploading(false)
        setSaving(false)
        return
      }
    }

    try {
      const res = await fetch(`/api/books/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          cover: uploadedCover,
          filePath: uploadedFilePath, // Use the uploaded file path
          price: Number.parseFloat(formData.price),
          stock: formData.stock ? Number.parseInt(formData.stock) : undefined,
          tags: formData.tags.split(",").map((t) => t.trim()),
        }),
      })

      if (res.ok) {
        router.push("/admin/books")
      } else {
        alert("Failed to update book")
      }
    } catch (error) {
      console.error("Error updating book:", error)
      alert("Error updating book")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="py-12 text-center">Loading...</div>

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Edit Book</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground min-h-24"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">ISBN</label>
                  <input
                    type="text"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Price ($)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    step="0.01"
                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Type</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                  >
                    <option value="physical">Paperback</option>
                    <option value="ebook">E-book</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground mb-2 block">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Cover Image</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="cover"
                    value={formData.cover}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 rounded border border-border bg-background text-foreground"
                    placeholder="https://... or upload local image"
                  />
                  <input
                    type="file"
                    accept="image/*"
                    id="cover-upload"
                    className="hidden"
                    onChange={handleCoverChange}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    className="bg-transparent text-foreground hover:bg-muted"
                    onClick={() => document.getElementById("cover-upload")?.click()}
                  >
                    <UploadCloud className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </div>
                {selectedCoverFile && (
                  <p className="text-sm text-muted-foreground mt-1">
                    Selected cover file: {selectedCoverFile.name} (will be uploaded on save)
                  </p>
                )}
                {(selectedCoverFile || formData.cover) && (
                  <div className="mt-2 h-20 w-20 rounded overflow-hidden border border-border bg-muted">
                    <img
                      src={selectedCoverFile ? URL.createObjectURL(selectedCoverFile) : formData.cover}
                      alt="Cover Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">E-book File</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                />
                {selectedFile && <p className="text-sm text-muted-foreground mt-1">Selected: {selectedFile.name}</p>}
                {formData.filePath && !selectedFile && (
                  <p className="text-sm text-muted-foreground mt-1">Current file path: {formData.filePath}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Tags (comma-separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={saving || uploading || uploadingCover}>
                  {uploadingCover ? "Uploading Cover..." : uploading ? "Uploading E-book..." : saving ? "Saving..." : "Save Changes"}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} className="bg-transparent text-foreground hover:bg-muted">
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
