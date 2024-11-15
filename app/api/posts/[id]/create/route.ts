// app/api/posts/create/route.ts
import { supabase } from '@/lib/supabase'
import { v4 as uuidv4 } from 'uuid'

export async function POST(
  request: Request,
) {
  try {
    const formData = await request.formData()
    
    // Get all the form fields
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const comment = formData.get('comment') as string
    const password = formData.get('password') as string
    const file = formData.get('file') as File | null
    
    let filePath = null

    // Handle file upload if a file is present
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop()
      const fileName = `${uuidv4()}.${fileExt}`
      
      const { error: uploadError } = await supabase.storage
        .from('post-attachments')
        .upload(fileName, file)

      if (uploadError) throw uploadError
      filePath = fileName
    }

    // Create the post
    const { data, error } = await supabase
      .from('posts')
      .insert([
        {
          name,
          email,
          subject,
          comment,
          file_path: filePath,
          deletion_password: password
        }
      ])
      .select()

    if (error) throw error

    return Response.json({ 
      success: true,
      data,
      message: 'Post created successfully' 
    })

  } catch (error) {
    return Response.json(
      { error: 'Failed to create post' }, 
      { status: 500 }
    )
  }
}