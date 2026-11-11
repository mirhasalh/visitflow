import { SignJWT, jwtVerify } from 'jose'
import type { NextResponse } from 'next/server'

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE
  })
}

const secret = process.env.JWT_SECRET
if (!secret) throw new Error('Missing environment variable: "JWT_SECRET"')

const key = new TextEncoder().encode(secret)

export const SESSION_COOKIE = 'session'
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days, in seconds

export async function signSession(payload: { userId: string; email: string }) {
  return new SignJWT(payload).setProtectedHeader({ alg: 'HS256' }).setSubject(payload.userId).setIssuedAt().setExpirationTime(`${SESSION_MAX_AGE}s`).sign(key)
}

export async function verifySession(token: string) {
  try {
    const { payload } = await jwtVerify(token, key, { algorithms: ['HS256'] })
    return payload as { userId: string; email: string }
  } catch {
    return null
  }
}
