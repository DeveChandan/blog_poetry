"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react" // Import useCallback
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState({
    siteName: "",
    siteDescription: "",
    authorBio: "",
    authorImage: "",
    youtubeChannel: "",
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchSettings = useCallback(async () => { // Wrap fetchSettings in useCallback
    setLoading(true)
    try {
      const res = await fetch("/api/settings")
      if (res.ok) {
        const data = await res.json()
        setFormData(data)
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setLoading(false)
    }
  }, []) // Empty dependency array for useCallback

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings]) // Add fetchSettings to useEffect dependency array

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
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
        await fetchSettings() // Re-fetch settings after successful save
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
            <CardTitle>Site Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Site Name</label>
                <input
                  type="text"
                  name="siteName"
                  value={formData.siteName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                  placeholder="Your Site Name"
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Site Description</label>
                <textarea
                  name="siteDescription"
                  value={formData.siteDescription}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground min-h-24"
                  placeholder="Describe your site..."
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Author Bio</label>
                <textarea
                  name="authorBio"
                  value={formData.authorBio}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground min-h-32"
                  placeholder="Tell your story..."
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Author Image URL</label>
                <input
                  type="url"
                  name="authorImage"
                  value={formData.authorImage}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="text-sm text-muted-foreground mb-2 block">YouTube Channel Handle</label>
                <input
                  type="text"
                  name="youtubeChannel"
                  value={formData.youtubeChannel}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                  placeholder="@yourchannelname"
                />
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
