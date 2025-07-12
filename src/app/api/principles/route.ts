import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const principles = await db.principle.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(principles)
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to fetch principles' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const principle = await db.principle.create({
      data: {
        text: body.text,
        type: body.type,
        category: body.category,
        source: body.source
      }
    })
    return NextResponse.json(principle)
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to create principle' }, { status: 500 })
  }
} 