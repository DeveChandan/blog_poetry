"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { NavigationDropdown } from "@/components/navigation-dropdown"
import { useTheme } from "next-themes"
import { Moon, Sun, Feather, BookOpen, Video, PenTool, HelpCircle, Menu, X } from "lucide-react"
import { useSession } from "@/hooks/use-session"
import eventBus from "@/lib/event-bus"
import LanguageSelector from "@/components/language-selector"
import { useTranslations } from "@/lib/language-context"

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const { user, loading, refetch } = useSession()
  const [mounted, setMounted] = useState(false)
  const { t, isRtl } = useTranslations()
  const pathname = usePathname()

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

  // Hide main navigation on the home page as it has its own custom vintage navigation
  const isHomePage = pathname === "/" || pathname === "" || pathname === null || pathname === "/index";
  if (isHomePage) return null;

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-24 overflow-hidden bg-transparent transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/IMG_1779.PNG"
                alt="Unkahi Logo"
                fill
                sizes="100px"
                className="object-contain dark:brightness-200 dark:invert"
                priority
              />
            </div>
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
              Dr Rupesh Kumar Singh
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2" dir={isRtl ? 'rtl' : 'ltr'}>
            <NavigationDropdown
              trigger={t('literature')}
              featured={{
                href: "/poems",
                label: t('poems'),
                description: t('poems_description'),
                icon: <Feather className="h-6 w-6 text-primary mb-2" />
              }}
              items={[
                {
                  href: "/books",
                  label: t('books'),
                  description: t('books_description'),
                  icon: <BookOpen className="h-4 w-4" />
                },
                {
                  href: "/shayari",
                  label: t('shayari'),
                  description: t('shayari_description'),
                  icon: <PenTool className="h-4 w-4" />
                },
                {
                  href: "/sher",
                  label: t('sher'),
                  description: t('sher_description'),
                  icon: <Feather className="h-4 w-4" />
                }
              ]}
            />

            <NavigationDropdown
              trigger={t('media')}
              items={[
                {
                  href: "/videos",
                  label: t('videos'),
                  description: t('videos_description'),
                  icon: <Video className="h-4 w-4" />
                },
                {
                  href: "/blog",
                  label: t('blog'),
                  description: t('blog_description'),
                  icon: <BookOpen className="h-4 w-4" />
                }
              ]}
            />

            <NavigationDropdown
              trigger={t('interact')}
              items={[
                {
                  href: "/quiz",
                  label: t('quiz'),
                  description: t('quiz_description'),
                  icon: <HelpCircle className="h-4 w-4" />
                }
              ]}
            />

            <Link
              href="/about"
              className="inline-flex h-9 items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
            >
              {t('about')}
            </Link>

            {loading ? (
              <div className="w-24 h-8 bg-muted animate-pulse rounded"></div>
            ) : user ? (
              <div className="flex items-center gap-4">
                {user.isAdmin ? (
                  <Link href="/admin" className="text-foreground hover:text-primary transition font-medium text-sm">
                    {t('admin')}
                  </Link>
                ) : (
                  <Link href="/profile" className="text-foreground hover:text-primary transition font-medium text-sm">
                    {t('profile')}
                  </Link>
                )}
                <Button variant="ghost" size="sm" onClick={handleLogout}>
                  {t('logout')}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login" className="text-foreground hover:text-primary transition font-medium text-sm">
                  {t('login')}
                </Link>
                <Button asChild size="sm">
                  <Link href="/register">{t('signUp')}</Link>
                </Button>
              </div>
            )}
            {/* Language Selector for Desktop */}
            {mounted && <LanguageSelector />}
            {/* Theme Toggle for Desktop */}
            {mounted && (
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {resolvedTheme === "dark" ? (
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {/* Language Selector for Mobile */}
            {mounted && <LanguageSelector />}
            {/* Theme Toggle for Mobile */}
            {mounted && (
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2">
                {resolvedTheme === "dark" ? (
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                ) : (
                  <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-foreground" suppressHydrationWarning>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border animate-in slide-in-from-top-5" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="space-y-4 py-4">
              {/* Literature Section */}
              <div className="px-2">
                <h3 className="mb-2 px-2 text-lg font-semibold tracking-tight text-primary">Literature</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/poems" className="block p-2 text-sm text-foreground hover:bg-muted rounded-md" onClick={() => setIsOpen(false)}>Poems</Link>
                  <Link href="/books" className="block p-2 text-sm text-foreground hover:bg-muted rounded-md" onClick={() => setIsOpen(false)}>Books</Link>
                  <Link href="/shayari" className="block p-2 text-sm text-foreground hover:bg-muted rounded-md" onClick={() => setIsOpen(false)}>Shayari</Link>
                  <Link href="/sher" className="block p-2 text-sm text-foreground hover:bg-muted rounded-md" onClick={() => setIsOpen(false)}>Sher</Link>
                </div>
              </div>

              {/* Media Section */}
              <div className="px-2">
                <h3 className="mb-2 px-2 text-lg font-semibold tracking-tight text-primary">Media</h3>
                <div className="grid grid-cols-2 gap-2">
                  <Link href="/videos" className="block p-2 text-sm text-foreground hover:bg-muted rounded-md" onClick={() => setIsOpen(false)}>Videos</Link>
                  <Link href="/blog" className="block p-2 text-sm text-foreground hover:bg-muted rounded-md" onClick={() => setIsOpen(false)}>Blog</Link>
                </div>
              </div>

              {/* Interact Section */}
              <div className="px-2">
                <h3 className="mb-2 px-2 text-lg font-semibold tracking-tight text-primary">Interact</h3>
                <div>
                  <Link href="/quiz" className="block p-2 text-sm text-foreground hover:bg-muted rounded-md" onClick={() => setIsOpen(false)}>Quiz</Link>
                </div>
              </div>

              <div className="px-4">
                <Link href="/about" className="block py-2 text-lg font-medium text-foreground hover:text-primary border-b border-border" onClick={() => setIsOpen(false)}>
                  About
                </Link>
              </div>
            </div>

            <div className="px-4 py-4 space-y-3">
              {loading ? (
                <div className="w-20 h-8 bg-muted animate-pulse rounded"></div>
              ) : user ? (
                <>
                  {user.isAdmin ? (
                    <Link href="/admin" className="block py-2 text-foreground hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
                      {t('admin')}
                    </Link>
                  ) : (
                    <Link href="/profile" className="block py-2 text-foreground hover:text-primary font-medium" onClick={() => setIsOpen(false)}>
                      {t('profile')}
                    </Link>
                  )}
                  <button onClick={() => { handleLogout(); setIsOpen(false); }} className="block w-full text-left py-2 text-red-500 hover:text-red-600 font-medium">
                    {t('logout')}
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link href="/login" className="block py-2 text-foreground hover:text-primary" onClick={() => setIsOpen(false)}>
                    {t('login')}
                  </Link>
                  <Link href="/register" className="block py-2 text-primary font-bold" onClick={() => setIsOpen(false)}>
                    {t('signUp')}
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
