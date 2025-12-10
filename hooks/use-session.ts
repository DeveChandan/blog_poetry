"use client"

import { useState, useEffect, useCallback } from "react" // Import useCallback

interface UserSession {
  userId: string
  email: string
  isAdmin: boolean
  // Add other user properties as needed
}

interface SessionHook {
  user: UserSession | null
  loading: boolean
  error: string | null
  refetch: () => void // Add refetch function
}

export function useSession(): SessionHook {
  const [user, setUser] = useState<UserSession | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSession = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/session")
      console.log("useSession: Raw response from /api/auth/session:", res)
      const data = await res.json()
      console.log("useSession: Parsed data from /api/auth/session:", data)

      if (res.ok && data.user) {
        setUser(data.user)
        return data.user // Return the fetched user
      } else {
        setUser(null)
        return null
      }
    } catch (err) {
      console.error("Failed to fetch session:", err)
      setError("Failed to fetch session.")
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSession()
  }, [fetchSession])

  return { user, loading, error, refetch: fetchSession }
}
