import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { getEntities } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get('session')?.value
    const { page, limit } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const entities = await getEntities(`${payload.userId}`, page, limit)
    console.log('Entities', entities)
    return NextResponse.json({ entities }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
