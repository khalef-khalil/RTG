import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const focusItems = await db.focus.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(focusItems)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch focus items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const focusItem = await db.focus.create({
      data: {
        text: body.text,
        type: body.type,
        category: body.category,
        source: body.source
      }
    })
    return NextResponse.json(focusItem)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create focus item' }, { status: 500 })
  }
} 