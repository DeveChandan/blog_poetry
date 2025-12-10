"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react" // Import useEffect
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes" // Import useTheme
import { Moon, Sun } from "lucide-react" // Import icons
import { useSession } from "@/hooks/use-session" // Import useSession

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme() // Use resolvedTheme
  const { user, loading } = useSession() // Use the session hook
  const [mounted, setMounted] = useState(false) // State to track if component is mounted

  // useEffect to set mounted to true after client-side mount
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <nav className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-primary">
            Poetry & Books
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link href="/poems" className="text-foreground hover:text-primary transition">
              Poems
            </Link>
            <Link href="/books" className="text-foreground hover:text-primary transition">
              Books
            </Link>
            <Link href="/videos" className="text-foreground hover:text-primary transition">
              Videos
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition">
              About
            </Link>
            {loading ? (
              <div className="w-16 h-6 bg-muted animate-pulse rounded"></div> // Placeholder while loading session
            ) : user ? (
              <Link href="/profile" className="text-foreground hover:text-primary transition">
                Profile
              </Link>
            ) : (
              <Link href="/login" className="text-foreground hover:text-primary transition">
                Login
              </Link>
            )}
            {/* Theme Toggle for Desktop */}
            {mounted && ( // Only render theme toggle after component mounts
              <Button variant="ghost" size="icon" onClick={toggleTheme}>
                {resolvedTheme === "dark" ? ( // If current theme is dark, show Sun icon (to switch to light)
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                ) : ( // If current theme is light, show Moon icon (to switch to dark)
                  <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            {/* Theme Toggle for Mobile */}
            {mounted && ( // Only render theme toggle after component mounts
              <Button variant="ghost" size="icon" onClick={toggleTheme} className="mr-2">
                {resolvedTheme === "dark" ? ( // If current theme is dark, show Sun icon (to switch to light)
                  <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                ) : ( // If current theme is light, show Moon icon (to switch to dark)
                  <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="flex flex-col gap-1">
              <div className="w-6 h-0.5 bg-foreground"></div>
              <div className="w-6 h-0.5 bg-foreground"></div>
              <div className="w-6 h-0.5 bg-foreground"></div>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4 border-t border-border">
            <Link href="/poems" className="block py-2 text-foreground hover:text-primary">
              Poems
            </Link>
            <Link href="/books" className="block py-2 text-foreground hover:text-primary">
              Books
            </Link>
            <Link href="/videos" className="block py-2 text-foreground hover:text-primary">
              Videos
            </Link>
            <Link href="/about" className="block py-2 text-foreground hover:text-primary">
              About
            </Link>
            {loading ? (
              <div className="w-16 h-6 bg-muted animate-pulse rounded"></div> // Placeholder while loading session
            ) : user ? (
              <Link href="/profile" className="block py-2 text-foreground hover:text-primary">
                Profile
              </Link>
            ) : (
              <Link href="/login" className="block py-2 text-foreground hover:text-primary">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
