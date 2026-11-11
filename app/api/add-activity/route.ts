import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { addActivity } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const token = (await cookies()).get('session')?.value
    const { entity, visitDate, status, salesName, updatedDate } = await request.json()

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    const result = await addActivity(`${payload.userId}`, entity, visitDate, status, salesName, updatedDate)

    if (!result) {
      return NextResponse.json({ error: 'Failed to add activity' }, { status: 500 })
    }

    return NextResponse.json({ id: result.id }, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
