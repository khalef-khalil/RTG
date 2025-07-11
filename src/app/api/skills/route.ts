import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const skills = await db.skill.findMany({
      include: {
        challenge: true,
        prerequisites: true,
        dependents: true
      }
    })
    return NextResponse.json(skills)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const skill = await db.skill.create({
      data: {
        name: body.name,
        description: body.description,
        x: body.x,
        y: body.y,
        category: body.category,
        completed: body.completed || false
      }
    })
    return NextResponse.json(skill)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create skill' }, { status: 500 })
  }
} 