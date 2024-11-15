// components/DeletePost.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from '@/lib/supabase'

interface DeletePostProps {
  postId: number
  onDeleted: () => void
}

export function DeletePost({ postId, onDeleted }: DeletePostProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [password, setPassword] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!password) return

    setIsDeleting(true)
    try {
      // First verify the password
      const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('deletion_password, file_path')
        .eq('id', postId)
        .single()

      if (fetchError || !post) {
        throw new Error('Post not found')
      }

      if (post.deletion_password !== password) {
        throw new Error('Invalid password')
      }

      // Delete the file if it exists
      if (post.file_path) {
        await supabase.storage
          .from('post-attachments')
          .remove([post.file_path])
      }

      // Delete any replies first if it's a main post
      const { error: replyDeleteError } = await supabase
        .from('posts')
        .delete()
        .eq('parent_id', postId)

      if (replyDeleteError) throw replyDeleteError

      // Delete the post
      const { error: deleteError } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (deleteError) throw deleteError

      toast({
        title: "Post deleted successfully",
        description: "The post and any attached files have been removed.",
      })
      
      setIsOpen(false)
      onDeleted()
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error deleting post",
        description: error instanceof Error ? error.message : "Please check your password and try again.",
      })
    } finally {
      setIsDeleting(false)
      setPassword('')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className='bg-transparent border hover:text-azul hover:bg-transparent border-azul text-white rounded-none'
        >
          Delete Post
        </Button>
      </DialogTrigger>
      <DialogContent className='rounded-none'>
        <DialogHeader>
          <DialogTitle className='text-white font-goatse'>Delete Post</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter deletion password"
              className='text-white font-goatse placeholder:text-white border-azul'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button 
            onClick={handleDelete}
            disabled={isDeleting || !password}
            className='font-goatse w-fit px-2 mx-auto bg-white rounded-none text-black hover:italic'
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}