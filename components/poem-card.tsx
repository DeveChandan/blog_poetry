"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTranslations } from "@/lib/language-context"
import { useLanguage } from "@/lib/language-context"

interface PoemCardProps {
  id: string
  title: string
  excerpt: string
  tags: string[]
  views: number
}

export default function PoemCard({ id, title, excerpt, tags, views }: PoemCardProps) {
  const { t } = useTranslations()
  const { currentLanguage, translate } = useLanguage()
  const [translatedTitle, setTranslatedTitle] = useState(title)
  const [translatedExcerpt, setTranslatedExcerpt] = useState(excerpt)

  useEffect(() => {
    // Reset to original if English
    if (currentLanguage.code === 'en') {
      setTranslatedTitle(title)
      setTranslatedExcerpt(excerpt)
      return
    }

    // Translate title and excerpt
    const translateContent = async () => {
      const [newTitle, newExcerpt] = await Promise.all([
        translate(title),
        translate(excerpt)
      ])
      setTranslatedTitle(newTitle)
      setTranslatedExcerpt(newExcerpt)
    }

    translateContent()
  }, [currentLanguage, title, excerpt, translate])

  return (
    <Link href={`/poems/${id}`}>
      <Card className="hover:border-primary hover:shadow-lg hover:-translate-y-1 transition duration-300 ease-in-out cursor-pointer h-full">
        <CardHeader>
          <CardTitle className="line-clamp-2">{translatedTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground line-clamp-3 mb-4">{translatedExcerpt}</p>
          <div className="flex justify-between items-center text-sm">
            <div className="flex gap-2">
              {tags.slice(0, 2).map((tag) => (
                <span key={tag} className="bg-primary/10 text-primary px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>
            <span className="text-muted-foreground">{views} {t('views')}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
