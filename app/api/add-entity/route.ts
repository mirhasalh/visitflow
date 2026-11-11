import { NextRequest, NextResponse } from 'next/server'
import { addEntity } from '@/lib/db'

export async function POST(request: NextRequest) {
  const { userId, name, type, segment, region } = await request.json()
  console.log('Request body:', { userId, name, type, segment, region }) // Log the request body for debugging
  if (!userId || !name || !type || !segment || !region) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const result = await addEntity(userId, { name, type, segment, region })

  if (!result) {
    return NextResponse.json({ error: 'Entity already exists' }, { status: 409 })
  }
  return NextResponse.json({ id: result.id }, { status: 201 })
}
