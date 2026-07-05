"use client"

import type React from "react"
import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { upload } from "@vercel/blob/client"
import { UploadCloud } from "lucide-react"
import RichTextEditor from "@/components/rich-text-editor"

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    authorImage: "",
    aboutDescription: "",
    featuredInstagramReel: "",
    youtube: "",
    instagram: "",
    facebook: "",
    twitter: "",
    linkedin: "",
    email: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/settings")
      if (res.ok) {
        const data = await res.json()
        setFormData(prev => ({ ...prev, ...data }))
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setUploadingImage(true)
    
    try {
      const newBlob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      })
      setFormData(prev => ({ ...prev, authorImage: newBlob.url }))
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Failed to upload image. Please try again.")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (res.ok) {
        alert("Settings saved successfully!")
        await fetchSettings()
      } else {
        alert("Failed to save settings")
      }
    } catch (error) {
      console.error("Error saving settings:", error)
      alert("Error saving settings")
    } finally {
      setSaving(false)
    }
  }

  if (loading)
    return (
      <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">Loading...</div>
      </main>
    )

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>About Section & Site Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Author Image URL</label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    name="authorImage"
                    value={formData.authorImage}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2 rounded border border-border bg-background text-foreground"
                    placeholder="https://..."
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    <UploadCloud className="w-4 h-4 mr-2" />
                    {uploadingImage ? "Uploading..." : "Upload"}
                  </Button>
                </div>
                {formData.authorImage && (
                  <div className="mt-2 h-20 w-20 rounded overflow-hidden border border-border">
                    <img src={formData.authorImage} alt="Author Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">About Biography (Rich Text/MS Word Style)</label>
                <RichTextEditor
                  value={formData.aboutDescription || ""}
                  onChange={(val) => setFormData(prev => ({ ...prev, aboutDescription: val }))}
                  placeholder="Tell your readers about yourself. You can copy and paste rich text here."
                  minHeight="min-h-[250px]"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Featured Instagram Reel URL</label>
                <input
                  type="url"
                  name="featuredInstagramReel"
                  value={formData.featuredInstagramReel || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                  placeholder="https://www.instagram.com/reel/..."
                />
                <p className="text-xs text-muted-foreground mt-1">This will be embedded on the vintage home screen.</p>
              </div>

              <div className="pt-4 border-t border-border">
                <h3 className="text-lg font-medium mb-4">Social Media Profiles</h3>
                <div className="grid gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">YouTube Channel URL</label>
                    <input
                      type="url"
                      name="youtube"
                      value={formData.youtube}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                      placeholder="https://youtube.com/channel/..."
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Instagram URL</label>
                    <input
                      type="url"
                      name="instagram"
                      value={formData.instagram}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                      placeholder="https://instagram.com/..."
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Facebook URL</label>
                    <input
                      type="url"
                      name="facebook"
                      value={formData.facebook}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                      placeholder="https://facebook.com/..."
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Twitter/X URL</label>
                    <input
                      type="url"
                      name="twitter"
                      value={formData.twitter}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">LinkedIn URL</label>
                    <input
                      type="url"
                      name="linkedin"
                      value={formData.linkedin}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-2 block">Email Address (Public)</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                      placeholder="contact@example.com"
                    />
                  </div>
                </div>
              </div>

              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
