import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { getUserById } from '@/lib/db'

export async function GET() {
  const token = (await cookies()).get('session')?.value

  if (!token) {
    return NextResponse.json({ error: 'No token' }, { status: 401 })
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const user = await getUserById(`${payload.userId}`)
    return NextResponse.json({ user: user })
  } catch (err: any) {
    return NextResponse.json({ error: err.code }, { status: 401 })
  }
}
