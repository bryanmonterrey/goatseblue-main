// app/api/posts/[id]/report/route.ts
import { supabase } from '@/lib/supabase'

export async function POST(
  request: Request,
) {
  try {
    // Get the id from the URL
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop()

    const { reason } = await request.json()
    
    const { error } = await supabase
      .from('reports')
      .insert([{
        post_id: id,
        reason: reason,
        status: 'pending'
      }])

    if (error) {
      return Response.json(
        { error: 'Failed to create report' },
        { status: 500 }
      )
    }

    return Response.json({ 
      success: true,
      message: 'Report submitted successfully'
    })
  } catch (error) {
    return Response.json(
      { error: 'Failed to submit report' }, 
      { status: 500 }
    )
  }
}