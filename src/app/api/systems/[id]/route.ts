import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const system = await db.system.update({
      where: { id: params.id },
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
    return NextResponse.json({ error: 'Failed to update system' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await db.system.delete({
      where: { id: params.id }
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete system' }, { status: 500 })
  }
} 