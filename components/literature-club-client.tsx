"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion, AnimatePresence, type Variants } from "framer-motion"
import {
  Mic,
  Video,
  BookOpen,
  Users,
  Sparkles,
  MapPin,
  Play,
  X,
  MessageCircle,
  ExternalLink,
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
  Youtube,
  Newspaper,
} from "lucide-react"

export interface Creator {
  _id: string
  name: string
  city: string
  category: string
  intro: string
  photo: string
  performanceUrl: string
  youtubeId?: string
}

export interface ClubVideo {
  _id: string
  title: string
  description?: string
  youtubeId: string
  playlist?: string
  thumbnail?: string
}

export interface ClubSettings {
  literatureClubWhatsappUrl?: string
  literatureClubPlaylistId?: string
  literatureClubFormUrl?: string
  youtube?: string
  email?: string
}

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

function extractPlaylistId(input?: string): string {
  if (!input) return ""
  const trimmed = input.trim()
  const listMatch = trimmed.match(/[?&]list=([^&#]+)/)
  if (listMatch && listMatch[1]) return listMatch[1]
  if (/^[A-Za-z0-9_-]{10,}$/.test(trimmed)) return trimmed
  return ""
}

const SectionHeading = ({ eyebrow, title }: { eyebrow?: string; title: string }) => (
  <div className="text-center mb-10">
    {eyebrow && (
      <span className="inline-block text-xs sm:text-sm font-sans font-bold uppercase tracking-[0.22em] text-[#8b5e34] dark:text-amber-400/90 mb-2">
        {eyebrow}
      </span>
    )}
    <div className="vintage-col-header">
      <span className="line" />
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-bold text-[#3c2a1e] dark:text-[#f0ebd9] px-3">
        {title}
      </h2>
      <span className="line" />
    </div>
  </div>
)

export default function LiteratureClubClient({
  creators,
  videos,
  settings,
}: {
  creators: Creator[]
  videos: ClubVideo[]
  settings: ClubSettings | null
}) {
  const [activeVideo, setActiveVideo] = useState<{ title: string; youtubeId: string } | null>(null)

  const playlistId = extractPlaylistId(settings?.literatureClubPlaylistId)
  const whatsappUrl = settings?.literatureClubWhatsappUrl?.trim()
  const formUrl = settings?.literatureClubFormUrl?.trim()

  const offerings = [
    {
      title: "Monthly Literary Stage",
      description: "Six selected creators get a platform every month.",
      icon: Mic,
      gradient: "from-[#3a1d10] via-[#5a2c16] to-[#231008]",
      accent: "text-amber-300",
      badge: "6 Creators / Month",
    },
    {
      title: "YouTube & Podcast",
      description: "Opportunities to be featured in digital productions.",
      icon: Video,
      gradient: "from-[#1e293b] via-[#334155] to-[#0f172a]",
      accent: "text-amber-300",
      badge: "Digital Productions",
    },
    {
      title: "Publishing Opportunities",
      description: "Selected creations may find a place in published books.",
      icon: BookOpen,
      gradient: "from-[#4a2e16] via-[#6e4723] to-[#2b1a0c]",
      accent: "text-amber-200",
      badge: "Anthologies & Books",
    },
    {
      title: "Literary Community",
      description: "Connect with fellow creators and literature enthusiasts.",
      icon: Users,
      gradient: "from-[#2d3a27] via-[#3e5235] to-[#1b2417]",
      accent: "text-amber-200",
      badge: "Poets & Writers",
    },
    {
      title: "Quarterly Magazine",
      description: "Selected creations featured in RSUNKAHI Quarterly Magazine.",
      icon: Newspaper,
      gradient: "from-[#6b4226] via-[#8c5832] to-[#3c2414]",
      accent: "text-amber-100",
      badge: "त्रैमासिक पत्रिका",
      href: "/books",
    },
  ]

  const steps = [
    "Register through our online form.",
    "Submit a 30-second audition video.",
    "Get shortlisted by our selection team.",
    "Present your creation in a 10-minute session.",
    "Explore opportunities for YouTube, podcast and book publication.",
  ]

  return (
    <div className="vintage-master-container min-h-screen pb-20">
      {/* ─── TOP BREADCRUMB ─── */}
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-[#3c2a1e]/80 dark:text-[#e6dfcd]/80 hover:text-[#3c2a1e] dark:hover:text-[#f0ebd9] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>

      {/* ══════════════════════════════════════════════════════════
          SECTION 1: INTRODUCTION
         ══════════════════════════════════════════════════════════ */}
      <motion.section
        className="max-w-[1150px] mx-auto px-4 sm:px-6 pt-6 pb-12"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <div className="relative overflow-hidden rounded-2xl border border-[#c5a059]/35 bg-gradient-to-br from-[#381c10] via-[#231108] to-[#140804] p-6 sm:p-10 md:p-12 shadow-2xl text-center">
          <div className="absolute -left-12 -top-12 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center max-w-3xl mx-auto">
            <div className="w-16 sm:w-20 mb-3">
              <Image
                src="/vintage-mic.svg"
                alt="RSUNKAHI Literature Club"
                width={80}
                height={100}
                className="w-full h-auto drop-shadow-[0_4px_16px_rgba(245,158,11,0.45)]"
                priority
              />
            </div>

            <span className="text-xs sm:text-sm font-serif font-bold tracking-[0.28em] text-[#f3ddb3] uppercase">
              RSUNKAHI Literature Club
            </span>

            <h1 className="mt-3 text-2xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 leading-snug">
              हर आवाज़ को मंच, हर रचना को पहचान।
            </h1>

            <svg viewBox="0 0 200 14" className="w-44 h-3 my-4 text-[#d4af37]" fill="none">
              <path d="M5 7h60c14 0 22-4 35-4s21 4 35 4h60" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" opacity="0.85" />
              <circle cx="100" cy="7" r="2.5" fill="currentColor" />
            </svg>

            <p className="font-sans text-base sm:text-lg text-[#fff7ed]/95 leading-relaxed">
              RSUNKAHI Literature Club is a digital literary initiative dedicated to discovering,
              encouraging and celebrating creative voices.
            </p>
            <p className="font-sans text-sm sm:text-base text-amber-100/80 leading-relaxed mt-3">
              We bring together poets, shayars, writers and storytellers, offering them opportunities
              to present their original creations and connect with a wider audience.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 2: WHAT WE OFFER (Including Quarterly Magazine)
         ══════════════════════════════════════════════════════════ */}
      <motion.section
        className="max-w-[1150px] mx-auto px-4 sm:px-6 py-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
      >
        <SectionHeading eyebrow="Opportunities & Platforms" title="What We Offer" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offerings.map((item) => {
            const Icon = item.icon
            const cardBody = (
              <div className="h-full rounded-2xl overflow-hidden border border-[#3c2a1e]/15 dark:border-[#e6dfcd]/15 bg-[#fcf8ef] dark:bg-[#261f17] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col">
                <div className={`relative h-36 bg-gradient-to-br ${item.gradient} p-5 flex flex-col justify-between overflow-hidden`}>
                  <div className="absolute -right-6 -bottom-6 opacity-15">
                    <Icon className="w-32 h-32 text-amber-200" />
                  </div>
                  <span className="inline-block self-start px-3 py-1 rounded-full text-[11px] font-sans font-semibold tracking-wider uppercase bg-black/30 text-amber-200 border border-amber-300/20">
                    {item.badge}
                  </span>
                  <div className={`w-11 h-11 rounded-xl bg-black/30 border border-amber-300/25 flex items-center justify-center ${item.accent}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-[#3c2a1e] dark:text-[#f0ebd9]">
                      {item.title}
                    </h3>
                    <p className="mt-2 font-sans text-sm sm:text-base text-[#3c2a1e]/80 dark:text-[#e6dfcd]/80 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {item.href && (
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-sans font-bold uppercase tracking-wider text-[#b45309] dark:text-amber-400">
                      Explore Magazine →
                    </span>
                  )}
                </div>
              </div>
            )

            return item.href ? (
              <Link key={item.title} href={item.href} className="block h-full">
                {cardBody}
              </Link>
            ) : (
              <div key={item.title} className="h-full">
                {cardBody}
              </div>
            )
          })}
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 3: HOW IT WORKS
         ══════════════════════════════════════════════════════════ */}
      <motion.section
        className="max-w-[1150px] mx-auto px-4 sm:px-6 py-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
      >
        <SectionHeading eyebrow="5 Simple Steps" title="How It Works" />

        <div className="rounded-2xl border border-[#3c2a1e]/15 dark:border-[#e6dfcd]/15 bg-[#fcf8ef] dark:bg-[#261f17] shadow-lg overflow-hidden grid grid-cols-1 md:grid-cols-12">
          {/* Left Visual */}
          <div className="md:col-span-5 relative min-h-[220px] md:min-h-full bg-[#2c1a0e]">
            <Image
              src="/vintage-desk.png"
              alt="Open notebook and vintage pen"
              fill
              sizes="(max-width: 768px) 100vw, 40vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
              <p className="text-amber-100 font-serif italic text-lg">
                &ldquo;From your notebook to the literary stage...&rdquo;
              </p>
            </div>
          </div>

          {/* Right Steps */}
          <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-center space-y-4">
            {steps.map((step, index) => (
              <div
                key={index}
                className="flex items-start gap-4 p-3 rounded-xl bg-[#ebdcb9]/30 dark:bg-[#1f1a14]/60 border border-[#3c2a1e]/10 dark:border-[#e6dfcd]/10"
              >
                <span className="w-8 h-8 rounded-full bg-[#3c2a1e] dark:bg-[#d4af37] text-[#f4e8d4] dark:text-[#1f1a14] font-sans font-bold text-sm flex items-center justify-center flex-shrink-0 shadow">
                  {index + 1}
                </span>
                <p className="font-sans text-sm sm:text-base font-medium text-[#3c2a1e] dark:text-[#e6dfcd] pt-1">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 4: A PROMISE TO CREATORS
         ══════════════════════════════════════════════════════════ */}
      <motion.section
        className="max-w-[1150px] mx-auto px-4 sm:px-6 py-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
      >
        <SectionHeading eyebrow="Our Core Value" title="A Promise to Creators" />

        <div className="rounded-2xl border-2 border-[#c5a059]/40 bg-gradient-to-br from-[#f4ead8] via-[#efe1c6] to-[#e6d2ad] dark:from-[#2c2317] dark:via-[#241c12] dark:to-[#1b140d] p-7 sm:p-10 md:p-12 shadow-lg text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#3c2a1e]/10 dark:bg-amber-500/15 text-[#3c2a1e] dark:text-amber-300 text-xs sm:text-sm font-sans font-bold mb-4">
              <ShieldCheck className="w-4 h-4" />
              Talent deserves opportunity, not a fee.
            </div>

            <h3 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#8c5a2b] dark:text-amber-400">
              No Performance Fee. Ever.
            </h3>

            <p className="mt-4 font-sans text-base sm:text-lg text-[#3c2a1e]/90 dark:text-[#e6dfcd]/90 leading-relaxed">
              At RSUNKAHI Literature Club, selected creators do not have to pay for their
              performance. We believe artists deserve respect, encouragement, and meaningful
              opportunities.
            </p>
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 5: FEATURED CREATORS (Dynamic)
         ══════════════════════════════════════════════════════════ */}
      <motion.section
        className="max-w-[1150px] mx-auto px-4 sm:px-6 py-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
      >
        <SectionHeading eyebrow="Voices of RSUNKAHI" title="Featured Creators" />

        {creators.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#3c2a1e]/30 dark:border-[#e6dfcd]/30 bg-[#fcf8ef]/60 dark:bg-[#261f17]/60 p-10 text-center">
            <Sparkles className="w-10 h-10 mx-auto text-[#b45309] dark:text-amber-400 mb-3 opacity-80" />
            <h3 className="text-xl font-serif font-bold text-[#3c2a1e] dark:text-[#f0ebd9]">
              Upcoming Featured Creators
            </h3>
            <p className="font-sans text-sm sm:text-base text-[#3c2a1e]/75 dark:text-[#e6dfcd]/75 max-w-lg mx-auto mt-2">
              Our selected poets, shayars, and storytellers from the monthly literary sessions will
              be spotlighted here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {creators.map((creator) => (
              <div
                key={creator._id}
                className="rounded-2xl overflow-hidden border border-[#3c2a1e]/15 dark:border-[#e6dfcd]/15 bg-[#fcf8ef] dark:bg-[#261f17] shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-[#c5a059] bg-[#ebdcb9] flex-shrink-0 shadow">
                      {creator.photo ? (
                        <img
                          src={creator.photo}
                          alt={creator.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-serif font-bold text-[#3c2a1e]">
                          {creator.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-serif font-bold text-[#3c2a1e] dark:text-[#f0ebd9] leading-tight">
                        {creator.name}
                      </h3>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold bg-[#3c2a1e]/10 dark:bg-amber-500/20 text-[#8c5a2b] dark:text-amber-300">
                        {creator.category}
                      </span>
                      {creator.city && (
                        <p className="text-xs font-sans text-[#3c2a1e]/70 dark:text-[#e6dfcd]/70 flex items-center gap-1 mt-1.5">
                          <MapPin className="w-3.5 h-3.5" />
                          {creator.city}
                        </p>
                      )}
                    </div>
                  </div>

                  {creator.intro && (
                    <p className="mt-4 font-sans text-sm text-[#3c2a1e]/85 dark:text-[#e6dfcd]/85 leading-relaxed">
                      {creator.intro}
                    </p>
                  )}
                </div>

                {(creator.youtubeId || creator.performanceUrl) && (
                  <div className="px-6 pb-5 pt-2">
                    {creator.youtubeId ? (
                      <button
                        type="button"
                        onClick={() =>
                          setActiveVideo({
                            title: `${creator.name} — ${creator.category}`,
                            youtubeId: creator.youtubeId!,
                          })
                        }
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] text-white font-sans text-sm font-bold shadow hover:from-[#b45309] hover:to-[#92400e] transition-all cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Watch Performance
                      </button>
                    ) : (
                      <a
                        href={creator.performanceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#d97706] to-[#b45309] text-white font-sans text-sm font-bold shadow hover:from-[#b45309] hover:to-[#92400e] transition-all"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Watch Performance
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 6: WATCH OUR PERFORMANCES (Playlist & Embedded Videos)
         ══════════════════════════════════════════════════════════ */}
      <motion.section
        className="max-w-[1150px] mx-auto px-4 sm:px-6 py-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
      >
        <SectionHeading
          eyebrow="RSUNKAHI Literature Club – Monthly Sessions"
          title="Watch Our Performances"
        />

        {playlistId && (
          <div className="mb-8 rounded-2xl overflow-hidden border border-[#3c2a1e]/20 dark:border-[#e6dfcd]/20 bg-black shadow-xl">
            <div className="bg-[#2c1a0e] px-5 py-3 flex items-center justify-between text-amber-100">
              <div className="flex items-center gap-2 font-sans font-bold text-sm sm:text-base">
                <Youtube className="w-5 h-5 text-red-500" />
                RSUNKAHI Literature Club – Monthly Sessions
              </div>
              <a
                href={`https://www.youtube.com/playlist?list=${playlistId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-sans underline hover:text-amber-300 flex items-center gap-1"
              >
                Open Playlist <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <div className="relative w-full aspect-video">
              <iframe
                src={`https://www.youtube.com/embed/videoseries?list=${playlistId}`}
                title="RSUNKAHI Literature Club – Monthly Sessions"
                loading="lazy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}

        {videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video._id}
                className="rounded-2xl overflow-hidden border border-[#3c2a1e]/15 dark:border-[#e6dfcd]/15 bg-[#fcf8ef] dark:bg-[#261f17] shadow-md flex flex-col"
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveVideo({
                      title: video.title,
                      youtubeId: video.youtubeId,
                    })
                  }
                  className="group relative w-full aspect-video bg-black overflow-hidden cursor-pointer text-left"
                  aria-label={`Play ${video.title}`}
                >
                  <img
                    src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors flex items-center justify-center">
                    <span className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </span>
                  </div>
                </button>
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-base sm:text-lg text-[#3c2a1e] dark:text-[#f0ebd9] line-clamp-2">
                      {video.title}
                    </h3>
                    {video.description && (
                      <p className="font-sans text-xs sm:text-sm text-[#3c2a1e]/75 dark:text-[#e6dfcd]/75 mt-1.5 line-clamp-2">
                        {video.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          !playlistId && (
            <div className="rounded-2xl border border-[#3c2a1e]/15 bg-[#fcf8ef] dark:bg-[#261f17] p-8 text-center">
              <Youtube className="w-10 h-10 mx-auto text-red-600 mb-3" />
              <p className="font-sans text-sm sm:text-base text-[#3c2a1e]/80 dark:text-[#e6dfcd]/80">
                Monthly session videos for <strong>RSUNKAHI Literature Club – Monthly Sessions</strong> will appear here.
              </p>
              <Link
                href="/videos"
                className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-full bg-[#3c2a1e] text-[#f4e8d4] font-sans text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Explore All RSUNKAHI Videos
              </Link>
            </div>
          )
        )}
      </motion.section>

      {/* ══════════════════════════════════════════════════════════
          SECTION 7: REGISTRATION CTA (Join WhatsApp Group)
         ══════════════════════════════════════════════════════════ */}
      <motion.section
        className="max-w-[1150px] mx-auto px-4 sm:px-6 pt-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeInUp}
      >
        <div className="relative overflow-hidden rounded-2xl border border-[#c5a059]/40 bg-gradient-to-br from-[#381c10] via-[#231108] to-[#140804] p-8 sm:p-12 text-center shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.18),transparent_60%)] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-amber-200 to-amber-400 leading-snug">
              क्या आपकी रचनाएँ भी एक मंच की तलाश में हैं?
            </h2>

            <p className="mt-4 font-sans text-base sm:text-lg text-[#fff7ed]/90">
              Join RSUNKAHI Literature Club and let your words reach new audiences.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              {whatsappUrl ? (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-[#0b2916] font-sans font-bold text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  Join WhatsApp Group
                </a>
              ) : (
                <Link
                  href="/#contact"
                  className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-[#25D366] hover:bg-[#1ebe57] text-[#0b2916] font-sans font-bold text-base shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  Join WhatsApp Group / Contact Us
                </Link>
              )}

              {formUrl && (
                <a
                  href={formUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-sans font-bold text-base shadow-lg transition-all transform hover:-translate-y-0.5"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Online Registration Form
                </a>
              )}
            </div>
          </div>
        </div>
      </motion.section>

      {/* ─── INLINE VIDEO MODAL FOR CREATOR PERFORMANCES ─── */}
      <AnimatePresence>
        {activeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveVideo(null)}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl rounded-2xl overflow-hidden bg-[#1f1a14] border border-amber-500/30 shadow-2xl"
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-amber-500/20 text-amber-100">
                <h4 className="font-serif font-bold text-lg">{activeVideo.title}</h4>
                <button
                  type="button"
                  onClick={() => setActiveVideo(null)}
                  className="p-1.5 rounded-full hover:bg-white/10 transition-colors"
                  aria-label="Close video"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="relative w-full aspect-video bg-black">
                <iframe
                  src={`https://www.youtube.com/embed/${activeVideo.youtubeId}?autoplay=1&rel=0`}
                  title={activeVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
