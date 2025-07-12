import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { id } = await params
    const { data: system, error } = await supabaseAdmin
      .from('systems')
      .update({
        trigger: body.trigger,
        action: body.action,
        outcome: body.outcome,
        category: body.category,
        source: body.source,
        description: body.description
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update system' }, { status: 500 })
    }

    return NextResponse.json(system)
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to update system' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await supabaseAdmin
      .from('systems')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete system' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to delete system' }, { status: 500 })
  }
} 