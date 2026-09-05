"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AdminGuard } from "@/components/admin-guard"
import { toast } from "sonner"
import { Plus, Trash2, Edit, BookOpen, Eye } from "lucide-react"
import { RichTextEditor } from "@/components/rich-text-editor"
import { getGoogleDriveDirectLink } from "@/lib/gallery-utils"

interface Blog {
    _id: string
    title: string
    slug: string
    content: string
    excerpt: string
    image: string
    originalImage?: string
    category: string
    views: number
}

export default function AdminBlogPage() {
    return (
        <AdminGuard>
            <AdminBlogContent />
        </AdminGuard>
    )
}

function AdminBlogContent() {
    const [blogs, setBlogs] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [imageFile, setImageFile] = useState<File | null>(null)
    const [uploadingImage, setUploadingImage] = useState(false)

    const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
            setFormData(prev => ({ ...prev, image: "" }));
        } else {
            setImageFile(null);
        }
    }

    const initialFormState = {
        title: "",
        content: "",
        excerpt: "",
        image: "",
        tags: "",
        category: "General",
    }

    const [formData, setFormData] = useState(initialFormState)

    const fetchBlogs = async () => {
        try {
            const res = await fetch("/api/blogs")
            if (res.ok) {
                const data = await res.json()
                setBlogs(data)
            }
        } catch (error) {
            console.error("Failed to fetch blogs:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBlogs()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        let finalImageUrl = formData.image ? getGoogleDriveDirectLink(formData.image) : "";

        if (imageFile) {
            setUploadingImage(true);
            try {
                const { upload } = await import('@vercel/blob/client');
                const newBlob = await upload(imageFile.name, imageFile, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
                finalImageUrl = newBlob.url;
            } catch (error) {
                console.error("Error uploading image:", error);
                toast.error("Failed to upload image");
                setUploadingImage(false);
                return;
            } finally {
                setUploadingImage(false);
            }
        }

        try {
            const url = editingId ? `/api/blogs/${editingId}` : "/api/blogs"
            const method = editingId ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    image: finalImageUrl,
                    originalImage: formData.image,
                    tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
                }),
            })

            if (res.ok) {
                toast.success(editingId ? "Blog updated!" : "Blog published!")
                setFormData(initialFormState)
                setImageFile(null)
                setShowForm(false)
                setEditingId(null)
                fetchBlogs()
            } else {
                const data = await res.json()
                toast.error(data.error || "Failed to save blog")
            }
        } catch (error) {
            toast.error("Failed to save blog")
        }
    }

    const handleEdit = (blog: any) => {
        setFormData({
            title: blog.title,
            content: blog.content,
            excerpt: blog.excerpt || "",
            image: blog.originalImage || blog.image || "",
            tags: blog.tags?.join(", ") || "",
            category: blog.category || "General",
        })
        setEditingId(blog._id)
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this blog?")) return

        try {
            const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Blog deleted!")
                fetchBlogs()
            } else {
                toast.error("Failed to delete blog")
            }
        } catch (error) {
            toast.error("Failed to delete blog")
        }
    }

    return (
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Manage Blogs</h1>
                        <p className="text-muted-foreground">Write and publish articles</p>
                    </div>
                    <div className="flex gap-4">
                        <Button variant="outline" asChild>
                            <Link href="/admin">← Back to Dashboard</Link>
                        </Button>
                        <Button onClick={() => { setShowForm(!showForm); setEditingId(null); }}>
                            <Plus className="h-4 w-4 mr-2" />
                            Write Article
                        </Button>
                    </div>
                </div>

                {/* Form */}
                {showForm && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>{editingId ? "Edit Article" : "New Article"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Title *</label>
                                        <Input
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            placeholder="Article title"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Category</label>
                                        <Input
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            placeholder="Technology, Life, etc."
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Upload Image File</label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageFileChange}
                                            className="cursor-pointer"
                                        />
                                        {imageFile && (
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Selected file: {imageFile.name}
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Or Google Drive Link / Image URL</label>
                                        <Input
                                            value={formData.image}
                                            onChange={(e) => {
                                                setFormData({ ...formData, image: e.target.value });
                                                setImageFile(null);
                                            }}
                                            placeholder="https://drive.google.com/file/d/... or image URL"
                                        />
                                        <p className="text-[11px] text-muted-foreground mt-1">
                                            * Google Drive links are auto-converted. Ensure link is set to <strong>&quot;Anyone with the link can view&quot;</strong>.
                                        </p>
                                    </div>
                                </div>

                                {(imageFile || formData.image.trim()) && (
                                    <div>
                                        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Featured Image Preview</label>
                                        <div className="relative aspect-video max-w-sm rounded-lg border overflow-hidden bg-muted/40 flex items-center justify-center">
                                            <img
                                                src={imageFile ? URL.createObjectURL(imageFile) : getGoogleDriveDirectLink(formData.image)}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.currentTarget.style.display = 'none';
                                                }}
                                                onLoad={(e) => {
                                                    e.currentTarget.style.display = 'block';
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium mb-2">Content *</label>
                                    <RichTextEditor
                                        value={formData.content}
                                        onChange={(html) => setFormData({ ...formData, content: html })}
                                        placeholder="Write your article here..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Excerpt (Summary)</label>
                                    <Textarea
                                        value={formData.excerpt}
                                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                        placeholder="Short summary for listing page..."
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Tags (comma separated)</label>
                                    <Input
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        placeholder="writing, poetry, inspiration"
                                    />
                                </div>

                                 <div className="flex gap-4">
                                     <Button type="submit" disabled={uploadingImage}>
                                         {uploadingImage ? "Uploading Image..." : editingId ? "Update Article" : "Publish Article"}
                                     </Button>
                                     <Button type="button" variant="outline" onClick={() => { setShowForm(false); setEditingId(null); setImageFile(null); }}>
                                         Cancel
                                     </Button>
                                 </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Blog List */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {blogs.map((blog) => (
                        <Card key={blog._id} className="overflow-hidden">
                            {blog.image && (
                                <div className="aspect-video">
                                    <img src={getGoogleDriveDirectLink(blog.image)} alt={blog.title} className="w-full h-full object-cover" />
                                </div>
                            )}
                            <CardContent className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold line-clamp-1">{blog.title}</h3>
                                    <div className="flex gap-1 shrink-0">
                                        <Button size="sm" variant="outline" className="h-8 w-8 p-0" onClick={() => handleEdit(blog)}>
                                            <Edit className="h-3 w-3" />
                                        </Button>
                                        <Button size="sm" variant="destructive" className="h-8 w-8 p-0" onClick={() => handleDelete(blog._id)}>
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{blog.excerpt || blog.content}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Eye className="h-3 w-3" />
                                    {blog.views || 0} views
                                    <span className="ml-auto bg-secondary px-2 py-0.5 rounded-full">{blog.category}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {blogs.length === 0 && !loading && (
                    <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">No articles yet. Start writing!</p>
                    </div>
                )}
            </div>
        </main>
    )
}
