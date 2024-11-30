// components/PostList.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Post } from '@/types/database.types'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DeletePost } from './DeletePost'
import { ReportPost } from './ReportPost'
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"
import Image from 'next/image'
import { ReplyDialog } from './ReplyDialog' // Make sure to create this file

const POSTS_PER_PAGE = 10

const ReplyContent = ({ reply, onDeleted }: { reply: Post; onDeleted: () => void }) => {
    return (
      <div className="ml-4 mt-2 p-2 mb-3 bg-white/20 border-l-2 border-white">
        {reply.file_path && (
          <div className="mb-2">
            <div className="text-xs text-gray-500 mb-1">
              File: {reply.file_path}
            </div>
          </div>
        )}
        <div className='flex columns-2 mb-3'>
          <div className='col-span-1'>
            {reply.file_path && (
              <Image 
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-attachments/${reply.file_path}`}
                alt="attachment"
                width={150}
                height={150}
                className="max-w-[200px] h-auto border border-white"
              />
            )}
          </div>
          <div className="inline-block gap-2 items-center mb-2 ml-3 col-span-1">
            <div className='mb-4 space-x-2'>
              <span className="text-white">{reply.subject || 'No Subject'}</span>
              <span className="text-white">by {reply.name}</span>
              <span className="text-gray-600">{new Date(reply.created_at).toLocaleString()}</span>
            </div>
            <div>
              <p className="whitespace-pre-wrap text-white mb-2">{reply.comment}</p>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center gap-2 w-full">
          <div>
            <DeletePost postId={reply.id} onDeleted={onDeleted} />
            <ReportPost postId={reply.id} />
          </div>
        </div>
      </div>
    );
  };

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [replyingTo, setReplyingTo] = useState<number | null>(null)

  const loadPosts = async (pageNumber = 0, append = false) => {
    try {
      const from = pageNumber * POSTS_PER_PAGE
      const to = from + POSTS_PER_PAGE - 1

      const { data, error, count } = await supabase
        .from('posts')
        .select(`
          *,
          replies:posts(*)
        `)
        .is('parent_id', null)
        .order('created_at', { ascending: true })
        .range(from, to)

      if (error) throw error

      if (append) {
        setPosts(current => [...current, ...(data || [])])
      } else {
        setPosts(data || [])
      }

      setHasMore(count ? from + data.length < count : false)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    loadPosts()
  }, [])

  const loadMore = async () => {
    setLoadingMore(true)
    const nextPage = page + 1
    setPage(nextPage)
    await loadPosts(nextPage, true)
  }

  const handleReply = (postId: number) => {
    setReplyingTo(postId)
  }

  if (loading) {
    return (
      <div className="space-y-4 mt-8">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="p-4 bg-transparent border rounded-none border-white">
            <div className="space-y-3">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-32 w-full" />
            </div>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4 mt-8 font-inter mb-5">
      {posts.map((post) => (
        <Card key={post.id} className="p-4 bg-transparent border border-white rounded-none font-inter">
          {post.file_path && (
            <div className="mb-2">
              <div className="text-xs text-gray-500 mb-1">
                File: {post.file_path}
              </div>
            </div>
          )}
          <div className='flex columns-2 mb-3 '>
            <div className='col-span-1'>
              {post.file_path && (
                <Image 
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/post-attachments/${post.file_path}`}
                  alt="attachment"
                  width={150}
                  height={150}
                  className="max-w-[200px] h-auto border border-white"
                />
              )}
            </div>
            <div className="inline-block gap-2 items-center mb-2 ml-3 col-span-1">
              <div className='mb-4 space-x-2'>
                <span className="text-white">{post.subject || 'No Subject'}</span>
                <span className="text-white">by {post.name}</span>
                <span className="text-gray-600">{new Date(post.created_at).toLocaleString()} PM</span>
              </div>
              <div>
                <p className="whitespace-pre-wrap text-white mb-2">{post.comment}</p>
              </div>
            </div>
          </div>

          {post.replies && post.replies.length > 0 && (
            <div className="mt-4">
                {post.replies.map((reply) => (
                <ReplyContent 
                    key={reply.id} 
                    reply={reply} 
                    onDeleted={() => loadPosts()}
                />
                ))}
            </div>
            )}

          <div className="flex justify-between items-center gap-2 w-full">
            <div>
              <DeletePost postId={post.id} onDeleted={() => loadPosts()} />
              <ReportPost postId={post.id} />
            </div>
            <div>
              <Button 
                variant="ghost" 
                className="text-white mr-5 hover:text-white rounded-none hover:bg-transparent p-0"
                onClick={() => handleReply(post.id)}
              >
                [Reply]
              </Button>
            </div>
          </div>
        </Card>
      ))}
      
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button 
            onClick={loadMore} 
            disabled={loadingMore}
            variant="outline"
            className="text-white border-white hover:bg-white/20 font-inter"
          >
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              'Load More Posts'
            )}
          </Button>
        </div>
      )}

      {/* Reply Dialog */}
      <ReplyDialog 
        postId={replyingTo!}
        isOpen={replyingTo !== null}
        onClose={() => setReplyingTo(null)}
        onReplyCreated={() => {
          loadPosts()
          setReplyingTo(null)
        }}
      />
    </div>
  )
}