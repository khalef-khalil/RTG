import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const challenge = await db.challenge.findUnique({
      where: { id }
    })

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    return NextResponse.json(challenge)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch challenge' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { completed, progress, completedAt } = body

    const challenge = await db.challenge.update({
      where: { id },
      data: {
        completed: completed ?? undefined,
        progress: progress ?? undefined,
        completedAt: completed ? new Date(completedAt || Date.now()) : undefined
      }
    })

    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error updating challenge:', error)
    return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    await db.challenge.delete({
      where: { id }
    })

    return NextResponse.json({ message: 'Challenge deleted successfully' })
  } catch (error) {
    console.error('Error deleting challenge:', error)
    return NextResponse.json({ error: 'Failed to delete challenge' }, { status: 500 })
  }
} 