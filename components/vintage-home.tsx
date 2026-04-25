"use client"

import React, { useEffect, useState, useRef, memo } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, useInView, AnimatePresence } from "framer-motion"
import { useTranslations } from "@/lib/language-context"
import LanguageSelector from "@/components/language-selector"
import AnimatedQuill from "@/components/animated-quill"
import AnimatedCandle from "@/components/animated-candle"
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react"

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
      <div className="inline-flex items-center gap-2 md:gap-3 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-[#f4e8d4] border border-[#3c2a1e]/20 shadow-inner text-[#3c2a1e]">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-600"></span>
        </span>
        <span className="text-[10px] md:text-sm font-semibold tracking-widest uppercase opacity-80 whitespace-nowrap">
          {visits.toLocaleString()} Travelers
        </span>
      </div>
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
const ThreeColumnExact = memo(function ThreeColumnExact({
  poems,
  books,
  t,
  recentVideo,
}: {
  poems: any[]
  books: any[]
  t: (key: any) => string
  recentVideo: any
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })

  return (
    <motion.section
      ref={ref}
      className="vintage-exact-columns-wrapper"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      {/* ── Column 1: Poems ── */}
      <motion.div className="vintage-col" variants={fadeInUp}>
        <div className="vintage-col-header">
          <span className="line"></span>
          <h3>{t("poemsSection")}</h3>
          <span className="line"></span>
        </div>

        <div className="vintage-col-1-box">
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
      </motion.div>

      {/* ── Column 2: Books ── */}
      <motion.div className="vintage-col" variants={fadeInUp}>
        <div className="vintage-col-header">
          <span className="line"></span>
          <h3>{t("myBooks")}</h3>
          <span className="line"></span>
        </div>

        <div className="vintage-col-2-box">
          <div className="vintage-books-display">
            {/* The books image background frame */}
            <div className="vintage-books-frame">
              <Image src={books[0]?.cover || "/placeholder.jpg"} alt="Book 1" width={110} height={160} sizes="110px" className="framed-book" />
              <Image src={books[1]?.cover || "/placeholder.jpg"} alt="Book 2" width={110} height={160} sizes="110px" className="framed-book" />
            </div>
            <div className="vintage-books-actions">
              <Link href="/books" className="vintage-exact-btn-light">{t("readMore")}</Link>
              <Link href="/books" className="vintage-exact-btn-dark">{t("buyNow")}</Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Column 3: Poetry/Thoughts ── */}
      <motion.div className="vintage-col" variants={fadeInUp}>
        <div className="vintage-col-header">
          <span className="line"></span>
          <h3>{t("poetryRay")}</h3>
          <span className="line"></span>
        </div>

        <div className="vintage-col-3-box">
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
              {recentVideo.description && (
                <p className="poetry-text text-[0.8rem] text-center line-clamp-3 mt-1 opacity-80">{recentVideo.description}</p>
              )}
              <div className="vintage-btn-wrapper-right mt-3 flex justify-center">
                <Link href="/videos" className="vintage-exact-btn-dark">
                  {t("moreVideos")}
                </Link>
              </div>
            </div>
          ) : (
            <>
              <h4 className="poetry-title">{t("pathsInWords")}</h4>
              <div className="poetry-date">10 mag ri 2024</div>
              <p className="poetry-text">
                समहते shabdoa में अन्यामनु उरेहा वरिचनागत,
                नब नोरे गैटटं नब नद ह इरुष्ट दुतेऐजेन्द, उसाधर
                यन रीमान uhta hoon.
              </p>
              <div className="vintage-btn-wrapper-right">
                <Link href="/blog" className="vintage-exact-btn-dark">
                  {t("moreVideos")}
                </Link>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.section>
  )
})

// ═══════════════════════════════════════════════
// SUBSCRIPTION FORM
// ═══════════════════════════════════════════════
const VintageSubscriptionExact = memo(function VintageSubscriptionExact({ t }: { t: (key: any) => string }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: 0.1 })
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

  return (
    <motion.section
      ref={ref}
      className="vintage-exact-subscription"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
    >
      <div className="vintage-sub-header">
        <h2 className="title">{t("subscribeTitle")}</h2>
        <div className="subtitle-wrapper">
          <span className="line"></span>
          <p className="subtitle">{t("subscribeSubtitle")}</p>
          <span className="line"></span>
        </div>
      </div>

      <div className="vintage-sub-content">
        <form className="vintage-exact-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input 
              type="text" 
              placeholder={t("nameLabel")} 
              className="vintage-exact-input" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <input 
              type="email" 
              placeholder={t("emailLabel")} 
              className="vintage-exact-input" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div className="input-group">
            <textarea 
              placeholder={t("messageLabel")} 
              className="vintage-exact-input resize-none" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              rows={4} 
              required 
            />
          </div>
          
          {status === "success" && (
            <p className="text-green-700 text-center mt-2 text-sm md:text-base font-medium">Message sent successfully!</p>
          )}
          {status === "error" && (
            <p className="text-red-600 text-center mt-2 text-sm md:text-base font-medium">Failed to send message. Please try again.</p>
          )}

          <div className="submit-wrapper mt-4">
            <button type="submit" className="vintage-exact-btn-dark md-btn" disabled={loading}>
              {loading ? "Sending..." : t("sendButton")}
            </button>
          </div>
        </form>
      </div>
    </motion.section>
  )
})

// ═══════════════════════════════════════════════
// SOCIAL MEDIA
// ═══════════════════════════════════════════════
const VintageSocialMedia = memo(function VintageSocialMedia({ settings }: { settings?: any }) {
  if (!settings) return null
  
  const { facebook, twitter, instagram, youtube, linkedin } = settings
  
  if (!facebook && !twitter && !instagram && !youtube && !linkedin) return null

  return (
    <motion.div 
      className="flex justify-center gap-8 py-10 relative z-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={fadeInUp}
    >
      {facebook && (
        <Link href={facebook} target="_blank" rel="noopener noreferrer" className="text-[#3c2a1e] hover:text-[#6b4c3a] transition-all duration-300 hover:-translate-y-1 drop-shadow-sm p-2 rounded-full border border-transparent hover:border-[#3c2a1e]/20 bg-[#f4e8d4] shadow-inner">
          <Facebook size={24} />
        </Link>
      )}
      {twitter && (
        <Link href={twitter} target="_blank" rel="noopener noreferrer" className="text-[#3c2a1e] hover:text-[#6b4c3a] transition-all duration-300 hover:-translate-y-1 drop-shadow-sm p-2 rounded-full border border-transparent hover:border-[#3c2a1e]/20 bg-[#f4e8d4] shadow-inner">
          <Twitter size={24} />
        </Link>
      )}
      {instagram && (
        <Link href={instagram} target="_blank" rel="noopener noreferrer" className="text-[#3c2a1e] hover:text-[#6b4c3a] transition-all duration-300 hover:-translate-y-1 drop-shadow-sm p-2 rounded-full border border-transparent hover:border-[#3c2a1e]/20 bg-[#f4e8d4] shadow-inner">
          <Instagram size={24} />
        </Link>
      )}
      {youtube && (
        <Link href={youtube} target="_blank" rel="noopener noreferrer" className="text-[#3c2a1e] hover:text-[#6b4c3a] transition-all duration-300 hover:-translate-y-1 drop-shadow-sm p-2 rounded-full border border-transparent hover:border-[#3c2a1e]/20 bg-[#f4e8d4] shadow-inner">
          <Youtube size={24} />
        </Link>
      )}
      {linkedin && (
        <Link href={linkedin} target="_blank" rel="noopener noreferrer" className="text-[#3c2a1e] hover:text-[#6b4c3a] transition-all duration-300 hover:-translate-y-1 drop-shadow-sm p-2 rounded-full border border-transparent hover:border-[#3c2a1e]/20 bg-[#f4e8d4] shadow-inner">
          <Linkedin size={24} />
        </Link>
      )}
    </motion.div>
  )
})

// ═══════════════════════════════════════════════
// INSTAGRAM EMBED
// ═══════════════════════════════════════════════
const VintageInstagramEmbed = memo(function VintageInstagramEmbed({ url, t }: { url?: string, t?: any }) {
  if (!url) return null;

  // Clean URL to base post/reel URL and add /embed
  const cleanUrl = url.split("?")[0].replace(/\/$/, "");
  const embedUrl = `${cleanUrl}/embed`;

  return (
    <motion.section
      className="w-full max-w-sm md:max-w-md mx-auto py-8 relative z-20"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.1 }}
      variants={fadeInUp}
    >
      <div className="vintage-col-header mb-6">
        <span className="line"></span>
        <h3 className="whitespace-nowrap">Instagram Reel</h3>
        <span className="line"></span>
      </div>
      <div className="bg-[#f4e8d4] p-2 md:p-3 rounded-lg border border-[#3c2a1e]/20 shadow-[0_4px_15px_rgba(60,42,30,0.15)] relative">
         <iframe
            src={embedUrl}
            width="100%"
            height="500"
            frameBorder="0"
            scrolling="no"
            allowTransparency={true}
            allow="encrypted-media"
            className="rounded bg-white w-full h-[500px]"
         ></iframe>
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

      {/* ─── 3-COLUMNS SECTION WITH SIDE AESTHETIC DECORATIONS ─── */}
      <div className="relative w-full">
        {/* Left Side Quill */}
        <div className="absolute left-[-1rem] xl:left-[-5rem] top-[15%] w-[100px] xl:w-[140px] aspect-square pointer-events-none opacity-30 hidden lg:block -rotate-12">
          <AnimatedQuill className="w-full h-full" />
        </div>

        {/* Right Side Mirrored Quill */}
        <div className="absolute right-[-1rem] xl:right-[-5rem] top-[45%] w-[100px] xl:w-[140px] aspect-square pointer-events-none opacity-30 hidden lg:block rotate-12" style={{ transform: "scaleX(-1) rotate(-12deg)" }}>
          <AnimatedQuill className="w-full h-full" />
        </div>

        <ThreeColumnExact poems={featuredPoems} books={recentBooks} recentVideo={recentVideo} t={t} />
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

        <VintageInstagramEmbed url={settings?.featuredInstagramReel} t={t} />
        <VintageSubscriptionExact t={t} />
        <VintageSocialMedia settings={settings} />
      </div>
    </div>
  )
}

