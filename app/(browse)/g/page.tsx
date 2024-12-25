// app/page.tsx
'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'
import { validateFile } from '@/utils/file-validation'
import { useToast } from '@/hooks/use-toast'
import PostList from '@/components/PostList'
import { Link } from 'next-view-transitions'

export default function Home() {
  const router = useRouter()
  const { toast } = useToast()  // Add this line
  const [uploading, setUploading] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault() // Keep this
    setUploading(true)
  
    try {
      // Create FormData from the event target
      const form = e.currentTarget
      const formData = new FormData(form)
      let filePath = null
  
      // Handle file upload if a file is selected
      const file = formData.get('file') as File
      if (file && file.size > 0) {
        try {
          validateFile(file)
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Invalid file",
            description: error instanceof Error ? error.message : "File validation failed",
          })
          setUploading(false)
          return
        }
  
        const fileExt = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('post-attachments')
          .upload(fileName, file)
  
        if (uploadError) throw uploadError
        filePath = fileName
      }
  
      // Create the post
      const { error: postError } = await supabase
        .from('posts')
        .insert([{
          name: formData.get('name'),
          email: formData.get('email'),
          subject: formData.get('subject'),
          comment: formData.get('comment'),
          file_path: filePath,
          deletion_password: formData.get('password')
        }])
  
      if (postError) throw postError
  
      toast({
        title: "Post created",
        description: "Your message has been posted successfully.",
      })
  
      // Reset form correctly
      form.reset()
      // Optionally force a page refresh
      router.refresh()
    } catch (error) {
      console.error('Post creation error:', error) // Add this for debugging
      toast({
        variant: "destructive",
        title: "Error creating post",
        description: error instanceof Error ? error.message : "Failed to create post",
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="max-w-7xl mx-auto">
    <div className="max-w-lg mx-auto p-4">
    <div className='absolute right-3 top-3 mb-6'>
    <Link href="/">
        <Button className='border bg-darkblue2 border-zinc-800 py-1 px-4 rounded-md text-[#DDDDDD] hover:text-[#DDDDDD] hover:italic font-inter mx-auto'>
            
                back to Home
            
        </Button>
        </Link>
        </div>
      <div className="mb-8 mx-auto mt-5">
        
      <h1 className="w-full text-2xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl font-inter tracking-tight text-white text-center mb-4">
                <span className='font-english'>g</span><span className='font-lumen'>o</span><span className='font-inter'>a</span><span className='font-inria'>t</span><span className='font-bookish'>s</span><span className='font-lumen'>e</span><span className='font-lumen'> singularity</span>
              </h1>
        <h1 className="text-2xl font-inter text-[#DDDDDD] mb-2 mx-auto">/g/ - Goatse Singularity Board</h1>
        <p className="text-sm font-inter mx-auto">Enter the Goatse Singularity.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-[100px,1fr] gap-2 items-center">
          <label className="bg-[#DDDDDD] text-darkblue3 p-2 text-sm rounded-md font-inter">Name</label>
          <Input 
            type="text" 
            name="name" 
            required 
            className="max-w-md font-inter bg-darkblue2 border-zinc-800 rounded-md"
          />
        </div>

        <div className="grid grid-cols-[100px,1fr] gap-2 items-center">
          <label className="bg-[#DDDDDD] rounded-md text-darkblue3 p-2 text-sm font-inter">Subject</label>
          <div className="flex gap-2 items-center max-w-md">
            <Input type="text" name="subject" className='font-inter bg-darkblue2 border-zinc-800 rounded-md' />
            <Button type="button" variant="outline" size="sm" className='rounded-md text-darkblue3 font-inter'>
              New Topic
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-[100px,1fr] gap-2 items-start">
          <label className="bg-[#DDDDDD] text-darkblue3 p-2 text-sm font-inter rounded-md">Comment</label>
          <Textarea 
            name="comment" 
            required
            className="min-h-[100px] font-inter resize-none rounded-md bg-darkblue2 border-zinc-800"
          />
        </div>

        <div className="grid grid-cols-[100px,1fr] gap-2 items-center">
          <label className="bg-[#DDDDDD] rounded-md text-darkblue3 p-2 text-sm font-inter">File</label>
          <Input 
            type="file" 
            name="file"
            className="max-w-md font-inter bg-darkblue2 border-zinc-800 rounded-md hover:cursor-pointer"
            accept="image/*" // Add this to restrict to images only
            onChange={(e) => {
                // Optional: Add client-side file validation
                const file = e.target.files?.[0]
                if (file) {
                try {
                    validateFile(file)
                } catch (error) {
                    toast({
                    variant: "destructive",
                    title: "Invalid file",
                    description: error instanceof Error ? error.message : "File validation failed",
                    })
                    e.target.value = '' // Reset file input on error
                }
                }
            }}
          />
        </div>

        <div className="grid grid-cols-[100px,1fr] gap-2 items-center">
          <label className="bg-[#DDDDDD] rounded-md text-darkblue3 p-2 text-sm font-inter">Password</label>
          <div className="flex gap-2 items-center max-w-md">
            <Input 
              type="password" 
              name="password"
              placeholder='N)L$Ko$r'
              required
              className="max-w-[200px] font-inter bg-darkblue2 rounded-md border-zinc-800 placeholder:text-gray-500"
            />
            <span className="text-sm text-gray-500 font-inter">(For file deletion.)</span>
          </div>
        </div>

        <Button 
          type="submit" 
          className="ml-[108px] bg-[#DDDDDD] text-darkblue3 hover:italic rounded-md py-1 px-6 font-inter"
          disabled={uploading}
        >
          {uploading ? 'Posting...' : 'Post'}
        </Button>
      </form>
      </div>
      <PostList />
    </main>
  )
}