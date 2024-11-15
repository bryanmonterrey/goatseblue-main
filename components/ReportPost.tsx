// components/ReportPost.tsx
'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"

interface ReportPostProps {
  postId: number
}

export function ReportPost({ postId }: ReportPostProps) {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    if (!reason.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please provide a reason for reporting.",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch(`/api/posts/${postId}/report`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit report')
      }

      toast({
        title: "Report submitted",
        description: "Thank you for reporting. Moderators will review this post.",
      })
      
      setIsOpen(false)
      setReason('')
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit report",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-2 bg-transparent border hover:text-white hover:bg-transparent border-white text-white rounded-none">
          Report Post
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='font-inter'>Report Post</DialogTitle>
        </DialogHeader>
        <Card className='bg-transparent border-none'>
          <CardHeader>
            <CardTitle className="text-sm text-white font-inter">Why are you reporting this post?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Textarea
                placeholder="Please provide details about why this post should be reviewed..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="min-h-[100px] rounded-none border-white resize-none font-inter placeholder:font-inter placeholder:text-white text-white"
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                  disabled={isSubmitting}
                  className='px-2 rounded-none font-inter '
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !reason.trim()}
                  className='px-2 rounded-none text-black bg-white font-inter '
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  )
}