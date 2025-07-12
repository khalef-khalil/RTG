import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const systems = await db.system.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(systems)
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to fetch systems' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const system = await db.system.create({
      data: {
        trigger: body.trigger,
        action: body.action,
        outcome: body.outcome,
        category: body.category,
        source: body.source
      }
    })
    return NextResponse.json(system)
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to create system' }, { status: 500 })
  }
} 