import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"

interface VideoCardProps {
  id: string
  title: string
  description: string
  thumbnail: string
  views: number
}

export default function VideoCard({ id, title, description, thumbnail, views }: VideoCardProps) {
  return (
    <Link href={`/videos/${id}`}>
      <Card className="cursor-pointer hover:border-primary hover:shadow-lg hover:-translate-y-1 transition duration-300 ease-in-out h-full">
        <CardContent className="p-0">
          <div className="relative aspect-video bg-muted overflow-hidden rounded-t-lg">
            <img
              src={thumbnail || "/placeholder.svg?height=180&width=320&query=youtube-video-thumbnail"}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-xs">Play Video</div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-foreground line-clamp-2">{title}</h3>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{description}</p>
            <p className="text-xs text-muted-foreground mt-3">{views} views</p>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
