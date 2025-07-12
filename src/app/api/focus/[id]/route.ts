import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { id } = await params
    const focusItem = await db.focus.update({
      where: { id },
      data: {
        text: body.text,
        type: body.type,
        category: body.category,
        source: body.source
      }
    })
    return NextResponse.json(focusItem)
  } catch (error) {
    console.error('Error in API:', error)
    console.error('Error updating focus item:', error)
    return NextResponse.json({ error: 'Failed to update focus item' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await db.focus.delete({
      where: { id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in API:', error)
    console.error('Error deleting focus item:', error)
    return NextResponse.json({ error: 'Failed to delete focus item' }, { status: 500 })
  }
} 