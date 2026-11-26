"use client"

import React, { useEffect, useState, useRef, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView, AnimatePresence, type Variants } from "framer-motion"
import { useTranslations, useLanguage } from "@/lib/language-context"
import LanguageSelector from "@/components/language-selector"
import { Facebook, Twitter, Instagram, Youtube, Linkedin, ChevronLeft, ChevronRight, Mail, Info, Menu, X, Play } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"

// ─── Dynamic Translit/Translation Helper ───
const TranslatedPoemTitle = ({ title }: { title: string }) => {
  const { currentLanguage, translate } = useLanguage()
  const [translatedTitle, setTranslatedTitle] = useState(title)

  useEffect(() => {
    let cancelled = false

    if (!title) return

    if (currentLanguage.code === "en") {
      if (/[\u0900-\u097F]/.test(title)) {
        translate(title)
          .then((res) => {
            if (!cancelled) setTranslatedTitle(res)
          })
          .catch(console.error)
      } else {
        setTranslatedTitle(title)
      }
      return () => {
        cancelled = true
      }
    }

    if (
      currentLanguage.code === "hi" &&
      /^[\u0900-\u097F\s\d.,!?।'"\-–—:;()•…]+$/.test(title)
    ) {
      setTranslatedTitle(title)
      return
    }

    translate(title)
      .then((res) => {
        if (!cancelled) setTranslatedTitle(res)
      })
      .catch(console.error)

    return () => {
      cancelled = true
    }
  }, [currentLanguage.code, title, translate])

  return <>{translatedTitle}</>
}

// ─── Animation Variants ───
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
}

const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
}

const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const TitleSeparator = () => (
  <span className="opacity-30 mx-3 hidden sm:inline-block">|</span>
)

// ═══════════════════════════════════════════════
// VINTAGE HEADER
// ═══════════════════════════════════════════════
function VintageHeader({ t }: { t: (key: any) => string }) {
  return (
    <motion.section
      className="vintage-header-exact relative flex flex-col items-center"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <div className="absolute top-4 right-4 z-50">
        <LanguageSelector />
      </div>

      {/* Main emblem logo */}


      <motion.h1 className="vintage-exact-title" variants={fadeInUp}>
        {t("siteTitle")}
      </motion.h1>

      <motion.nav className="vintage-exact-nav" variants={fadeInUp}>
        <div className="vintage-nav-lines">
          <Link href="/poems" className="vintage-exact-link">{t("poems")}</Link>
          <TitleSeparator />
         {/* <Link href="/shayari" className="vintage-exact-link">{t("shayari")}</Link>
          <TitleSeparator /> */}
          <Link href="/books" className="vintage-exact-link">{t("books")}</Link>
          <TitleSeparator />
          <Link href="/blog" className="vintage-exact-link">{t("blog")}</Link>
                <TitleSeparator />
               <Link href="/quotes" className="vintage-exact-link text-sm xl:text-base whitespace-nowrap">{t('quotes') || 'Quotes'}</Link>
               <TitleSeparator />
       <Link href="/gallery" className="vintage-exact-link text-sm xl:text-base whitespace-nowrap">{t('gallery') || 'Gallery'}</Link>
          <TitleSeparator />
          <Link href="/videos" className="vintage-exact-link">{t("videos")}</Link>
          <TitleSeparator />
          <Link href="/about" className="vintage-exact-link">{t("about")}</Link>
        </div>
      </motion.nav>
    </motion.section>
  )
}

// ═══════════════════════════════════════════════
// HERO SECTION
// ═══════════════════════════════════════════════
const HeroSection = memo(function HeroSection({ t, sliders }: { t: (key: any) => string, sliders?: any[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const slidersLen = sliders?.length ?? 0

  useEffect(() => {
    if (slidersLen <= 1) return
    const interval = setInterval(() => {
      if (!document.hidden) {
        setCurrentIndex((prev) => (prev + 1) % slidersLen)
      }
    }, 5000)
    return () => clearInterval(interval)
  }, [slidersLen])

  const hasSliders = slidersLen > 0
  const currentImage = hasSliders ? sliders![currentIndex].image : "/vintage-desk.png"
  const currentQuote = hasSliders && sliders![currentIndex].title ? sliders![currentIndex].title : t("heroQuote")

  return (
    <motion.section
      className="vintage-exact-hero"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="vintage-exact-hero-image-wrapper">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
            style={{ willChange: "opacity", transform: "translateZ(0)" }}
          >
            <Image
              src={currentImage || "/vintage-desk.png"}
              alt="Hero image"
              fill
              sizes="100vw"
              className="vintage-hero-image"
              priority
            />
          </motion.div>
        </AnimatePresence>
        {/* Overlay text in the hero image aligned to the right */}
        <div className="vintage-hero-text-overlay relative z-10">
          {/* <h2>{currentQuote}</h2> */}
        </div>
      </div>
    </motion.section>
  )
})

// ═══════════════════════════════════════════════
// FEATURED TABS: LITERATURE CLUB & QUARTERLY MAGAZINE
// ═══════════════════════════════════════════════
const FeaturedClubMagazineTabs = memo(function FeaturedClubMagazineTabs({ t }: { t: (key: any) => string }) {
  return (
    <motion.section
      className="max-w-[1400px] mx-auto px-4 md:px-12 py-5 md:py-8"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeInUp}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-7 items-stretch">
        
        {/* ── Tab 1: RSUNKAHI Literature Club ── */}
        <Link
          href="/literature-club"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-amber-800/30 dark:border-amber-700/40 bg-gradient-to-br from-[#381c10] via-[#231108] to-[#140804] p-4 sm:p-5 lg:p-6 shadow-[0_8px_24px_rgba(30,15,8,0.3)] hover:shadow-[0_12px_36px_rgba(212,175,55,0.25)] hover:border-[#d4af37]/50 hover:-translate-y-1 transition-all duration-300"
          title="RSUNKAHI Literature Club"
        >
          {/* Ambient warm glow behind mic */}
          <div className="absolute -left-8 -top-8 w-56 h-56 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute left-16 bottom-0 w-32 h-32 bg-orange-600/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 lg:gap-5 w-full">
            {/* Left: Mic & English Titles */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <div className="relative w-16 sm:w-20 lg:w-22 flex-shrink-0">
                <Image
                  src="/vintage-mic.svg"
                  alt="Vintage Studio Microphone"
                  width={90}
                  height={112}
                  className="w-full h-auto drop-shadow-[0_4px_16px_rgba(245,158,11,0.45)] transition-transform duration-500 group-hover:scale-105"
                />
              </div>

              <div className="flex flex-col text-left">
                <span className="text-[11px] sm:text-xs font-serif font-bold tracking-[0.25em] text-[#f3ddb3] uppercase">
                  RSUNKAHI
                </span>
                <span className="text-xl sm:text-2xl lg:text-[28px] font-serif text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 font-medium leading-tight">
                  Literature Club
                </span>
                {/* Gold Flourish */}
                <svg viewBox="0 0 160 14" className="w-28 sm:w-36 h-2.5 mt-1 text-[#d4af37]" fill="none">
                  <path d="M5 7h45c12 0 18-4 25-4s13 4 25 4h45" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
                  <path d="M68 7c4 3 12 3 16 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  <circle cx="76" cy="7" r="2" fill="currentColor" />
                </svg>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="hidden sm:block w-[1.5px] h-20 bg-gradient-to-b from-transparent via-[#d4af37]/40 to-transparent flex-shrink-0" />

            {/* Right: Hindi Tagline & Categories */}
            <div className="flex flex-col text-center sm:text-left justify-center flex-grow">
              <p className="font-serif sm:font-sans font-bold text-base sm:text-lg lg:text-[19px] text-[#fff7ed] leading-snug tracking-wide">
                हर आवाज़ को मंच,<br />
                हर रचना को पहचान।
              </p>
              <p className="text-[11px] sm:text-xs lg:text-sm text-amber-200/80 mt-2 font-medium tracking-wide">
                कविता • कहानी • ग़ज़ल • विचार • और भी बहुत कुछ
              </p>
            </div>
          </div>
        </Link>

        {/* ── Tab 2: RSUNKAHI Quarterly Magazine ── */}
        <Link
          href="/books"
          className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#3c2a1e]/15 dark:border-[#e6dfcd]/20 bg-gradient-to-br from-[#fdfbf7] via-[#f7f0e4] to-[#ece0cd] p-4 sm:p-5 lg:p-6 shadow-[0_8px_24px_rgba(60,42,30,0.14)] hover:shadow-[0_12px_36px_rgba(60,42,30,0.24)] hover:border-[#3c2a1e]/35 hover:-translate-y-1 transition-all duration-300"
          title="RSUNKAHI Quarterly Magazine"
        >
          <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 lg:gap-5 w-full">
            {/* Left: Book Icon & Titles */}
            <div className="flex flex-col items-center sm:items-center text-center flex-shrink-0">
              <div className="w-9 h-7 text-[#c59b27] flex items-center justify-center mb-1">
                <svg viewBox="0 0 24 24" className="w-8 h-8 fill-current drop-shadow-sm">
                  <path d="M12 4.5C10.5 3.5 8 3 5 3C3 3 2 3.5 2 3.5V18.5C2 18.5 3.5 18 5 18C8 18 10.5 19 12 20.5C13.5 19 16 18 19 18C20.5 18 22 18.5 22 18.5V3.5C22 3.5 21 3 19 3C16 3 13.5 3.5 12 4.5ZM11 18C9.5 16.8 7.5 16.5 5 16.5V5C7 5 9 5.5 11 6.5V18ZM20 16.5C17.5 16.5 15.5 16.8 14 18V6.5C16 5.5 18 5 20 5V16.5Z" />
                </svg>
              </div>

              <span className="text-[11px] sm:text-xs font-serif font-bold tracking-[0.25em] text-[#3c2317] uppercase">
                RSUNKAHI
              </span>
              <span className="text-xl sm:text-2xl lg:text-[27px] font-serif text-[#2b160a] font-normal leading-tight">
                Quarterly Magazine
              </span>
              {/* Gold Flourish */}
              <svg viewBox="0 0 160 14" className="w-28 sm:w-36 h-2.5 mt-1 text-[#c5a059]" fill="none">
                <path d="M5 7h45c12 0 18-4 25-4s13 4 25 4h45" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.8" />
                <path d="M68 7c4 3 12 3 16 0" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                <circle cx="76" cy="7" r="2" fill="currentColor" />
              </svg>
            </div>

            {/* Vertical Divider */}
            <div className="hidden sm:block w-[1.5px] h-20 bg-gradient-to-b from-transparent via-[#3c2a1e]/20 to-transparent flex-shrink-0" />

            {/* Middle: Hindi Tagline & Action Button */}
            <div className="flex flex-col text-center sm:text-left justify-center flex-grow">
              <p className="font-serif sm:font-sans font-bold text-sm sm:text-base lg:text-[17px] text-[#2c180e] leading-snug">
                समकालीन रचनाकारों की<br />
                चयनित रचनाओं की त्रैमासिक पत्रिका
              </p>
              <div>
                <span className="inline-flex items-center justify-center gap-1.5 mt-3 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#d97706] to-[#b45309] text-white font-sans text-xs sm:text-sm font-bold shadow-md group-hover:from-[#b45309] group-hover:to-[#92400e] transition-all">
                  नवीनतम अंक पढ़ें →
                </span>
              </div>
            </div>

            {/* Right: 3D Magazine Cover Mockup */}
            <div className="relative w-20 sm:w-24 lg:w-26 flex-shrink-0">
              <Image
                src="/magazine-3d-mockup.svg"
                alt="RSUNKAHI Quarterly Magazine Mockup"
                width={110}
                height={125}
                className="w-full h-auto drop-shadow-[0_8px_20px_rgba(60,42,30,0.22)] transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>
        </Link>

      </div>
    </motion.section>
  )
})

// ═══════════════════════════════════════════════
// 3 COLUMNS SECTION
// ═══════════════════════════════════════════════
// ═══════════════════════════════════════════════
// VINTAGE CAROUSEL (Consolidated Sections)
// ═══════════════════════════════════════════════
const VintageCarousel = memo(function VintageCarousel({
  poems,
  books,
  t,
  recentVideo,
  settings
}: {
  poems: any[]
  books: any[]
  t: (key: any) => string
  recentVideo: any
  settings?: any
}) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
    slidesToScroll: 1,
  })
  const [playVideo, setPlayVideo] = useState(false)

  useEffect(() => {
    if (!emblaApi) return

    const autoplay = () => {
      if (document.hidden) return
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext()
      } else {
        emblaApi.scrollTo(0)
      }
    }

    const intervalId = setInterval(autoplay, 5000)

    return () => clearInterval(intervalId)
  }, [emblaApi])

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev()
  const scrollNext = () => emblaApi && emblaApi.scrollNext()

  return (
    <div className="relative max-w-[1400px] mx-auto py-16 px-4 md:px-12 overflow-hidden">
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex gap-6">

          {/* ── Slide 1: Poems ── */}
          <div className="embla__slide flex-[0_0_85%] md:flex-[0_0_48%] lg:flex-[0_0_30%] min-w-0">
            <div className="vintage-col h-full">
              <div className="vintage-col-header">
                <span className="line"></span>
                <h3>{t("poemsSection")}</h3>
                <span className="line"></span>
              </div>
              <div className="vintage-col-1-box h-full min-h-[450px]">
                <ul className="vintage-col-1-list">
                  {(poems || []).slice(0, 4).map((p, i) => (
                    <li key={p._id || i}>
                      <span>•</span>{" "}
                      <Link href={`/poems/${p._id}`} className="hover:underline hover:text-primary transition-colors">
                        <TranslatedPoemTitle title={p.title} />
                      </Link>
                    </li>
                  ))}
                  {(!poems || poems.length === 0) && (
                    <>
                      <li><span>•</span> देव नदी वाद....</li>
                      <li><span>•</span> ओंटन की याद....</li>
                      <li><span>•</span> राफ्तने मे अद्रह....</li>
                      <li><span>•</span> मेर वड....</li>
                    </>
                  )}
                </ul>
                <div className="vintage-btn-wrapper-left">
                  <Link href="/poems" className="vintage-exact-btn-light">
                    {t("morePoems")}
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* ── Slide 2: My Books ── */}
          <div className="embla__slide flex-[0_0_85%] md:flex-[0_0_48%] lg:flex-[0_0_30%] min-w-0">
            <div className="vintage-col h-full">
              <div className="vintage-col-header">
                <span className="line"></span>
                <h3>{t("myBooks")}</h3>
                <span className="line"></span>
              </div>
              <div className="vintage-col-2-box h-full min-h-[450px]">
                <div className="vintage-books-display">
                  <div className="vintage-books-frame min-h-[220px]">
                    <Image src={books[0]?.cover || "/placeholder.jpg"} alt="Book 1" width={110} height={160} sizes="110px" className="framed-book" />
                    <Image src={books[1]?.cover || "/placeholder.jpg"} alt="Book 2" width={110} height={160} sizes="110px" className="framed-book" />
                  </div>
                  <div className="vintage-books-actions mt-4">
                    <Link href="/books" className="vintage-exact-btn-light">{t("readMore")}</Link>
                    <Link href="/books" className="vintage-exact-btn-light">{t("buyNow")}</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Slide 3: Poetry Ray ── */}
          <div className="embla__slide flex-[0_0_85%] md:flex-[0_0_48%] lg:flex-[0_0_30%] min-w-0">
            <div className="vintage-col h-full">
              <div className="vintage-col-header">
                <span className="line"></span>
                <h3>{t("poetryRay")}</h3>
                <span className="line"></span>
              </div>
              <div className="vintage-col-1-box h-full min-h-[450px]">
                {recentVideo ? (
                  <div className="w-full flex flex-col gap-3">
                    <div className="relative w-full aspect-video rounded overflow-hidden shadow-inner bg-black">
                      {recentVideo.youtubeId ? (
                        playVideo ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${recentVideo.youtubeId}?autoplay=1&rel=0`}
                            title={recentVideo.title}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            className="absolute top-0 left-0 w-full h-full"
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => setPlayVideo(true)}
                            className="group relative w-full h-full cursor-pointer text-left"
                            aria-label={`Play ${recentVideo.title}`}
                          >
                            <img
                              src={`https://img.youtube.com/vi/${recentVideo.youtubeId}/hqdefault.jpg`}
                              alt={recentVideo.title}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors flex items-center justify-center">
                              <span className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                <Play className="w-5 h-5 fill-current ml-0.5" />
                              </span>
                            </div>
                          </button>
                        )
                      ) : (
                        <div className="flex items-center justify-center w-full h-full text-white">Video unavailable</div>
                      )}
                    </div>
                    <h4 className="poetry-title text-center text-[1rem] leading-tight mt-2 hover:underline hover:text-primary transition-colors">
                      <Link href={`/videos/${recentVideo._id}`}>
                        <TranslatedPoemTitle title={recentVideo.title} />
                      </Link>
                    </h4>
                    <div className="vintage-btn-wrapper-left">
                      <Link href="/videos" className="vintage-exact-btn-light">
                        {t("MoreVideos")}
                      </Link>
                    </div>
                  </div>
                ) : (
                  <>
                    <h4 className="poetry-title">{t("pathsInWords")}</h4>
                    <p className="poetry-text mt-2">
                      समहते shabdoa में अन्यामनु उरेहा वरिचनागत,
                      नब नोरे गैटटं नब नद ह इरुष्ट दुतेऐजेन्द...
                    </p>
                    <div className="vintage-btn-wrapper-left">
                      <Link href="/blog" className="vintage-exact-btn-light">
                        {t("MoreVideos")}
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ── Slide 4: Instagram Reels ── */}
          <div className="embla__slide flex-[0_0_85%] md:flex-[0_0_48%] lg:flex-[0_0_30%] min-w-0">
            <div className="vintage-col h-full">
              <div className="vintage-col-header">
                <span className="line"></span>
                 <h3>{t("Reels")}</h3>
                <span className="line"></span>
              </div>
              <div className="vintage-col-1-box h-full min-h-[450px] p-2 flex items-center justify-center">
                {settings?.featuredInstagramReel ? (
                  <iframe
                    src={`${settings.featuredInstagramReel.split("?")[0].replace(/\/$/, "")}/embed`}
                    loading="lazy"
                    allow="encrypted-media"
                    className="rounded bg-white w-full max-w-[320px]"
                    style={{ height: '380px' }}
                  ></iframe>
                ) : (
                  <div className="text-[#3c2a1e] opacity-50 italic">No Reel Featured</div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-[#f4e8d4] border border-[#3c2a1e]/20 text-[#3c2a1e] hover:bg-[#3c2a1e] hover:text-[#f4e8d4] transition-all shadow-md hidden md:block"
      >
        <ChevronLeft size={24} />
      </button>
      <button
        onClick={scrollNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-[#f4e8d4] border border-[#3c2a1e]/20 text-[#3c2a1e] hover:bg-[#3c2a1e] hover:text-[#f4e8d4] transition-all shadow-md hidden md:block"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  )
})

// ═══════════════════════════════════════════════
// COMBINED FOOTER (Subscribe & Info)
// ═══════════════════════════════════════════════
const VintageCombinedFooter = memo(function VintageCombinedFooter({
  t,
  settings
}: {
  t: any
  settings?: any
}) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !message) return
    setLoading(true)
    setStatus("idle")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      })
      if (res.ok) {
        setStatus("success")
        setName("")
        setEmail("")
        setMessage("")
        setTimeout(() => setStatus("idle"), 5000)
      } else {
        setStatus("error")
      }
    } catch (err) {
      setStatus("error")
    } finally {
      setLoading(false)
    }
  }

  const socialLinks = [
    { id: 'facebook', icon: Facebook, name: 'Facebook', url: settings?.facebook },
    { id: 'twitter', icon: Twitter, name: 'Twitter', url: settings?.twitter },
    { id: 'instagram', icon: Instagram, name: 'Instagram', url: settings?.instagram },
    { id: 'youtube', icon: Youtube, name: 'YouTube', url: settings?.youtube },
    { id: 'linkedin', icon: Linkedin, name: 'LinkedIn', url: settings?.linkedin },
  ].filter(link => link.url)

  return (
    <motion.section
      className="max-w-[1200px] mx-auto py-16 px-6 relative z-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeInUp}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-16">

        {/* ── Left: Subscription Form ── */}
        <div className="flex flex-col h-full">
          <div className="vintage-col-header mb-8">
            <span className="line"></span>
            <h3 className="whitespace-nowrap">{t("subscribeTitle")}</h3>
            <span className="line"></span>
          </div>

          <div className="bg-[#ebdcb9]/30 dark:bg-[#2c2317]/30 border border-[#3c2a1e]/15 dark:border-[#e6dfcd]/15 rounded-lg p-6 md:p-8 shadow-md relative overflow-hidden flex-grow flex flex-col justify-center">
            {/* Corner decorations */}
            <div className="absolute top-0 right-0 w-12 h-12 pointer-events-none opacity-10 border-t-2 border-r-2 border-[#3c2a1e] dark:border-[#e6dfcd] m-2"></div>
            <div className="absolute bottom-0 left-0 w-12 h-12 pointer-events-none opacity-10 border-b-2 border-l-2 border-[#3c2a1e] dark:border-[#e6dfcd] m-2"></div>

            <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("nameLabel")}
                  className="w-full bg-[#fcf9f2] dark:bg-[#1a150f] border border-[#3c2a1e]/25 dark:border-[#e6dfcd]/25 rounded px-4 py-3 font-serif text-[#3c2a1e] dark:text-[#e6dfcd] placeholder-[#3c2a1e]/50 dark:placeholder-[#e6dfcd]/50 outline-none focus:border-[#3c2a1e] dark:focus:border-[#e6dfcd] transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <input
                  type="email"
                  placeholder={t("emailLabel")}
                  className="w-full bg-[#fcf9f2] dark:bg-[#1a150f] border border-[#3c2a1e]/25 dark:border-[#e6dfcd]/25 rounded px-4 py-3 font-serif text-[#3c2a1e] dark:text-[#e6dfcd] placeholder-[#3c2a1e]/50 dark:placeholder-[#e6dfcd]/50 outline-none focus:border-[#3c2a1e] dark:focus:border-[#e6dfcd] transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="relative">
                <textarea
                  placeholder={t("messageLabel")}
                  className="w-full bg-[#fcf9f2] dark:bg-[#1a150f] border border-[#3c2a1e]/25 dark:border-[#e6dfcd]/25 rounded px-4 py-3 font-serif text-[#3c2a1e] dark:text-[#e6dfcd] placeholder-[#3c2a1e]/50 dark:placeholder-[#e6dfcd]/50 outline-none focus:border-[#3c2a1e] dark:focus:border-[#e6dfcd] transition-colors resize-none"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              {status === "success" && (
                <p className="text-green-800 dark:text-green-400 font-semibold italic text-sm text-center">Message sent successfully!</p>
              )}
              {status === "error" && (
                <p className="text-red-700 dark:text-red-400 font-semibold italic text-sm text-center">Failed to send message.</p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#3c2a1e] text-[#f4e8d4] dark:bg-[#e6dfcd] dark:text-[#1f1a14] font-serif font-bold text-base rounded shadow hover:bg-[#523b2b] dark:hover:bg-[#fcf9f2] transition-colors active:scale-[0.98] transform duration-150 disabled:opacity-50 mt-2"
                disabled={loading}
              >
                {loading ? "Sending..." : t("sendButton")}
              </button>
            </form>
          </div>
        </div>

        {/* ── Right: Information & Social ── */}
        <div className="flex flex-col h-full">
          <div className="vintage-col-header mb-8">
            <span className="line"></span>
            <h3 className="whitespace-nowrap">{t("footerInformation")}</h3>
            <span className="line"></span>
          </div>

          <div className="bg-[#ebdcb9]/30 dark:bg-[#2c2317]/30 border border-[#3c2a1e]/15 dark:border-[#e6dfcd]/15 rounded-lg p-2 md:p-3 shadow-md relative overflow-hidden flex-grow flex flex-col justify-between">
            {/* Corner decorations */}
            <div className="absolute top-0 left-0 w-12 h-12 pointer-events-none opacity-10 border-t-2 border-l-2 border-[#3c2a1e] dark:border-[#e6dfcd] m-2"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 pointer-events-none opacity-10 border-b-2 border-r-2 border-[#3c2a1e] dark:border-[#e6dfcd] m-2"></div>

            <div className="flex flex-col gap-6">
              {/* Logo Emblem branding inside info section */}
              <div className="flex flex-col items-center border-b border-[#3c2a1e]/10 dark:border-[#e6dfcd]/10">
                <div className="relative h-18 w-46 overflow-hidden">
                  <Image
                    src="/IMG_1790.PNG"
                    alt="Unkahi"
                    fill
                    sizes="560px"
                    className="object-contain mix-blend-multiply dark:brightness-200 dark:invert"
                  />
                </div>

              </div>

              {/* Contact Items */}
              <div className="flex flex-col gap-6 py-2">
                <div className="flex items-center gap-4 text-[#3c2a1e] dark:text-[#e6dfcd]">
                  <div className="p-3 rounded-full bg-[#f4e8d4] dark:bg-[#1f1a14] border border-[#3c2a1e]/10 dark:border-[#e6dfcd]/10 shadow-inner flex-shrink-0">
                    <Mail size={20} className="text-[#3c2a1e] dark:text-[#e6dfcd]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase opacity-60 font-bold tracking-widest font-sans">{t("emailAddressLabel")}</p>
                    <p className="text-base md:text-lg font-serif font-bold">drrupeshpoetry@rsunkahi.com</p>
                  </div>
                </div>

                <Link href="/about" className="flex items-center gap-4 text-[#3c2a1e] dark:text-[#e6dfcd] group">
                  <div className="p-3 rounded-full bg-[#f4e8d4] dark:bg-[#1f1a14] border border-[#3c2a1e]/10 dark:border-[#e6dfcd]/10 shadow-inner flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <Info size={20} className="text-[#3c2a1e] dark:text-[#e6dfcd]" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase opacity-60 font-bold tracking-widest font-sans">{t("biographyLabel")}</p>
                    <p className="text-base md:text-lg font-serif font-bold group-hover:underline underline-offset-4 decoration-[#3c2a1e]/40 dark:decoration-[#e6dfcd]/40">
                      {t("aboutAuthorText")}
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Social Links Row */}
            <div className="mt-8 pt-6 border-t border-[#3c2a1e]/10 dark:border-[#e6dfcd]/10">
              <p className="text-[10px] uppercase opacity-60 font-bold tracking-widest font-sans text-center mb-4">{t("followJourney")}</p>
              <div className="flex items-center justify-center gap-3.5 flex-wrap">
                {socialLinks.map((social) => (
                  <Link
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 rounded-full bg-[#f4e8d4] dark:bg-[#1f1a14] border border-[#3c2a1e]/10 dark:border-[#e6dfcd]/10 text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e] hover:text-[#f4e8d4] dark:hover:bg-[#e6dfcd] dark:hover:text-[#1f1a14] transition-all shadow duration-300 hover:scale-110 flex items-center justify-center"
                    title={social.name}
                  >
                    <social.icon size={18} />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </motion.section>
  )
})

export default function VintageHome({
  stats,
  featuredPoems,
  recentBooks,
  recentBlogs,
  sliders = [],
  recentVideo,
  settings,
}: {
  stats: any
  featuredPoems: any[]
  recentBooks: any[]
  recentBlogs: any[]
  sliders?: any[]
  recentVideo?: any
  settings?: any
}) {
  const { t, isRtl } = useTranslations()

  return (
    <div className="vintage-master-container" dir={isRtl ? "rtl" : "ltr"}>

      <VintageHeader t={t} />
      <HeroSection t={t} sliders={sliders} />

      {/* ─── FEATURED TABS: LITERATURE CLUB & QUARTERLY MAGAZINE ─── */}
      <FeaturedClubMagazineTabs t={t} />

      {/* ─── 4-SECTION CAROUSEL ─── */}
      <div className="relative w-full">
        <VintageCarousel
          poems={featuredPoems}
          books={recentBooks}
          recentVideo={recentVideo}
          t={t}
          settings={settings}
        />
      </div>

      <div id="contact" className="relative w-full overflow-hidden">
        <VintageCombinedFooter t={t} settings={settings} />
      </div>
    </div>
  )
}

