"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/hooks/use-session" // Import useSession

export default function LogoutPage() {
  const router = useRouter()
  const { refetch } = useSession() // Get the refetch function

  useEffect(() => {
    async function performLogout() {
      try {
        const res = await fetch("/api/auth/logout", { method: "GET" })
        if (res.ok) {
          console.log("Logged out successfully")
          refetch() // Re-fetch session to update global state
        }
      } catch (error) {
        console.error("Error during logout:", error)
      } finally {
        router.push("/login") // Always redirect to login after attempting logout
      }
    }
    performLogout()
  }, [router, refetch]) // Add refetch to dependency array

  return (
    <main className="min-h-screen bg-background py-12 text-center">
      <p>Logging out...</p>
    </main>
  )
}
