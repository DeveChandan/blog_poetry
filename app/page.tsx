import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">Welcome to My Poetry & Literary World</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Discover beautifully crafted poems, published books, and engaging stories. Join a community of readers and
            writers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/poems">Explore Poems</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/books">Browse Books</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-12 text-center">Featured Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-background p-6 rounded-lg border border-border hover:border-primary transition"
              >
                <div className="h-48 bg-muted rounded mb-4"></div>
                <h3 className="text-xl font-bold text-foreground mb-2">Featured Work {item}</h3>
                <p className="text-muted-foreground mb-4">Experience the beauty of carefully crafted literary works.</p>
                <Link href="/poems" className="text-primary hover:underline">
                  Read More →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-6">Join Our Community</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Share your thoughts, write reviews, and connect with other literature enthusiasts.
          </p>
          <Button asChild size="lg">
            <Link href="/register">Create Account</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
