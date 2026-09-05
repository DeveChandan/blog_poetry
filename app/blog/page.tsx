import Link from "next/link"
import { connectDB } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Eye, Calendar, ArrowRight } from "lucide-react"
import { getGoogleDriveDirectLink } from "@/lib/gallery-utils"

async function getBlogs() {
    const db = await connectDB()
    return db.collection("blogs").find({ published: true }).sort({ createdAt: -1 }).toArray()
}

export default async function BlogPage() {
    const blogs = await getBlogs()

    return (
        <main className="min-h-screen bg-gradient-to-b from-background to-muted/20 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                        <BookOpen className="h-4 w-4" />
                        <span className="text-sm font-medium">Articles & Stories</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                        Blog
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Thoughts, stories, and insights on literature, poetry, and life
                    </p>
                </div>

                {/* Blog Grid */}
                {blogs.length === 0 ? (
                    <div className="text-center py-12">
                        <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground text-lg">No blog posts yet</p>
                        <p className="text-sm text-muted-foreground">Check back soon for articles!</p>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog: any) => (
                            <Link key={blog._id.toString()} href={`/blog/${blog.slug}`}>
                                <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-border/50 overflow-hidden group">
                                    {blog.image && (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={getGoogleDriveDirectLink(blog.image)}
                                                alt={blog.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                            <Calendar className="h-3.5 w-3.5" />
                                            {new Date(blog.createdAt).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                            <span className="mx-2">•</span>
                                            <Eye className="h-3.5 w-3.5" />
                                            {blog.views || 0}
                                        </div>
                                        <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                            {blog.title}
                                        </h3>
                                        <p className="text-muted-foreground line-clamp-3 mb-4">
                                            {blog.excerpt}
                                        </p>
                                        {blog.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 mb-4">
                                                {blog.tags.slice(0, 2).map((tag: string) => (
                                                    <Badge key={tag} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                        <span className="text-primary font-medium flex items-center gap-1 text-sm">
                                            Read More
                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                        </span>
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
