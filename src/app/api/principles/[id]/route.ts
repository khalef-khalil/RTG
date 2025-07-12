import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = await request.json()
    const { id } = await params
    const { data: principle, error } = await supabaseAdmin
      .from('principles')
      .update({
        text: body.text,
        type: body.type,
        category: body.category,
        source: body.source
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to update principle' }, { status: 500 })
    }

    return NextResponse.json(principle)
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to update principle' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { error } = await supabaseAdmin
      .from('principles')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to delete principle' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to delete principle' }, { status: 500 })
  }
} 