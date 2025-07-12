import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: principles, error } = await supabaseAdmin
      .from('principles')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch principles' }, { status: 500 })
    }

    return NextResponse.json(principles || [])
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to fetch principles' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data: principle, error } = await supabaseAdmin
      .from('principles')
      .insert({
        text: body.text,
        type: body.type,
        category: body.category,
        source: body.source,
        quote: body.quote
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create principle' }, { status: 500 })
    }

    return NextResponse.json(principle)
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to create principle' }, { status: 500 })
  }
} 