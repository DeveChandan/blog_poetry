import Link from "next/link"
import { connectDB } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenTool, Eye, Heart } from "lucide-react"

async function getSher() {
    const db = await connectDB()
    return db.collection("sher").find({}).sort({ createdAt: -1 }).toArray()
}

export default async function SherPage() {
    const sherList = await getSher()

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                        <PenTool className="h-4 w-4" />
                        <span className="text-sm font-medium">शेर Collection</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Sher
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Beautiful two-line couplets that capture profound emotions in just a few words
                    </p>
                </div>

                {/* Sher Grid */}
                {sherList.length === 0 ? (
                    <div className="text-center py-12">
                        <PenTool className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground text-lg">No sher found yet</p>
                        <p className="text-sm text-muted-foreground">Check back soon for beautiful sher!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {sherList.map((sher: any) => (
                            <Card key={sher._id.toString()} className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden">
                                <CardContent className="p-6 md:p-8">
                                    <div className="space-y-2 text-lg md:text-xl leading-relaxed italic text-foreground/90">
                                        <p className="border-l-4 border-primary/50 pl-4">{sher.line1}</p>
                                        <p className="border-l-4 border-primary/30 pl-4">{sher.line2}</p>
                                    </div>
                                    <div className="mt-6 pt-4 border-t border-border/50">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Eye className="h-3.5 w-3.5" />
                                                    {sher.views || 0}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Heart className="h-3.5 w-3.5" />
                                                    {sher.likes || 0}
                                                </span>
                                            </div>
                                            {sher.poet && (
                                                <span className="text-sm text-primary font-medium">- {sher.poet}</span>
                                            )}
                                        </div>
                                        {sher.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {sher.tags.slice(0, 3).map((tag: string) => (
                                                    <Badge key={tag} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
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
