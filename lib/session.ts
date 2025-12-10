import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import type { NextRequest } from "next/server"

const secret = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-change-this")

export async function createSession(userId: string, isAdmin: boolean) {
  const token = await new SignJWT({ userId, isAdmin, type: "auth" })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret)

  const cookieStore = await cookies()
  cookieStore.set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
  })

  return token
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) return null

  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as { userId: string; isAdmin: boolean; type: string } | null
  } catch {
    return null
  }
}

export async function getSessionUser(request: NextRequest) {
  const authHeader = request.headers.get("cookie")

  if (!authHeader) return null

  const cookieStore = await cookies()
  const token = cookieStore.get("auth_token")?.value

  if (!token) return null

  try {
    const verified = await jwtVerify(token, secret)
    return verified.payload as { userId: string; isAdmin: boolean; type: string } | null
  } catch {
    return null
  }
}

export async function clearSession() {
  const cookieStore = await cookies()
  cookieStore.delete("auth_token")
}

export async function requireAdminSession() {
  const session = await getSession()
  if (!session || !session.isAdmin) {
    return null
  }
  return session
}
