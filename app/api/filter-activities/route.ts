import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { filterActivities } from '@/lib/db'

function parseDate(value: string, endOfDay = false): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const date = new Date(`${value}T${endOfDay ? '23:59:59.999' : '00:00:00.000'}Z`)
  return isNaN(date.getTime()) ? null : date
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl

  const segment = searchParams.get('segment')
  const status = searchParams.get('status')
  const fromParam = searchParams.get('from')
  const toParam = searchParams.get('to')
  const search = searchParams.get('search') ?? undefined
  const page = parseInt(searchParams.get('page') ?? '1', 10) || 1
  const limit = parseInt(searchParams.get('limit') ?? '20', 10) || 20

  let from: Date | undefined
  let to: Date | undefined

  if (fromParam) {
    const parsed = parseDate(fromParam)
    if (!parsed) {
      return NextResponse.json({ error: "Invalid 'from' date (use YYYY-MM-DD)" }, { status: 400 })
    }
    from = parsed
  }
  if (toParam) {
    const parsed = parseDate(toParam, true)
    if (!parsed) {
      return NextResponse.json({ error: "Invalid 'to' date (use YYYY-MM-DD)" }, { status: 400 })
    }
    to = parsed
  }
  if (from && to && from > to) {
    return NextResponse.json({ error: "'from' must not be after 'to'" }, { status: 400 })
  }

  try {
    const token = (await cookies()).get('session')?.value

    if (!token) {
      return NextResponse.json({ error: 'No token' }, { status: 401 })
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)

    if (!payload.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const result = await filterActivities(`${payload.userId}`, {
      segment: segment,
      status: status,
      from,
      to,
      search,
      page,
      limit
    })
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
