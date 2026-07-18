"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, Feather, BookOpen, Video, PenTool, HelpCircle, Menu, X, User, Quote, Image as ImageIcon } from "lucide-react"
import { useSession } from "@/hooks/use-session"
import eventBus from "@/lib/event-bus"
import LanguageSelector from "@/components/language-selector"
import { useTranslations } from "@/lib/language-context"
import { motion, AnimatePresence } from "framer-motion"

const TitleSeparator = () => (
  <span className="opacity-30 mx-3 hidden sm:inline-block text-[#3c2a1e] dark:text-[#e6dfcd]">|</span>
)

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [showNav, setShowNav] = useState(true)
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { user, loading, refetch } = useSession()
  const [mounted, setMounted] = useState(false)
  const { t, isRtl } = useTranslations()
  const pathname = usePathname()

  const isHomePage = pathname === "/" || pathname === "" || pathname === null || pathname === "/index"

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const handleLogin = () => {
      refetch()
    }
    eventBus.on("login", handleLogin)
    return () => {
      eventBus.off("login", handleLogin)
    }
  }, [refetch])

  useEffect(() => {
    if (!isHomePage) {
      setShowNav(true)
      return
    }

    let lastShowNav = window.scrollY > 200
    setShowNav(lastShowNav)

    const handleScroll = () => {
      const shouldShow = window.scrollY > 200
      if (shouldShow !== lastShowNav) {
        lastShowNav = shouldShow
        setShowNav(shouldShow)
        if (!shouldShow) {
          setIsOpen(false)
        }
      }
    }
    
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isHomePage])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  const handleLogout = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" })
      if (res.ok) {
        await refetch()
        router.push("/login")
      } else {
        console.error("Logout failed:", await res.json())
      }
    } catch (error) {
      console.error("An error occurred during logout:", error)
    }
  }, [refetch, router])

  return (
    <AnimatePresence>
      {showNav && (
        <motion.nav
          initial={isHomePage ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 }}
          animate={{ y: 0, opacity: 1 }}
          exit={isHomePage ? { y: -80, opacity: 0 } : { y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={`top-0 left-0 right-0 z-[100] bg-[#f4e8d4]/95 dark:bg-[#1f1a14]/95 backdrop-blur-md border-b border-[#3c2a1e]/10 dark:border-[#e6dfcd]/10 shadow-md ${!isHomePage ? 'sticky' : 'fixed'}`}
          dir={isRtl ? "rtl" : "ltr"}
        >
          {/* REDUCED PADDING HERE - from py-2 md:py-3 to py-1 */}
          <div className="max-w-[1400px] mx-auto py-1 px-4 md:px-12 flex items-center justify-between">
            {/* Logo (Left side) - KEEPING ORIGINAL BIG SIZE */}
         <Link href="/" className="flex items-center flex-shrink-0 z-10">
  <Image
    src="/IMG_1790.PNG"
    alt="Unkahi Logo"
    width={200}
    height={50}
    className="object-contain mix-blend-multiply dark:brightness-200 dark:invert w-auto h-10 sm:h-16 md:h-12 lg:h-12"
    priority
  />
</Link>

            {/* Desktop Navigation (Center) */}
            <div className="hidden lg:flex items-center">
              <Link href="/poems" className="vintage-exact-link text-sm xl:text-base whitespace-nowrap">{t('poems')}</Link>
              <TitleSeparator />
             {/* <Link href="/shayari" className="vintage-exact-link text-sm xl:text-base whitespace-nowrap">{t('shayari')}</Link>
              <TitleSeparator />
              <Link href="/sher" className="vintage-exact-link text-sm xl:text-base whitespace-nowrap">{t('sher')}</Link>
              <TitleSeparator /> */}
              <Link href="/books" className="vintage-exact-link text-sm xl:text-base whitespace-nowrap">{t('books')}</Link>
              <TitleSeparator />
              <Link href="/quotes" className="vintage-exact-link text-sm xl:text-base whitespace-nowrap">{t('quotes') || 'Quotes'}</Link>
              <TitleSeparator />
              <Link href="/blog" className="vintage-exact-link text-sm xl:text-base whitespace-nowrap">{t('blog')}</Link>
              <TitleSeparator />
              <Link href="/videos" className="vintage-exact-link text-sm xl:text-base whitespace-nowrap">{t('videos')}</Link>
              <TitleSeparator />
              <Link href="/gallery" className="vintage-exact-link text-sm xl:text-base whitespace-nowrap">{t('gallery') || 'Gallery'}</Link>
              <TitleSeparator />
              <Link href="/about" className="vintage-exact-link text-sm xl:text-base whitespace-nowrap">{t('about')}</Link>
            </div>

            {/* Controls on Right */}
            <div className="flex items-center gap-2 sm:gap-3">
              {mounted && <LanguageSelector />}
              
              {mounted && (
                <button 
                  onClick={toggleTheme}
                  className="p-1.5 md:p-2 rounded-full bg-[#3c2a1e]/5 dark:bg-[#e6dfcd]/5 text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/10 dark:hover:bg-[#e6dfcd]/10 transition-colors"
                  aria-label="Toggle theme"
                >
                  {resolvedTheme === "dark" ? (
                    <Sun className="h-4 w-4 md:h-5 md:w-5" />
                  ) : (
                    <Moon className="h-4 w-4 md:h-5 md:w-5" />
                  )}
                </button>
              )}

              {/* Hamburger Menu Button */}
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-1.5 md:p-2 rounded bg-[#3c2a1e]/10 dark:bg-[#e6dfcd]/10 text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/20 transition-colors"
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? <X className="h-5 w-5 md:h-6 md:w-6" /> : <Menu className="h-5 w-5 md:h-6 md:w-6" />}
              </button>
            </div>
          </div>

          {/* Hamburger Dropdown Menu - REDUCED PADDING */}
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="w-full bg-[#f4e8d4] dark:bg-[#1f1a14] border-t border-[#3c2a1e]/10 dark:border-[#e6dfcd]/10 shadow-lg overflow-hidden"
              >
                <div className="max-w-[1400px] mx-auto p-3 md:p-4 md:px-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                  {/* Category 1: Literature */}
                  <div>
                    <h3 className="mb-2 text-base font-serif font-bold tracking-tight text-[#3c2a1e] dark:text-[#e6dfcd] border-b border-[#3c2a1e]/20 pb-1">{t('literature') || 'Literature'}</h3>
                    <div className="flex flex-col gap-1">
                      <Link href="/poems" className="flex items-center gap-2 p-1.5 text-sm md:text-base text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/5 dark:hover:bg-[#e6dfcd]/5 rounded-md transition-colors"><Feather className="h-3.5 w-3.5" /> {t('poems')}</Link>
                      <Link href="/books" className="flex items-center gap-2 p-1.5 text-sm md:text-base text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/5 dark:hover:bg-[#e6dfcd]/5 rounded-md transition-colors"><BookOpen className="h-3.5 w-3.5" /> {t('books')}</Link>
                      <Link href="/quotes" className="flex items-center gap-2 p-1.5 text-sm md:text-base text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/5 dark:hover:bg-[#e6dfcd]/5 rounded-md transition-colors"><Quote className="h-3.5 w-3.5" /> {t('quotes') || 'Quotes'}</Link>
                       <Link href="/about" className="flex items-center gap-2 p-1.5 text-sm md:text-base text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/5 dark:hover:bg-[#e6dfcd]/5 rounded-md transition-colors"><User className="h-3.5 w-3.5" /> {t('about')}</Link>
                      {/*<Link href="/shayari" className="flex items-center gap-2 p-1.5 text-sm md:text-base text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/5 dark:hover:bg-[#e6dfcd]/5 rounded-md transition-colors"><PenTool className="h-3.5 w-3.5" /> {t('shayari')}</Link>
                      <Link href="/sher" className="flex items-center gap-2 p-1.5 text-sm md:text-base text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/5 dark:hover:bg-[#e6dfcd]/5 rounded-md transition-colors"><Feather className="h-3.5 w-3.5" /> {t('sher')}</Link>*/}
                    </div>
                  </div>

                  {/* Category 2: Media & Interact */}
                  <div>
                    <h3 className="mb-2 text-base font-serif font-bold tracking-tight text-[#3c2a1e] dark:text-[#e6dfcd] border-b border-[#3c2a1e]/20 pb-1">{t('media') || 'Media & Activities'}</h3>
                    <div className="flex flex-col gap-1">
                      <Link href="/videos" className="flex items-center gap-2 p-1.5 text-sm md:text-base text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/5 dark:hover:bg-[#e6dfcd]/5 rounded-md transition-colors"><Video className="h-3.5 w-3.5" /> {t('videos')}</Link>
                      <Link href="/blog" className="flex items-center gap-2 p-1.5 text-sm md:text-base text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/5 dark:hover:bg-[#e6dfcd]/5 rounded-md transition-colors"><BookOpen className="h-3.5 w-3.5" /> {t('blog')}</Link>
                      <Link href="/gallery" className="flex items-center gap-2 p-1.5 text-sm md:text-base text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/5 dark:hover:bg-[#e6dfcd]/5 rounded-md transition-colors"><ImageIcon className="h-3.5 w-3.5" /> {t('gallery') || 'Gallery'}</Link>
                      <Link href="/quiz" className="flex items-center gap-2 p-1.5 text-sm md:text-base text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/5 dark:hover:bg-[#e6dfcd]/5 rounded-md transition-colors"><HelpCircle className="h-3.5 w-3.5" /> {t('quiz')}</Link>
                    </div>
                  </div>

                  {/* Category 3: Account */}
                  <div>
                    <h3 className="mb-2 text-base font-serif font-bold tracking-tight text-[#3c2a1e] dark:text-[#e6dfcd] border-b border-[#3c2a1e]/20 pb-1">{t('account') || 'Account'}</h3>
                    <div className="flex flex-col gap-1">
                      {loading ? (
                        <div className="w-20 h-6 bg-[#3c2a1e]/10 dark:bg-[#e6dfcd]/10 animate-pulse rounded"></div>
                      ) : user ? (
                        <>
                          {user.isAdmin ? (
                            <Link href="/admin" className="p-1.5 text-sm md:text-base font-semibold text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/5 dark:hover:bg-[#e6dfcd]/5 rounded-md transition-colors">{t('admin')}</Link>
                          ) : (
                            <Link href="/profile" className="p-1.5 text-sm md:text-base font-semibold text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/5 dark:hover:bg-[#e6dfcd]/5 rounded-md transition-colors">{t('profile')}</Link>
                          )}
                          <button onClick={handleLogout} className="text-left p-1.5 text-sm md:text-base font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-md transition-colors">{t('logout')}</button>
                        </>
                      ) : (
                        <>
                          <Link href="/login" className="p-1.5 text-sm md:text-base font-semibold text-[#3c2a1e] dark:text-[#e6dfcd] hover:bg-[#3c2a1e]/5 dark:hover:bg-[#e6dfcd]/5 rounded-md transition-colors">{t('login')}</Link>
                          <Link href="/register" className="p-1.5 text-sm md:text-base font-bold bg-[#3c2a1e] text-[#f4e8d4] dark:bg-[#e6dfcd] dark:text-[#1f1a14] hover:bg-[#523b2b] dark:hover:bg-[#fcf9f2] rounded-md transition-colors inline-block text-center mt-1 w-full max-w-[180px]">{t('signUp')}</Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.nav>
      )}
    </AnimatePresence>
  )
}