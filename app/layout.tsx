import type React from "react"
import type { Metadata, Viewport } from "next"
import { Inter, Playfair_Display } from "next/font/google" // Using Inter for sans-serif
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Navigation from "@/components/navigation"
import { ThemeProvider } from "@/components/theme-provider" // Import ThemeProvider

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans", // Map to --font-sans
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif", // Map to --font-serif
  weight: ["400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "Poetry & Books Blog | Discover Literary Works",
  description:
    "Explore beautifully crafted poems, published books, and literary content. Join our community of readers and writers.",
  keywords: "poetry, books, literature, author, e-books, stories",
  authors: [{ name: "Author" }],
  openGraph: {
    title: "Poetry & Books Blog",
    description: "Discover poems and books from an independent author",
    type: "website",
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
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${playfairDisplay.variable}`}>
      <body className={`font-sans antialiased`}> {/* Use font-sans class */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navigation />
          <main>{children}</main>
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
