"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AdminGuard } from "@/components/admin-guard"
import { toast } from "sonner"
import { Plus, Trash2, Edit, PenTool, Eye } from "lucide-react"

interface Sher {
    _id: string
    line1: string
    line2: string
    poet: string
    tags: string[]
    language: string
    views: number
}

export default function AdminSherPage() {
    return (
        <AdminGuard>
            <AdminSherContent />
        </AdminGuard>
    )
}

function AdminSherContent() {
    const [sherList, setSherList] = useState<Sher[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [formData, setFormData] = useState({
        line1: "",
        line2: "",
        poet: "",
        tags: "",
        language: "Hindi",
    })

    const fetchSher = async () => {
        try {
            const res = await fetch("/api/sher")
            if (res.ok) {
                const data = await res.json()
                setSherList(data)
            }
        } catch (error) {
            console.error("Failed to fetch sher:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSher()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const url = editingId ? `/api/sher/${editingId}` : "/api/sher"
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
                toast.success(editingId ? "Sher updated!" : "Sher created!")
                setFormData({ line1: "", line2: "", poet: "", tags: "", language: "Hindi" })
                setShowForm(false)
                setEditingId(null)
                fetchSher()
            } else {
                const data = await res.json()
                toast.error(data.error || "Failed to save sher")
            }
        } catch (error) {
            toast.error("Failed to save sher")
        }
    }

    const handleEdit = (sher: Sher) => {
        setFormData({
            line1: sher.line1,
            line2: sher.line2,
            poet: sher.poet,
            tags: sher.tags?.join(", ") || "",
            language: sher.language,
        })
        setEditingId(sher._id)
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this sher?")) return

        try {
            const res = await fetch(`/api/sher/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Sher deleted!")
                fetchSher()
            } else {
                toast.error("Failed to delete sher")
            }
        } catch (error) {
            toast.error("Failed to delete sher")
        }
    }

    return (
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Manage Sher</h1>
                        <p className="text-muted-foreground">Add and manage two-line couplets</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/admin">← Back to Dashboard</Link>
                        </Button>
                        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Sher
                        </Button>
                    </div>
                </div>

                {/* Form */}
                {showForm && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>{editingId ? "Edit Sher" : "Add New Sher"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Poet Name</label>
                                        <Input
                                            value={formData.poet}
                                            onChange={(e) => setFormData({ ...formData, poet: e.target.value })}
                                            placeholder="Ghalib"
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
                                <div>
                                    <label className="block text-sm font-medium mb-2">Line 1 *</label>
                                    <Input
                                        value={formData.line1}
                                        onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                                        placeholder="First line..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Line 2 *</label>
                                    <Input
                                        value={formData.line2}
                                        onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                                        placeholder="Second line..."
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                                    <Input
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        placeholder="love, wisdom"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <Button type="submit">{editingId ? "Update Sher" : "Add Sher"}</Button>
                                    <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); }}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Sher List */}
                <div className="grid md:grid-cols-2 gap-6">
                    {sherList.map((sher) => (
                        <Card key={sher._id} className="overflow-hidden">
                            <CardContent className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-semibold">{sher.poet || "Unknown"}</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" onClick={() => handleEdit(sher)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(sher._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="text-lg italic text-muted-foreground mb-4">
                                    <p>{sher.line1}</p>
                                    <p>{sher.line2}</p>
                                </div>
                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Eye className="h-3.5 w-3.5" />
                                        {sher.views || 0} views
                                    </span>
                                    {sher.tags.map(tag => (
                                        <span key={tag} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {sherList.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <PenTool className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No sher yet. Add one to get started!</p>
                    </div>
                )}
            </div>
        </main>
    )
}
