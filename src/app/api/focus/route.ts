import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: focusItems, error } = await supabaseAdmin
      .from('focus')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch focus items' }, { status: 500 })
    }

    return NextResponse.json(focusItems || [])
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to fetch focus items' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data: focusItem, error } = await supabaseAdmin
      .from('focus')
      .insert({
        text: body.text,
        type: body.type,
        category: body.category,
        source: body.source
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create focus item' }, { status: 500 })
    }

    return NextResponse.json(focusItem)
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to create focus item' }, { status: 500 })
  }
} 