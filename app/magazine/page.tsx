import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, BookOpen, Feather, Clock, Sparkles } from "lucide-react"

export const metadata: Metadata = {
  title: "RSUNKAHI Quarterly Magazine | Coming Soon",
  description:
    "RSUNKAHI Quarterly Magazine — समकालीन रचनाकारों की चयनित रचनाओं की त्रैमासिक पत्रिका। Coming Soon.",
}

export default function QuarterlyMagazineComingSoonPage() {
  return (
    <div className="vintage-master-container min-h-screen py-10 px-4 sm:px-6 flex flex-col justify-between">
      <div className="max-w-4xl w-full mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-sans font-semibold text-[#3c2a1e]/80 dark:text-[#e6dfcd]/80 hover:text-[#3c2a1e] dark:hover:text-[#f0ebd9] transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="relative overflow-hidden rounded-2xl border border-[#c5a059]/40 bg-gradient-to-br from-[#fdfbf7] via-[#f7f0e4] to-[#ece0cd] dark:from-[#2c2317] dark:via-[#221a11] dark:to-[#19130c] p-8 sm:p-12 md:p-14 shadow-2xl text-center">
          <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#d97706]/15 border border-[#d97706]/30 text-[#92400e] dark:text-amber-300 text-xs sm:text-sm font-sans font-bold uppercase tracking-widest mb-6">
              <Clock className="w-4 h-4" />
              Coming Soon • शीघ्र आ रहा है
            </div>

            <div className="w-28 sm:w-36 mb-6">
              <Image
                src="/magazine-3d-mockup.svg"
                alt="RSUNKAHI Quarterly Magazine"
                width={150}
                height={175}
                className="w-full h-auto drop-shadow-[0_12px_24px_rgba(60,42,30,0.28)]"
                priority
              />
            </div>

            <span className="text-xs sm:text-sm font-serif font-bold tracking-[0.28em] text-[#6b4226] dark:text-amber-300/90 uppercase">
              RSUNKAHI
            </span>
            <h1 className="mt-1 text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2b160a] dark:text-[#f0ebd9]">
              Quarterly Magazine
            </h1>

            <svg viewBox="0 0 200 14" className="w-40 h-3 my-4 text-[#c5a059]" fill="none">
              <path
                d="M5 7h60c14 0 22-4 35-4s21 4 35 4h60"
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
                opacity="0.85"
              />
              <circle cx="100" cy="7" r="2.5" fill="currentColor" />
            </svg>

            <p className="text-lg sm:text-xl font-bold text-[#3c2a1e] dark:text-amber-200 leading-relaxed">
              समकालीन रचनाकारों की चयनित रचनाओं की त्रैमासिक पत्रिका
            </p>

            <p className="mt-4 font-sans text-sm sm:text-base text-[#3c2a1e]/80 dark:text-[#e6dfcd]/80 leading-relaxed">
              We are curating the inaugural edition of <strong>RSUNKAHI Quarterly Magazine</strong>{" "}
              featuring selected poetry, stories, ghazals, and literary reflections from inspiring
              contemporary writers. The first digital &amp; print issue will launch soon!
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/literature-club"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#d97706] to-[#b45309] hover:from-[#b45309] hover:to-[#92400e] text-white font-sans font-bold text-sm sm:text-base shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                Join Literature Club
              </Link>
              <Link
                href="/books"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#3c2a1e]/25 dark:border-[#e6dfcd]/25 bg-[#fcf8ef] dark:bg-[#1f1a14] text-[#3c2a1e] dark:text-[#f0ebd9] font-sans font-bold text-sm sm:text-base hover:bg-[#3c2a1e]/5 dark:hover:bg-[#e6dfcd]/10 transition-all"
              >
                <BookOpen className="w-4 h-4" />
                Browse Published Books
              </Link>
              <Link
                href="/poems"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-[#3c2a1e]/25 dark:border-[#e6dfcd]/25 bg-[#fcf8ef] dark:bg-[#1f1a14] text-[#3c2a1e] dark:text-[#f0ebd9] font-sans font-bold text-sm sm:text-base hover:bg-[#3c2a1e]/5 dark:hover:bg-[#e6dfcd]/10 transition-all"
              >
                <Feather className="w-4 h-4" />
                Read Poems
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
