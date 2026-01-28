"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    BookOpen,
    PenTool,
    ArrowRight,
    Sparkles
} from "lucide-react"
import { useTranslations, useLanguage } from "@/lib/language-context"

export function TranslatableHero() {
    const { t, isRtl } = useTranslations()
    const { currentLanguage } = useLanguage()

    return (
        <section className="relative min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-muted/10 z-0" />
            <div className="absolute inset-0 overflow-hidden z-0">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
            </div>
            <div className="relative z-10 max-w-6xl mx-auto text-center" dir={isRtl ? 'rtl' : 'ltr'}>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('welcome')}</span>
                </div>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
                    {t('heroTitle')}
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
                    {currentLanguage.code === 'en'
                        ? "Dive into a collection of modern poetry, heartfelt verses, and literary explorations by Chandan Mondal — where technology meets creativity."
                        : currentLanguage.code === 'hi'
                            ? "चंदन मोंडल द्वारा आधुनिक कविता, हृदयस्पर्शी छंद और साहित्यिक अन्वेषण के संग्रह में गोता लगाएँ — जहाँ तकनीक रचनात्मकता से मिलती है।"
                            : currentLanguage.code === 'ur'
                                ? "چندن موندل کی جدید شاعری، دل کو چھونے والے اشعار اور ادبی تلاش کے مجموعے میں غوطہ لگائیں — جہاں ٹیکنالوجی تخلیقیت سے ملتی ہے۔"
                                : "চন্দন মন্ডলের আধুনিক কবিতা, হৃদয়গ্রাহী পদ এবং সাহিত্যিক অনুসন্ধানের সংগ্রহে ডুব দিন — যেখানে প্রযুক্তি সৃজনশীলতার সাথে মিলিত হয়।"
                    }
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button asChild size="lg" className="group">
                        <Link href="/poems" className="flex items-center gap-2">
                            <PenTool className="h-5 w-5" />
                            {t('explorePoems')}
                            <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </Button>
                    <Button asChild variant="outline" size="lg" className="group">
                        <Link href="/about" className="flex items-center gap-2">
                            <BookOpen className="h-5 w-5" />
                            {t('aboutAuthor')}
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    )
}

export function TranslatableSectionTitle({ titleKey, children }: { titleKey: 'featuredPoems' | 'featuredVideos' | 'publishedBooks', children?: React.ReactNode }) {
    const { t, isRtl } = useTranslations()

    return (
        <div className="flex items-center justify-between mb-12" dir={isRtl ? 'rtl' : 'ltr'}>
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                    {t(titleKey)}
                </h2>
            </div>
            {children}
        </div>
    )
}
