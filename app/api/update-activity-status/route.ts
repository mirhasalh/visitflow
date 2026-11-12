import { NextRequest, NextResponse } from 'next/server'
import { updateActivityStatus } from '@/lib/db'

export async function POST(request: NextRequest) {
  try {
    const { activityId, status } = await request.json()
    const updatedActivity = await updateActivityStatus(activityId, status)
    return NextResponse.json(updatedActivity)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update activity status' }, { status: 500 })
  }
}
