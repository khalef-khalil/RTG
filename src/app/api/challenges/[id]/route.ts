import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { data: challenge, error } = await supabaseAdmin
      .from('challenges')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Challenge not found' }, { status: 404 })
    }

    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to fetch challenge' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { title, description, type, targetValue, deadline, timeLimit, priority, category, checklistItems } = body

    const updateData: any = {}
    if (title !== undefined) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (type !== undefined) updateData.type = type
    if (targetValue !== undefined) updateData.targetValue = targetValue
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null
    if (timeLimit !== undefined) updateData.timeLimit = timeLimit
    if (priority !== undefined) updateData.priority = priority
    if (category !== undefined) updateData.category = category
    if (checklistItems !== undefined) updateData.checklistItems = checklistItems

    const { data: challenge, error } = await supabaseAdmin
      .from('challenges')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 })
    }

    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { completed, progress, completedAt, biggestObstacle, improvement, pushRating } = body

    const updateData: any = {}
    if (completed !== undefined) updateData.completed = completed
    if (progress !== undefined) updateData.progress = progress
    if (completedAt !== undefined) updateData.completedAt = completed ? new Date(completedAt || Date.now()) : null
    if (biggestObstacle !== undefined) updateData.biggestObstacle = biggestObstacle
    if (improvement !== undefined) updateData.improvement = improvement
    if (pushRating !== undefined) updateData.pushRating = pushRating

    const { data: challenge, error } = await supabaseAdmin
      .from('challenges')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 })
    }

    return NextResponse.json(challenge)
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to update challenge' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const { error } = await supabaseAdmin
      .from('challenges')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete challenge' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Challenge deleted successfully' })
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to delete challenge' }, { status: 500 })
  }
} 