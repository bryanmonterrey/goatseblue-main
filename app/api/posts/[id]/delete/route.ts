// app/api/posts/[id]/delete/route.ts
import { supabase } from '@/lib/supabase'

export async function POST(
  request: Request,
) {
  try {
    // Get the id from the URL instead
    const url = new URL(request.url)
    const id = url.pathname.split('/').pop() // This will get the ID from the URL

    // Now we can add the rest of the functionality
    const { password } = await request.json()
    
    // Your Supabase delete logic here
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('deletion_password')
      .eq('id', id)
      .single()

    if (fetchError || !post) {
      return Response.json(
        { error: 'Post not found' }, 
        { status: 404 }
      )
    }

    if (post.deletion_password !== password) {
      return Response.json(
        { error: 'Invalid password' }, 
        { status: 403 }
      )
    }

    const { error: deleteError } = await supabase
      .from('posts')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: 'Failed' }, { status: 500 })
  }
}