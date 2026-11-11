// app/api/login/route.ts
import { NextResponse } from 'next/server'
import { getUserByEmail } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/utils/password'
import { signSession, setSessionCookie } from '@/lib/session'

// Used when the email doesn't exist, so response time doesn't reveal
// whether an account is registered.
const dummyHash = hashPassword('not-a-real-password')

function fail() {
  return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 })
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const email = formData.get('email')
  const password = formData.get('password')

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return fail()
  }

  const normalizedEmail = email.trim().toLowerCase()
  const user = await getUserByEmail(normalizedEmail)

  const valid = await verifyPassword(password, user?.password ?? (await dummyHash))
  if (!user || !valid) return fail()

  const token = await signSession({ userId: user._id.toString(), email: user.email })

  const response = NextResponse.json({
    ok: true,
    user: {
      _id: user._id.toString(),
      name: user.name,
      email: user.email
    }
  })

  setSessionCookie(response, token)
  return response
}
