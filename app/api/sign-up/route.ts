import { createUser } from '@/lib/db'
import { hashPassword } from '@/utils/password'
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/session'
import { NextResponse } from 'next/server'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request: Request) {
  const formData = await request.formData()
  const name = formData.get('name')
  const email = formData.get('email')
  const password = formData.get('password')

  // 1. Validate
  if (typeof name !== 'string' || name.trim().length < 1 || typeof email !== 'string' || !EMAIL_RE.test(email.trim()) || typeof password !== 'string' || password.length < 8 || password.length > 72) {
    return NextResponse.json({ error: 'Invalid name, email, or password.' }, { status: 400 })
  }

  const normalizedEmail = email.trim().toLowerCase()

  // 2. Hash (bcrypt ignores bytes past 72, hence the max length above)
  const hashed = await hashPassword(password)

  // 3. Create user
  const user = await createUser({
    name: name.trim(),
    email: normalizedEmail,
    password: hashed
  })
  if (!user) {
    return NextResponse.json({ error: 'Email already in use.' }, { status: 409 })
  }

  // 4. Issue JWT
  const token = await signSession({ userId: user.id, email: normalizedEmail })

  // 6. Redirect (303 so the browser follows with GET after a POST)
  const response = NextResponse.redirect(new URL('/app', request.url), 303)

  // 5. HTTP-only session cookie
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE
  })

  return response
}
