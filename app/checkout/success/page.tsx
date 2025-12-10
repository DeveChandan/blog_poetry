"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  return (
    <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="text-4xl mb-4">✓</div>
            <CardTitle>Order Placed Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded text-center">
              <p className="text-sm text-muted-foreground mb-1">Order ID</p>
              <p className="font-mono text-sm text-foreground break-all">{orderId}</p>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Thank you for your purchase! We've sent a confirmation email to your address.
            </p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/books">Continue Shopping</Link>
              </Button>
              <Button variant="outline" asChild className="w-full bg-transparent">
                <Link href="/">Back Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
