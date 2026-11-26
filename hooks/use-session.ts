"use client"

import { useState, useEffect, useCallback } from "react"

interface UserSession {
  userId: string
  email: string
  isAdmin: boolean
}

interface SessionHook {
  user: UserSession | null
  loading: boolean
  error: string | null
  refetch: () => Promise<UserSession | null>
}

let cachedUser: UserSession | null | undefined = undefined
let inflightSession: Promise<UserSession | null> | null = null

async function loadSession(force = false): Promise<UserSession | null> {
  if (!force && cachedUser !== undefined) {
    return cachedUser
  }
  if (!force && inflightSession) {
    return inflightSession
  }

  inflightSession = fetch("/api/auth/session")
    .then(async (res): Promise<UserSession | null> => {
      if (!res.ok) {
        cachedUser = null
        return null
      }
      const data = await res.json()
      const user: UserSession | null = data.user || null
      cachedUser = user
      return user
    })
    .catch((err) => {
      console.error("Failed to fetch session:", err)
      cachedUser = null
      return null
    })
    .finally(() => {
      inflightSession = null
    })

  return inflightSession
}

export function useSession(): SessionHook {
  const [user, setUser] = useState<UserSession | null>(cachedUser ?? null)
  const [loading, setLoading] = useState(cachedUser === undefined)
  const [error, setError] = useState<string | null>(null)

  const fetchSession = useCallback(async (force = true) => {
    setLoading(true)
    setError(null)
    try {
      const result = await loadSession(force)
      setUser(result)
      return result
    } catch {
      setError("Failed to fetch session.")
      setUser(null)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    if (cachedUser !== undefined) {
      setUser(cachedUser)
      setLoading(false)
      return
    }
    loadSession(false).then((result) => {
      if (active) {
        setUser(result)
        setLoading(false)
      }
    })
    return () => {
      active = false
    }
  }, [])

  return { user, loading, error, refetch: () => fetchSession(true) }
}
