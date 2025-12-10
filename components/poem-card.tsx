import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface PoemCardProps {
  id: string
  title: string
  excerpt: string
  tags: string[]
  views: number
}

export default function PoemCard({ id, title, excerpt, tags, views }: PoemCardProps) {
  return (
    <Link href={`/poems/${id}`}>
      <Card className="hover:border-primary hover:shadow-lg hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer h-full">
        <CardHeader>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3 mb-4">{excerpt}</p>
          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-2">
              {tags.slice(0, 2).map((tag) => (
                <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-muted-foreground">{views} views</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
