"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch("/api/auth/verify", {
          method: "GET",
        })

        if (res.ok) {
          const data = await res.json()
          if (data.isAdmin) {
            setIsAuthorized(true)
          } else {
            router.push("/")
          }
        } else {
          router.push("/login")
        }
      } catch (error) {
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-muted-foreground">Verifying access...</div>
        </div>
      </main>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return <>{children}</>
}

export default AdminGuard
