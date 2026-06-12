"use client"

import React, { useEffect, useState, useRef, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useTranslations, useLanguage } from "@/lib/language-context"
import LanguageSelector from "@/components/language-selector"
import { Facebook, Twitter, Instagram, Youtube, Linkedin, ChevronLeft, ChevronRight, Mail, Info, Menu, X } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"

// ─── Dynamic Translit/Translation Helper ───
const TranslatedPoemTitle = ({ title }: { title: string }) => {
  const { currentLanguage, translate } = useLanguage()
  const [translatedTitle, setTranslatedTitle] = useState(title)

  useEffect(() => {
    if (currentLanguage.code === 'en') {
      if (/[\u0900-\u097F]/.test(title)) {
        translate(title).then(setTranslatedTitle).catch(console.error)
      } else {
        setTranslatedTitle(title)
      }
      return
    }
    translate(title).then(setTranslatedTitle).catch(console.error)
  }, [currentLanguage.code, title, translate])

  return <>{translatedTitle}</>
}

// ─── Animation Variants ───
const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
}

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1 } },
}

const staggerContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const TitleSeparator = () => (
  <span className="opacity-30 mx-3 hidden sm:inline-block">|</span>
)

// ═══════════════════════════════════════════════
// VISITOR COUNTER
// ═══════════════════════════════════════════════
const VintageVisitorCounter = memo(function VintageVisitorCounter({ t }: { t?: any }) {
  const [visits, setVisits] = useState<number | null>(null)

  useEffect(() => {
    // Check local storage to prevent unnecessary POST requests on refresh
    const hasVisitedLocally = localStorage.getItem("hasVisitedSite")

    if (!hasVisitedLocally) {
      // Record new visit
      fetch("/api/visit", { method: "POST" })
        .then(res => res.json())
        .then(data => {
          if (data.totalVisits) setVisits(data.totalVisits)
          if (data.newVisit !== undefined) {
            localStorage.setItem("hasVisitedSite", "true")
          }
        })
        .catch(console.error)
    } else {
      // Just fetch the current total without incrementing
      fetch("/api/visit")
        .then(res => res.json())
        .then(data => {
          if (data.totalVisits) setVisits(data.totalVisits)
        })
        .catch(console.error)
    }
  }, [])

  if (visits === null) return null

  return (
    <motion.div
      className="flex items-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
    >
      {/* <div className="inline-flex items-center gap-2 md:gap-3 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-[#f4e8d4] border border-[#3c2a1e]/20 shadow-inner text-[#3c2a1e]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
        </span>
        <span className="text-[10px] md:text-sm font-semibold tracking-widest uppercase opacity-80 whitespace-nowrap">
          {visits.toLocaleString()} Travelers
        </span>
      </div>*/}
    </motion.div>
  )
})

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
      <div className="absolute top-4 left-4 z-50">
        <VintageVisitorCounter />
      </div>

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
      setCurrentIndex((prev) => (prev + 1) % slidersLen)
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

      <div className="vintage-exact-quote-ribbon">
        {/*<p>“{t("welcomeQuote")}”</p>*/}
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

  useEffect(() => {
    if (!emblaApi) return

    const autoplay = () => {
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
                  {poems.slice(0, 4).map((p, i) => (
                    <li key={p._id || i}>
                      <span>•</span>{" "}
                      <Link href={`/poems/${p._id}`} className="hover:underline hover:text-primary transition-colors">
                        <TranslatedPoemTitle title={p.title} />
                      </Link>
                    </li>
                  ))}
                  {poems.length === 0 && (
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
                        <iframe
                          src={`https://www.youtube.com/embed/${recentVideo.youtubeId}?rel=0`}
                          title={recentVideo.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute top-0 left-0 w-full h-full"
                        />
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

          <div className="bg-[#ebdcb9]/30 dark:bg-[#2c2317]/30 border border-[#3c2a1e]/15 dark:border-[#e6dfcd]/15 rounded-lg p-6 md:p-8 shadow-md relative overflow-hidden backdrop-blur-sm flex-grow flex flex-col justify-center">
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

          <div className="bg-[#ebdcb9]/30 dark:bg-[#2c2317]/30 border border-[#3c2a1e]/15 dark:border-[#e6dfcd]/15 rounded-lg p-2 md:p-3 shadow-md relative overflow-hidden backdrop-blur-sm flex-grow flex flex-col justify-between">
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

      <div className="relative w-full overflow-hidden">
        <VintageCombinedFooter t={t} settings={settings} />
      </div>
    </div>
  )
}

