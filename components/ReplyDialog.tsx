// components/ReplyDialog.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { v4 as uuidv4 } from 'uuid'
import { validateFile } from '@/utils/file-validation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { supabase } from '@/lib/supabase'

interface ReplyDialogProps {
  postId: number
  isOpen: boolean
  onClose: () => void
  onReplyCreated: () => void
}

export function ReplyDialog({ postId, isOpen, onClose, onReplyCreated }: ReplyDialogProps) {
  const { toast } = useToast()
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    try {
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
          setSubmitting(false)
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

      const { error } = await supabase
        .from('posts')
        .insert([{
          name: formData.get('name'),
          subject: formData.get('subject'),
          comment: formData.get('comment'),
          file_path: filePath,
          parent_id: postId,
          deletion_password: formData.get('password')
        }])

      if (error) throw error

      toast({
        title: "Reply posted",
        description: "Your reply has been posted successfully.",
      })

      form.reset()
      onReplyCreated()
      onClose()
    } catch (error) {
      console.error('Reply error:', error)
      toast({
        variant: "destructive",
        title: "Error posting reply",
        description: error instanceof Error ? error.message : "Failed to post reply",
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border border-white">
        <DialogHeader>
          <DialogTitle className="text-white font-inter">Reply to Post</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-[100px,1fr] gap-2 items-center">
            <label className="bg-white text-black p-2 text-sm font-inter rounded-none">Name</label>
            <Input

              type="text" 
              name="name" 
              required 
              className="max-w-md font-inter"
            />
          </div>

          <div className="grid grid-cols-[100px,1fr] gap-2 items-center">
            <label className="bg-white text-black p-2 text-sm font-inter">Subject</label>
            <Input 
              type="text" 
              name="subject" 
              className="max-w-md font-inter"
            />
          </div>

          <div className="grid grid-cols-[100px,1fr] gap-2 items-start">
            <label className="bg-white text-black p-2 text-sm font-inter">Comment</label>
            <Textarea 
              name="comment" 
              required
              className="min-h-[100px] font-inter"
            />
          </div>

          <div className="grid grid-cols-[100px,1fr] gap-2 items-center">
            <label className="bg-white text-black p-2 text-sm font-inter">File</label>
            <Input 
              type="file" 
              name="file"
              className="max-w-md font-inter"
              accept="image/*"
              onChange={(e) => {
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
                    e.target.value = ''
                  }
                }
              }}
            />
          </div>

          <div className="grid grid-cols-[100px,1fr] gap-2 items-center">
            <label className="bg-white text-black p-2 text-sm font-inter">Password</label>
            <div className="flex gap-2 items-center max-w-md">
              <Input 
                type="password" 
                name="password"
                required
                className="max-w-[200px] font-inter"
              />
              <span className="text-sm text-gray-500 font-inter">(For deletion.)</span>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline"
              onClick={onClose}
              className="border-white text-black font-inter rounded-none px-2"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={submitting}
              className="bg-white text-black font-inter rounded-none px-2"
            >
              {submitting ? 'Posting...' : 'Post Reply'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}