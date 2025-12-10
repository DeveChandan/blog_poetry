import crypto from "crypto"
import { jwtVerify, SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "poem-blog-secret-key-change-in-production")

export function hashPassword(password: string): string {
  return crypto.pbkdf2Sync(password, "poem-blog-salt", 1000, 64, "sha512").toString("hex")
}

export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash
}

export async function createToken(userId: string, isAdmin: boolean): Promise<string> {
  const token = await new SignJWT({ userId, isAdmin, iat: Date.now() })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
  return token
}

export async function verifyToken(token: string): Promise<{ userId: string; isAdmin: boolean } | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as { userId: string; isAdmin: boolean }
  } catch {
    return null
  }
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex")
}
