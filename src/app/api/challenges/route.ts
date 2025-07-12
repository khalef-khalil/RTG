import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const challenges = await db.challenge.findMany({
      orderBy: [
        { completed: 'asc' },
        { deadline: 'asc' },
        { priority: 'desc' }
      ]
    })

    return NextResponse.json(challenges)
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, type, targetValue, deadline, timeLimit, priority, category, checklistItems } = body

    const challenge = await db.challenge.create({
      data: {
        title,
        description,
        type,
        targetValue,
        deadline: deadline ? new Date(deadline) : null,
        timeLimit,
        priority: priority || 'medium',
        category,
        checklistItems
      }
    })

    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error creating challenge:', error)
    return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 })
  }
} 