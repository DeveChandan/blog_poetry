"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AdminGuard } from "@/components/admin-guard"
import { toast } from "sonner"
import { Plus, Trash2, Edit, Feather, Eye } from "lucide-react"

interface Shayari {
    _id: string
    title: string
    content: string
    author: string
    tags: string[]
    language: string
    views: number
}

export default function AdminShayariPage() {
    return (
        <AdminGuard>
            <AdminShayariContent />
        </AdminGuard>
    )
}

function AdminShayariContent() {
    const [shayariList, setShayariList] = useState<Shayari[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        author: "",
        tags: "",
        language: "Hindi",
    })

    const fetchShayari = async () => {
        try {
            const res = await fetch("/api/shayari")
            if (res.ok) {
                const data = await res.json()
                setShayariList(data)
            }
        } catch (error) {
            console.error("Failed to fetch shayari:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchShayari()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = editingId ? `/api/shayari/${editingId}` : "/api/shayari"
            const method = editingId ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
                }),
            })

            if (res.ok) {
                toast.success(editingId ? "Shayari updated!" : "Shayari created!")
                setFormData({ title: "", content: "", author: "", tags: "", language: "Hindi" })
                setShowForm(false)
                setEditingId(null)
                fetchShayari()
            } else {
                const data = await res.json()
                toast.error(data.error || "Failed to save shayari")
            }
        } catch (error) {
            toast.error("Failed to save shayari")
        }
    }

    const handleEdit = (shayari: Shayari) => {
        setFormData({
            title: shayari.title,
            content: shayari.content,
            author: shayari.author,
            tags: shayari.tags?.join(", ") || "",
            language: shayari.language,
        })
        setEditingId(shayari._id)
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this shayari?")) return

        try {
            const res = await fetch(`/api/shayari/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Shayari deleted!")
                fetchShayari()
            } else {
                toast.error("Failed to delete shayari")
            }
        } catch (error) {
            toast.error("Failed to delete shayari")
        }
    }

    return (
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Manage Shayari</h1>
                        <p className="text-muted-foreground">Add and manage shayari collection</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/admin">← Back to Dashboard</Link>
                        </Button>
                        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Shayari
                        </Button>
                    </div>
                </div>

                {/* Form */}
                {showForm && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>{editingId ? "Edit Shayari" : "Add New Shayari"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Title (Optional)</label>
                                        <Input
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Shayari title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Author/Poet</label>
                                        <Input
                                            value={formData.author}
                                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                            placeholder="Poet name"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Content *</label>
                                    <Textarea
                                        value={formData.content}
                                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                        placeholder="Enter the shayari..."
                                        rows={6}
                                        required
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                                        <Input
                                            value={formData.tags}
                                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                            placeholder="love, life, sadness"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Language</label>
                                        <select
                                            value={formData.language}
                                            onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                                            className="w-full px-3 py-2 rounded-md border bg-background"
                                        >
                                            <option value="Hindi">Hindi</option>
                                            <option value="Urdu">Urdu</option>
                                            <option value="English">English</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <Button type="submit">{editingId ? "Update Shayari" : "Add Shayari"}</Button>
                                    <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Shayari List */}
                <div className="grid md:grid-cols-2 gap-6">
                    {shayariList.map((shayari) => (
                        <Card key={shayari._id} className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold">{shayari.title || "Untitled"}</h3>
                                        <p className="text-sm text-muted-foreground">by {shayari.author || "Unknown"}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleEdit(shayari)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(shayari._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-muted-foreground line-clamp-3 whitespace-pre-line italic">
                                    "{shayari.content}"
                                </p>
                                <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-3.5 w-3.5" />
                                        {shayari.views || 0} views
                                    </span>
                                    <span>{shayari.language}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {shayariList.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <Feather className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No shayari yet. Add one to get started!</p>
                    </div>
                )}
            </div>
        </main>
    )
}
