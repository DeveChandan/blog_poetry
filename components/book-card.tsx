import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface BookCardProps {
  id: string
  title: string
  description: string
  price: number
  type: string
  cover: string
}

export default function BookCard({ id, title, description, price, type, cover }: BookCardProps) {
  return (
    <Link href={`/books/${id}`}>
      <Card className="hover:border-primary hover:shadow-lg hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer h-full flex flex-col">
        <div className="aspect-video bg-muted overflow-hidden rounded-t-lg">
          {cover ? (
            <img src={cover || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-primary/10">
              <span className="text-muted-foreground">No Cover</span>
            </div>
          )}
        </div>
        <CardHeader>
          <CardTitle className="line-clamp-2">{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col justify-between">
          <p className="text-muted-foreground line-clamp-2 mb-4">{description}</p>
          <div className="flex justify-between items-end">
            <div className="flex gap-2">
              <Badge>{type === "physical" ? "Paperback" : type === "ebook" ? "E-book" : "Both"}</Badge>
            </div>
            <span className="text-lg font-bold text-primary">${price}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
