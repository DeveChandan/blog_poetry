"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AdminGuard } from "@/components/admin-guard"
import { toast } from "sonner"
import { Plus, Trash2, Edit, Quote, Eye, Image as ImageIcon, Upload } from "lucide-react"
import RichTextEditor from "@/components/rich-text-editor"
import ContentRenderer from "@/components/content-renderer"

interface QuoteItem {
    _id: string
    content: string
    author: string
    tags: string[]
    backgroundImage?: string
    fontSize?: number
    views: number
}

export default function AdminQuotesPage() {
    return (
        <AdminGuard>
            <AdminQuotesContent />
        </AdminGuard>
    )
}

function AdminQuotesContent() {
    const [quotesList, setQuotesList] = useState<QuoteItem[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
    const [uploadingImage, setUploadingImage] = useState(false)
    
    const [formData, setFormData] = useState({
        content: "",
        author: "Dr. Rupesh Kumar Singh",
        tags: "",
        backgroundImage: "",
        fontSize: "24",
    })

    const [imagePreviewUrl, setImagePreviewUrl] = useState<string>("")

    useEffect(() => {
        if (selectedImageFile) {
            const url = URL.createObjectURL(selectedImageFile)
            setImagePreviewUrl(url)
            return () => URL.revokeObjectURL(url)
        } else {
            setImagePreviewUrl(formData.backgroundImage)
        }
    }, [selectedImageFile, formData.backgroundImage])

    const fetchQuotes = async () => {
        try {
            const res = await fetch("/api/quotes")
            if (res.ok) {
                const data = await res.json()
                setQuotesList(data)
            }
        } catch (error) {
            console.error("Failed to fetch quotes:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchQuotes()
    }, [])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedImageFile(e.target.files[0])
        } else {
            setSelectedImageFile(null)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.content.trim()) {
            toast.error("Quote content is required")
            return
        }

        setUploadingImage(true)
        let finalImageUrl = formData.backgroundImage

        try {
            // Upload to Vercel Blob if a file is selected
            if (selectedImageFile) {
                try {
                    const { upload } = await import('@vercel/blob/client')
                    const newBlob = await upload(selectedImageFile.name, selectedImageFile, {
                        access: 'public',
                        handleUploadUrl: '/api/upload',
                    })
                    finalImageUrl = newBlob.url
                } catch (uploadError) {
                    console.error("Error uploading background image:", uploadError)
                    toast.error("Failed to upload background image")
                    setUploadingImage(false)
                    return
                }
            }

            const url = editingId ? `/api/quotes/${editingId}` : "/api/quotes"
            const method = editingId ? "PUT" : "POST"

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    backgroundImage: finalImageUrl,
                    tags: formData.tags.split(",").map(t => t.trim()).filter(Boolean),
                }),
            })

            if (res.ok) {
                toast.success(editingId ? "Quote updated!" : "Quote created!")
                setFormData({ content: "", author: "Dr. Rupesh Kumar Singh", tags: "", backgroundImage: "", fontSize: "24" })
                setSelectedImageFile(null)
                setShowForm(false)
                setEditingId(null)
                fetchQuotes()
            } else {
                const data = await res.json()
                toast.error(data.error || "Failed to save quote")
            }
        } catch (error) {
            toast.error("Failed to save quote")
        } finally {
            setUploadingImage(false)
        }
    }

    const handleEdit = (quote: QuoteItem) => {
        setFormData({
            content: quote.content,
            author: quote.author,
            tags: quote.tags?.join(", ") || "",
            backgroundImage: quote.backgroundImage || "",
            fontSize: quote.fontSize?.toString() || "24",
        })
        setSelectedImageFile(null)
        setEditingId(quote._id)
        setShowForm(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this quote?")) return

        try {
            const res = await fetch(`/api/quotes/${id}`, { method: "DELETE" })
            if (res.ok) {
                toast.success("Quote deleted!")
                fetchQuotes()
            } else {
                toast.error("Failed to delete quote")
            }
        } catch (error) {
            toast.error("Failed to delete quote")
        }
    }

    return (
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-foreground">Quotes Management</h1>
                        <p className="text-muted-foreground mt-1">Create and manage quotes with optional background images.</p>
                    </div>
                    {!showForm && (
                        <Button onClick={() => {
                            setFormData({ content: "", author: "Dr. Rupesh Kumar Singh", tags: "", backgroundImage: "", fontSize: "24" })
                            setSelectedImageFile(null)
                            setEditingId(null)
                            setShowForm(true)
                        }} className="gap-2">
                            <Plus className="w-4 h-4" /> Add Quote
                        </Button>
                    )}
                </div>

                {showForm && (
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle>{editingId ? "Edit Quote" : "Add New Quote"}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid md:grid-cols-3 gap-6">
                                    {/* Inputs Column */}
                                    <div className="md:col-span-2 space-y-6">
                                        <div>
                                            <label className="text-sm text-muted-foreground mb-2 block">Quote Text (Rich Text / MS Word Style)</label>
                                            <RichTextEditor
                                                value={formData.content}
                                                onChange={(val) => setFormData(prev => ({ ...prev, content: val }))}
                                                placeholder="Type or paste formatted quote here..."
                                                minHeight="min-h-[160px]"
                                            />
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm text-muted-foreground mb-2 block">Author</label>
                                                <Input
                                                    type="text"
                                                    value={formData.author}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
                                                    placeholder="Dr. Rupesh Kumar Singh"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-sm text-muted-foreground mb-2 block">Tags (comma-separated)</label>
                                                <Input
                                                    type="text"
                                                    value={formData.tags}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                                                    placeholder="inspiration, life, love"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm text-muted-foreground block">Background Image</label>
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <div className="flex-1">
                                                    <Input
                                                        type="text"
                                                        value={formData.backgroundImage}
                                                        onChange={(e) => setFormData(prev => ({ ...prev, backgroundImage: e.target.value }))}
                                                        placeholder="Paste image URL..."
                                                        className="w-full"
                                                    />
                                                </div>
                                                <div className="relative">
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileChange}
                                                        className="hidden"
                                                        id="bg-image-upload"
                                                    />
                                                    <label
                                                        htmlFor="bg-image-upload"
                                                        className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted text-sm font-medium transition-colors h-10 whitespace-nowrap"
                                                    >
                                                        <Upload className="w-4 h-4" /> Upload File
                                                    </label>
                                                </div>
                                            </div>
                                            {selectedImageFile && (
                                                <p className="text-xs text-primary font-medium flex items-center gap-1">
                                                    <ImageIcon className="w-3.5 h-3.5" /> Selected: {selectedImageFile.name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Preview Column */}
                                    <div className="flex flex-col justify-start">
                                        <span className="text-sm text-muted-foreground mb-2 block">Card Live Preview Check</span>
                                        <div className={`border border-border/80 rounded-xl overflow-hidden shadow-sm relative bg-muted flex flex-col justify-between ${!imagePreviewUrl ? 'aspect-[4/3] p-6' : 'p-0'}`}>
                                            {imagePreviewUrl ? (
                                                <div className="relative w-full overflow-hidden flex flex-col">
                                                    <img 
                                                        src={imagePreviewUrl} 
                                                        alt="Quote Background Preview"
                                                        className="w-full h-auto block object-contain"
                                                    />
                                                    {/* Dark overlay for readability */}
                                                    <div className="absolute inset-0 bg-black/50" />
                                                    
                                                    {/* Overlay Content placed absolutely over the full-size image */}
                                                    <div className="absolute inset-0 flex flex-col justify-between p-6 z-10">
                                                        <div className="flex-1 flex flex-col justify-center text-center">
                                                            <Quote className="w-8 h-8 opacity-30 mx-auto mb-2 text-white" />
                                                            <div 
                                                                className="font-serif leading-relaxed max-h-[70%] overflow-y-auto px-2 text-white"
                                                                style={{
                                                                    fontSize: `${formData.fontSize || 24}px`,
                                                                    textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                                                                }}
                                                            >
                                                                {formData.content ? (
                                                                    <ContentRenderer content={formData.content} />
                                                                ) : (
                                                                    <p className="italic opacity-40">Your quote text will appear here...</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="text-center pt-2 border-t border-white/15">
                                                            <p className="font-serif italic text-xs text-white/90">
                                                                — {formData.author || "Dr. Rupesh Kumar Singh"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="absolute inset-0 bg-gradient-to-br from-[#f4e8d4] to-[#e8d5b5] dark:from-[#2e261d] dark:to-[#1a140f] opacity-80" />
                                                    <div className="relative z-10 w-full flex-1 flex flex-col justify-center text-center">
                                                        <Quote className="w-8 h-8 opacity-20 mx-auto mb-2 text-foreground" />
                                                        <div 
                                                            className="font-serif leading-relaxed max-h-[160px] overflow-y-auto px-2"
                                                            style={{
                                                                fontSize: `${formData.fontSize || 24}px`,
                                                                color: 'var(--foreground)'
                                                            }}
                                                        >
                                                            {formData.content ? (
                                                                <ContentRenderer content={formData.content} />
                                                            ) : (
                                                                <p className="italic opacity-40">Your quote text will appear here...</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="relative z-10 w-full text-center mt-3 pt-2 border-t border-foreground/10">
                                                        <p className="font-serif italic text-xs text-foreground">
                                                            — {formData.author || "Dr. Rupesh Kumar Singh"}
                                                        </p>
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="mt-4 space-y-2 border-t pt-4">
                                            <div className="flex justify-between items-center">
                                                <label className="text-xs font-semibold text-muted-foreground block">Quote Text Font Size</label>
                                                <span className="text-xs font-bold text-primary">{formData.fontSize || 24}px</span>
                                            </div>
                                            <input
                                                type="range"
                                                min="16"
                                                max="48"
                                                step="2"
                                                value={formData.fontSize || "24"}
                                                onChange={(e) => setFormData(prev => ({ ...prev, fontSize: e.target.value }))}
                                                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 border-t pt-6">
                                    <Button type="submit" disabled={uploadingImage}>
                                        {uploadingImage ? "Saving Quote..." : (editingId ? "Save Changes" : "Create Quote")}
                                    </Button>
                                    <Button type="button" variant="outline" className="bg-transparent" onClick={() => {
                                        setShowForm(false)
                                        setEditingId(null)
                                        setSelectedImageFile(null)
                                    }} disabled={uploadingImage}>
                                        Cancel
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {loading ? (
                    <div className="text-center py-12">Loading quotes...</div>
                ) : quotesList.length === 0 ? (
                    <div className="text-center py-12 border border-dashed rounded-lg bg-card text-muted-foreground">
                        <Quote className="w-12 h-12 mx-auto mb-2 opacity-20" />
                        No quotes found. Click "Add Quote" to create one.
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {quotesList.map((quote) => (
                            <Card key={quote._id} className="relative overflow-hidden group">
                                {quote.backgroundImage && (
                                    <div 
                                        className="absolute inset-0 bg-cover bg-center"
                                        style={{ backgroundImage: `url(${quote.backgroundImage})` }}
                                    />
                                )}
                                {quote.backgroundImage && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[0.5px]" />
                                )}
                                
                                <CardContent className="p-8 flex flex-col justify-between h-full min-h-[250px] relative z-10">
                                    <div className="flex justify-between items-start gap-4">
                                        <div className="flex-1 flex flex-col justify-center h-full py-4 text-center">
                                            <Quote className="w-8 h-8 opacity-25 mx-auto mb-3" style={quote.backgroundImage ? { color: '#ffffff' } : { color: 'var(--primary)' }} />
                                            <div 
                                                className="font-serif text-lg leading-relaxed max-h-[140px] overflow-y-auto px-4"
                                                style={quote.backgroundImage ? { color: '#ffffff', textShadow: '0 2px 4px rgba(0,0,0,0.8)' } : { color: 'var(--foreground)' }}
                                            >
                                                <ContentRenderer content={quote.content} />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between mt-6 pt-4 border-t border-foreground/10" style={quote.backgroundImage ? { borderColor: 'rgba(255,255,255,0.15)' } : {}}>
                                        <div className="text-left">
                                            <p 
                                                className="font-serif italic text-xs"
                                                style={quote.backgroundImage ? { color: '#ffffff' } : { color: 'var(--foreground)' }}
                                            >
                                                — {quote.author}
                                            </p>
                                            <div className="flex items-center gap-2 mt-1.5 text-[10px]" style={quote.backgroundImage ? { color: 'rgba(255,255,255,0.7)' } : { color: 'var(--muted-foreground)' }}>
                                                <span className="flex items-center gap-0.5"><Eye className="w-3.5 h-3.5" /> {quote.views}</span>
                                                {quote.tags && quote.tags.length > 0 && (
                                                    <span className="truncate max-w-[120px]">
                                                        #{quote.tags[0]} {quote.tags.length > 1 && `+${quote.tags.length - 1}`}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="flex gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10 text-primary" style={quote.backgroundImage ? { color: '#ffffff' } : {}} onClick={() => handleEdit(quote)}>
                                                <Edit className="w-3.5 h-3.5" />
                                            </Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-white/10 text-destructive" style={quote.backgroundImage ? { color: '#ef4444' } : {}} onClick={() => handleDelete(quote._id)}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </Button>
                                        </div>
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
