"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Slide {
    _id: string
    title: string
    subtitle: string
    image: string
    link: string
    buttonText: string
}

export default function HomeSlider() {
    const [slides, setSlides] = useState<Slide[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchSliders() {
            try {
                const res = await fetch('/api/sliders')
                if (res.ok) {
                    const data = await res.json()
                    setSlides(data)
                }
            } catch (error) {
                console.error("Failed to fetch sliders:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchSliders()
    }, [])

    // Auto-advance slides
    useEffect(() => {
        if (slides.length <= 1) return

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % slides.length)
        }, 5000)

        return () => clearInterval(timer)
    }, [slides.length])

    const goToSlide = (index: number) => {
        setCurrentIndex(index)
    }

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length)
    }

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % slides.length)
    }

    if (loading) {
        return (
            <div className="relative h-[60vh] md:h-[70vh] bg-gradient-to-br from-primary/10 to-muted animate-pulse" />
        )
    }

    if (slides.length === 0) {
        return null
    }

    return (
        <section className="relative h-[60vh] md:h-[70vh] overflow-hidden group">
            {/* Slides */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0"
                >
                    {/* Background Image - Clickable */}
                    {slides[currentIndex].link ? (
                        <Link href={slides[currentIndex].link} className="absolute inset-0 z-0 block cursor-pointer">
                            <Image
                                src={slides[currentIndex].image}
                                alt={slides[currentIndex].title}
                                fill
                                className="object-cover"
                                priority
                                quality={100}
                                unoptimized
                            />
                        </Link>
                    ) : (
                        <div className="absolute inset-0 z-0">
                            <Image
                                src={slides[currentIndex].image}
                                alt={slides[currentIndex].title}
                                fill
                                className="object-cover"
                                priority
                                quality={100}
                                unoptimized
                            />
                        </div>
                    )}

                    {/* Content removed as per user request - only clickable image remains */}
                </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            {slides.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full p-2 md:p-3 text-white transition-all shadow-lg ring-2 ring-white/20"
                        aria-label="Previous slide"
                    >
                        <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full p-2 md:p-3 text-white transition-all shadow-lg ring-2 ring-white/20"
                        aria-label="Next slide"
                    >
                        <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
                    </button>
                </>
            )}

            {/* Dots */}
            {slides.length > 1 && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`w-2.5 h-2.5 rounded-full transition-all shadow-lg ring-2 ring-white/30 ${index === currentIndex
                                ? 'bg-white w-8'
                                : 'bg-black/50 hover:bg-black/70'
                                }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            )}
        </section>
    )
}
