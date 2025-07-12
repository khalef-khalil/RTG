import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: challenges, error } = await supabaseAdmin
      .from('challenges')
      .select('*')
      .order('completed', { ascending: true })
      .order('deadline', { ascending: true })
      .order('priority', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 })
    }

    return NextResponse.json(challenges || [])
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to fetch challenges' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, description, type, targetValue, deadline, timeLimit, priority, category, checklistItems } = body

    const { data: challenge, error } = await supabaseAdmin
      .from('challenges')
      .insert({
        title,
        description,
        type,
        targetValue,
        deadline: deadline ? new Date(deadline) : null,
        timeLimit,
        priority: priority || 'medium',
        category,
        checklistItems
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 })
    }

    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to create challenge' }, { status: 500 })
  }
} 