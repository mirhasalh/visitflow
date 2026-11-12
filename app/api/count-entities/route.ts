import { NextResponse } from 'next/server'
import { countEntities } from '@/lib/db'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function POST() {
  try {
    const token = (await cookies()).get('session')?.value

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const count = await countEntities(`${payload.userId}`)
    return NextResponse.json({ count }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
