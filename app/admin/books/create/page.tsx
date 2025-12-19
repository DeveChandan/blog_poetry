"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateBookPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    isbn: "",
    price: "",
    type: "ebook",
    stock: "",
    tags: "",
    cover: "",
    filePath: "",
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

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

  const uploadFile = async (): Promise<string | null> => {
    if (!selectedFile) return null

    setUploading(true)
    const pathname = `books/${Date.now()}_${selectedFile.name.replaceAll(" ", "_")}`

    try {
      // Request the signed upload URL from our API
      const response = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pathname }),
      })

      if (!response.ok) {
        alert("Failed to get secure upload URL.")
        return null
      }

      const blob = await response.json()
      const uploadUrl = blob.url

      // Upload the file to Vercel Blob's signed URL
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        body: selectedFile,
        headers: {
          "Content-Type": selectedFile.type,
        },
      })

      if (uploadResponse.ok) {
        // The final URL is the signed URL without the query parameters
        const finalUrl = uploadUrl.split("?")[0]
        return finalUrl
      } else {
        alert("Failed to upload file to storage.")
        return null
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("An error occurred during file upload.")
      return null
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    let uploadedFilePath = formData.filePath
    // Check if a new file is selected or if the type requires a file
    if (selectedFile && (formData.type === "ebook" || formData.type === "both")) {
      uploadedFilePath = await uploadFile()
      if (!uploadedFilePath) {
        setLoading(false)
        return // Stop submission if file upload failed
      }
    }

    try {
      const res = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          filePath: uploadedFilePath, // Use the uploaded file path
          price: Number.parseFloat(formData.price),
          stock: formData.stock ? Number.parseInt(formData.stock) : undefined,
          tags: formData.tags.split(",").map((t) => t.trim()),
        }),
      })

      if (res.ok) {
        router.push("/admin/books")
      } else {
        alert("Failed to create book")
      }
    } catch (error) {
      console.error("Error creating book:", error)
      alert("Error creating book")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Book</CardTitle>
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
                  placeholder="Book title"
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
                  placeholder="Book description"
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
                    placeholder="ISBN"
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
                    placeholder="0.00"
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
                  <label className="text-sm text-muted-foreground mb-2 block">Stock (for physical)</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Cover Image URL</label>
                <input
                  type="url"
                  name="cover"
                  value={formData.cover}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">E-book File</label>
                <input
                  type="file"
                  name="file"
                  onChange={handleFileChange}
                  accept="application/pdf"
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
                  placeholder="fiction, bestseller"
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={loading || uploading}>
                  {loading ? "Creating..." : uploading ? "Uploading File..." : "Add Book"}
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
  )
}
