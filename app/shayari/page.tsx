import { Suspense } from "react"
import Link from "next/link"
import { connectDB } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Feather, Eye, Heart, ArrowRight } from "lucide-react"

async function getShayari() {
    const db = await connectDB()
    return db.collection("shayari").find({}).sort({ createdAt: -1 }).toArray()
}

export default async function ShayariPage() {
    const shayariList = await getShayari()

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                        <Feather className="h-4 w-4" />
                        <span className="text-sm font-medium">शायरी Collection</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Shayari
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Explore beautiful shayari expressing emotions of love, life, and philosophy
                    </p>
                </div>

                {/* Shayari Grid */}
                {shayariList.length === 0 ? (
                    <div className="text-center py-12">
                        <Feather className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground text-lg">No shayari found yet</p>
                        <p className="text-sm text-muted-foreground">Check back soon for beautiful shayari!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {shayariList.map((shayari: any) => (
                            <Link key={shayari._id.toString()} href={`/shayari/${shayari._id}`}>
                                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm">
                                    <CardContent className="p-6">
                                        {shayari.title && (
                                            <h3 className="font-bold text-lg text-foreground mb-3">{shayari.title}</h3>
                                        )}
                                        <p className="text-foreground/90 leading-relaxed whitespace-pre-line line-clamp-4 italic">
                                            "{shayari.content}"
                                        </p>
                                        <div className="mt-4 pt-4 border-t border-border/50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Eye className="h-3.5 w-3.5" />
                                                        {shayari.views || 0}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Heart className="h-3.5 w-3.5" />
                                                        {shayari.likes || 0}
                                                    </span>
                                                </div>
                                                {shayari.author && (
                                                    <span className="text-sm text-primary font-medium">- {shayari.author}</span>
                                                )}
                                            </div>
                                            {shayari.tags?.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-3">
                                                    {shayari.tags.slice(0, 3).map((tag: string) => (
                                                        <Badge key={tag} variant="outline" className="text-xs">
                                                            {tag}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}
