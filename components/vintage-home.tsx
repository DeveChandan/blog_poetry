"use client"

import React, { useEffect, useState, useRef, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useTranslations } from "@/lib/language-context"
import LanguageSelector from "@/components/language-selector"
import AnimatedQuill from "@/components/animated-quill"
import AnimatedCandle from "@/components/animated-candle"
import { Facebook, Twitter, Instagram, Youtube, Linkedin, ChevronLeft, ChevronRight, Mail, Info } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"

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
      className="vintage-header-exact relative"
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

      <motion.h1 className="vintage-exact-title" variants={fadeInUp}>
        {t("siteTitle")}
      </motion.h1>

      <motion.nav className="vintage-exact-nav" variants={fadeInUp}>
        <div className="vintage-nav-lines">
          <Link href="/poems" className="vintage-exact-link">{t("poems")}</Link>
          <TitleSeparator />
          <Link href="/shayari" className="vintage-exact-link">{t("shayari")}</Link>
          <TitleSeparator />
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
          <h2>{currentQuote}</h2>
        </div>
      </div>

      <div className="vintage-exact-quote-ribbon">
        <p>“{t("welcomeQuote")}”</p>
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
                    <li key={p._id || i}><span>•</span> {p.title?.slice(0, 15)}....</li>
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
                  <Link href="/poems" className="vintage-exact-btn-dark">
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
                    <Link href="/books" className="vintage-exact-btn-dark">{t("buyNow")}</Link>
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
                    <h4 className="poetry-title text-center text-[1rem] leading-tight mt-2">{recentVideo.title}</h4>
                    <div className="vintage-btn-wrapper-left">
                      <Link href="/videos" className="vintage-exact-btn-dark">
                        {t("moreVideos")}
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
                      <Link href="/blog" className="vintage-exact-btn-dark">
                        {t("moreVideos")}
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
                <h3>Reels</h3>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 lg:gap-24">
        
        {/* ── Left: Subscription Form ── */}
        <div className="flex flex-col">
          <div className="vintage-col-header mb-8">
            <span className="line"></span>
            <h3 className="whitespace-nowrap">{t("subscribeTitle")}</h3>
            <span className="line"></span>
          </div>
          <form className="vintage-exact-form w-full" onSubmit={handleSubmit}>
            <div className="input-group mb-4">
              <input
                type="text"
                placeholder={t("nameLabel")}
                className="vintage-exact-input w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="input-group mb-4">
              <input
                type="email"
                placeholder={t("emailLabel")}
                className="vintage-exact-input w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="input-group mb-4">
              <textarea
                placeholder={t("messageLabel")}
                className="vintage-exact-input w-full resize-none"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                required
              />
            </div>

            {status === "success" && (
              <p className="text-green-700 mb-4 font-medium italic">Message sent successfully!</p>
            )}
            {status === "error" && (
              <p className="text-red-600 mb-4 font-medium italic">Failed to send message.</p>
            )}

            <button type="submit" className="vintage-exact-btn-dark w-full py-3" disabled={loading}>
              {loading ? "Sending..." : t("sendButton")}
            </button>
          </form>
        </div>

        {/* ── Right: Information & Social ── */}
        <div className="flex flex-col">
          <div className="vintage-col-header mb-8">
            <span className="line"></span>
            <h3 className="whitespace-nowrap">Information</h3>
            <span className="line"></span>
          </div>
          
          <div className="flex flex-col gap-8">
            {/* Social Media Grid */}
            <div className="grid grid-cols-2 gap-y-4 gap-x-6">
              {socialLinks.map((social) => (
                <Link 
                  key={social.id}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 text-[#3c2a1e] hover:text-[#6b4c3a] transition-colors group"
                >
                  <div className="p-2 rounded-full bg-[#f4e8d4] border border-[#3c2a1e]/10 shadow-inner group-hover:scale-110 transition-transform">
                    <social.icon size={18} />
                  </div>
                  <span className="font-semibold text-lg">{social.name}</span>
                </Link>
              ))}
            </div>

            {/* Contact & About */}
            <div className="mt-4 pt-8 border-t border-[#3c2a1e]/10 flex flex-col gap-6">
              <div className="flex items-center gap-4 text-[#3c2a1e]">
                <div className="p-2 rounded-full bg-[#f4e8d4] border border-[#3c2a1e]/10 shadow-inner">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase opacity-60 font-bold tracking-widest">Email Address</p>
                  <p className="text-lg font-semibold">contact@drrupeshsingh.com</p>
                </div>
              </div>

              <Link href="/about" className="flex items-center gap-4 text-[#3c2a1e] group">
                <div className="p-2 rounded-full bg-[#f4e8d4] border border-[#3c2a1e]/10 shadow-inner group-hover:scale-110 transition-transform">
                  <Info size={20} />
                </div>
                <div>
                  <p className="text-xs uppercase opacity-60 font-bold tracking-widest">Biography</p>
                  <p className="text-lg font-semibold group-hover:underline underline-offset-4">About Dr Rupesh Kumar Singh</p>
                </div>
              </Link>
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
        {/* Left Side Quill */}
        <div className="absolute left-[-1rem] xl:left-[-5rem] top-[15%] w-[100px] xl:w-[140px] aspect-square pointer-events-none opacity-30 hidden lg:block -rotate-12">
          <AnimatedQuill className="w-full h-full" />
        </div>

        {/* Right Side Mirrored Quill */}
        <div className="absolute right-[-1rem] xl:right-[-5rem] top-[45%] w-[100px] xl:w-[140px] aspect-square pointer-events-none opacity-30 hidden lg:block rotate-12" style={{ transform: "scaleX(-1) rotate(-12deg)" }}>
          <AnimatedQuill className="w-full h-full" />
        </div>

        <VintageCarousel 
          poems={featuredPoems} 
          books={recentBooks} 
          recentVideo={recentVideo} 
          t={t} 
          settings={settings}
        />
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Left Quill Decor (SVG) */}
        <div className="absolute left-[-2rem] md:left-4 bottom-10 w-[150px] md:w-[200px] aspect-square pointer-events-none opacity-80 hidden sm:block">
          <AnimatedQuill className="w-full h-full" />
        </div>

        {/* Right Candle Decor (SVG with Fire) */}
        <div className="absolute right-[-2rem] md:right-4 bottom-10 w-[150px] md:w-[200px] aspect-square pointer-events-none opacity-80 hidden sm:block">
          <AnimatedCandle className="w-full h-full" />
        </div>

        <VintageCombinedFooter t={t} settings={settings} />
      </div>
    </div>
  )
}

