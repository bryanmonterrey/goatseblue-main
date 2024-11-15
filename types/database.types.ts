// types/database.types.ts
export interface Post {
    id: number
    name: string
    email: string | null
    subject: string | null
    comment: string
    file_path: string | null
    deletion_password: string
    created_at: string
    parent_id?: number | null  // Add this for reply relationships
    replies?: Post[]           // Add this to store replies
  }
  
  export interface Report {
    id: number
    post_id: number
    reason: string
    status: 'pending' | 'reviewed' | 'dismissed'
    created_at: string
  }