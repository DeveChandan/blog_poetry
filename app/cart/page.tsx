"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CartItem {
  bookId: string
  quantity: number
  price: number
}

interface Book {
  _id: string
  title: string
  cover: string
}

export default function CartPage() {
  const router = useRouter()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [books, setBooksMap] = useState<Record<string, Book>>({})
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState("")

  useEffect(() => {
    async function fetchCart() {
      try {
        const res = await fetch("/api/cart")
        if (res.ok) {
          const data = await res.json()
          setCartItems(data)

          // Fetch book details for each item
          const bookIds = data.map((item: CartItem) => item.bookId)
          const booksData: Record<string, Book> = {}
          for (const bookId of bookIds) {
            const bookRes = await fetch(`/api/books/${bookId}`)
            if (bookRes.ok) {
              const book = await bookRes.json()
              booksData[bookId] = book
            }
          }
          setBooksMap(booksData)
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchCart()
  }, [])

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = async () => {
    if (!email) {
      alert("Please enter your email")
      return
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cartItems,
          email,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        router.push(`/checkout/success?orderId=${data.orderId}`)
      } else {
        alert("Checkout failed")
      }
    } catch (error) {
      console.error("Checkout error:", error)
    }
  }

  if (loading) return <div className="py-12 text-center">Loading cart...</div>

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold text-foreground mb-4">Your Cart</h1>
          <p className="text-muted-foreground mb-8">Your cart is empty</p>
          <Button asChild>
            <Link href="/books">Continue Shopping</Link>
          </Button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const book = books[item.bookId]
              return (
                <Card key={item.bookId}>
                  <CardContent className="p-6 flex gap-4">
                    <div className="w-20 h-20 bg-muted rounded flex-shrink-0">
                      {book?.cover && (
                        <img
                          src={book.cover || "/placeholder.svg"}
                          alt={book.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-foreground">{book?.title || "Loading..."}</h3>
                      <p className="text-muted-foreground">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                      <p className="text-sm text-muted-foreground">${item.price} each</p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          {/* Order Summary */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="text-foreground">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-foreground">$0.00</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-bold">
                    <span className="text-foreground">Total</span>
                    <span className="text-primary">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-border bg-background text-foreground"
                  />
                  <Button onClick={handleCheckout} className="w-full">
                    Proceed to Checkout
                  </Button>
                  <Button variant="outline" asChild className="w-full bg-transparent">
                    <Link href="/books">Continue Shopping</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
