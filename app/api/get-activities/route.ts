import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { getActivities } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get('session')?.value
    const { page, limit } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const activities = await getActivities(`${payload.userId}`, page, limit)
    return NextResponse.json({ activities }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
