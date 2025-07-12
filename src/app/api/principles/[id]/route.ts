import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { id } = await params
    const principle = await db.principle.update({
      where: { id },
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
    return NextResponse.json({ error: 'Failed to update principle' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.principle.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to delete principle' }, { status: 500 })
  }
} 