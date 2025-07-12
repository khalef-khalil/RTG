import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const focusItem = await db.focus.update({
      where: { id: params.id },
      data: {
        text: body.text,
        type: body.type,
        category: body.category,
        source: body.source
      }
    })
    return NextResponse.json(focusItem)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update focus item' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await db.focus.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete focus item' }, { status: 500 })
  }
} 