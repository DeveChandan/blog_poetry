"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function LogoutPage() {
  const router = useRouter()

  useEffect(() => {
    async function logout() {
      await fetch("/api/auth/logout", { method: "POST" })
      router.push("/")
    }
    logout()
  }, [router])

  return <div className="py-12 text-center">Logging out...</div>
}
