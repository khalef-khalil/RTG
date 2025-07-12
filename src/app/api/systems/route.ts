import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  try {
    const { data: systems, error } = await supabaseAdmin
      .from('systems')
      .select('*')
      .order('createdAt', { ascending: false })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to fetch systems' }, { status: 500 })
    }

    return NextResponse.json(systems || [])
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to fetch systems' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { data: system, error } = await supabaseAdmin
      .from('systems')
      .insert({
        trigger: body.trigger,
        action: body.action,
        outcome: body.outcome,
        category: body.category,
        source: body.source,
        description: body.description
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Failed to create system' }, { status: 500 })
    }

    return NextResponse.json(system)
  } catch (error) {
    console.error('Error in API:', error)
    return NextResponse.json({ error: 'Failed to create system' }, { status: 500 })
  }
} 