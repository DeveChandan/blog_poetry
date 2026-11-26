import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import GoogleAnalytics from "@/components/google-analytics"
import Navigation from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { LanguageProvider } from "@/lib/language-context"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700", "800", "900"],
})

const dancingScript = Dancing_Script({
  subsets: ["latin"],
  variable: "--font-cursive",
  weight: ["400", "500", "600", "700"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://rsunkahi.com"),
  title: "RSUNKAHI | शब्दों की दुनिया — Dr. Rupesh Kumar Singh",
  description:
    "Explore Hindi poetry, published books, literary articles, and the RSUNKAHI Literature Club by Dr. Rupesh Kumar Singh.",
  keywords: "rsunkahi, poetry, hindi poems, books, literature club, Dr Rupesh Kumar Singh",
  authors: [{ name: "Dr. Rupesh Kumar Singh" }],
  openGraph: {
    title: "RSUNKAHI | शब्दों की दुनिया",
    description: "Discover poems, books, and the RSUNKAHI Literature Club",
    type: "website",
    url: "https://rsunkahi.com",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  generator: 'v0.app'
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="hi"
      className={`${inter.variable} ${playfairDisplay.variable} ${dancingScript.variable}`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <GoogleAnalytics measurementId="G-Q24X5LSVLY" />
            <Navigation />
            <main className="min-h-screen">{children}</main>
            <Analytics />
            <Toaster
              position="bottom-right"
              toastOptions={{
                classNames: {
                  toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
                  description: 'group-[.toast]:text-muted-foreground',
                  actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                  cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
                },
              }}
            />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
