"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AdminGuard } from "@/components/admin-guard"
import { toast } from "sonner"
import { Plus, Trash2, Edit, Image as ImageIcon } from "lucide-react"

interface Slider {
    _id: string
    title: string
    subtitle: string
    image: string
    link: string
    buttonText: string
    order: number
    active: boolean
}

export default function AdminSlidersPage() {
    return (
        <AdminGuard>
            <AdminSlidersContent />
        </AdminGuard>
    )
}

function AdminSlidersContent() {
    const [sliders, setSliders] = useState<Slider[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        subtitle: "",
        image: "",
        link: "/",
        buttonText: "Learn More",
    })

    const fetchSliders = async () => {
        try {
            const res = await fetch("/api/sliders")
            if (res.ok) {
                const data = await res.json()
                setSliders(data)
            }
        } catch (error) {
            console.error("Failed to fetch sliders:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSliders()
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0])
        } else {
            setSelectedFile(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        let uploadedImageUrl = formData.image

        // Upload image if file is selected
        if (selectedFile) {
            setUploading(true)
            try {
                const { upload } = await import('@vercel/blob/client');
                const newBlob = await upload(selectedFile.name, selectedFile, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
                uploadedImageUrl = newBlob.url;
                setUploading(false)
            } catch (error) {
                console.error("Error uploading image:", error)
                toast.error("Failed to upload image")
                setUploading(false)
                return
            }
        }

        try {
            const url = editingId ? `/api/sliders/${editingId}` : "/api/sliders"
            const method = editingId ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    image: uploadedImageUrl
                }),
            })

            if (res.ok) {
                toast.success(editingId ? "Slider updated!" : "Slider created!")
                setFormData({ title: "", subtitle: "", image: "", link: "/", buttonText: "Learn More" })
                setSelectedFile(null)
                setShowForm(false)
                setEditingId(null)
                fetchSliders()
            } else {
                const data = await res.json()
                toast.error(data.error || "Failed to save slider")
            }
        } catch (error) {
            toast.error("Failed to save slider")
        }
    }

    const handleEdit = (slider: Slider) => {
        setFormData({
            title: slider.title,
            subtitle: slider.subtitle,
            image: slider.image,
            link: slider.link,
            buttonText: slider.buttonText,
        })
        setEditingId(slider._id)
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this slider?")) return

        try {
            const res = await fetch(`/api/sliders/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Slider deleted!")
                fetchSliders()
            } else {
                toast.error("Failed to delete slider")
            }
        } catch (error) {
            toast.error("Failed to delete slider")
        }
    }

    return (
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Manage Sliders</h1>
                        <p className="text-muted-foreground">Manage home page image slider</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/admin">← Back to Dashboard</Link>
                        </Button>
                        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Add Slider
                        </Button>
                    </div>
                </div>

                {/* Form */}
                {showForm && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>{editingId ? "Edit Slider" : "Add New Slider"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Title</label>
                                        <Input
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Slider title"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Button Text</label>
                                        <Input
                                            value={formData.buttonText}
                                            onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                                            placeholder="Learn More"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                                    <Textarea
                                        value={formData.subtitle}
                                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                                        placeholder="Slider subtitle/description"
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Upload Image *</label>
                                        <input
                                            type="file"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                                        />
                                        {selectedFile && <p className="text-sm text-muted-foreground mt-1">Selected: {selectedFile.name}</p>}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Or Image URL</label>
                                        <Input
                                            value={formData.image}
                                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                            placeholder="https://example.com/image.jpg"
                                        />
                                        <p className="text-xs text-muted-foreground mt-1">Leave empty to upload a file instead</p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Link URL</label>
                                        <Input
                                            value={formData.link}
                                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                            placeholder="/poems or https://..."
                                        />
                                    </div>
                                </div>
                                {(formData.image || selectedFile) && (
                                    <div className="mt-4">
                                        <p className="text-sm font-medium mb-2">Preview:</p>
                                        <img
                                            src={selectedFile ? URL.createObjectURL(selectedFile) : formData.image}
                                            alt="Preview"
                                            className="max-h-40 rounded-lg object-cover"
                                        />
                                    </div>
                                )}
                                <div className="flex gap-4">
                                    <Button type="submit" disabled={uploading || (!formData.image && !selectedFile)}>
                                        {uploading ? "Uploading Image..." : editingId ? "Update Slider" : "Add Slider"}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setSelectedFile(null); }}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Sliders List */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sliders.map((slider) => (
                        <Card key={slider._id} className="overflow-hidden">
                            <div className="aspect-video relative">
                                <img src={slider.image} alt={slider.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="secondary" onClick={() => handleEdit(slider)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDelete(slider._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <CardContent className="p-4">
                                <h3 className="font-semibold truncate">{slider.title || "No title"}</h3>
                                <p className="text-sm text-muted-foreground truncate">{slider.subtitle || "No subtitle"}</p>
                                <p className="text-xs text-primary mt-2">Link: {slider.link}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {sliders.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <ImageIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No sliders yet. Add one to get started!</p>
                    </div>
                )}
            </div>
        </main>
    )
}
