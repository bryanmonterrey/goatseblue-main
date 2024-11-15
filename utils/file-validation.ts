// utils/file-validation.ts
export const ALLOWED_FILE_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ]
  
  export const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
  
  export function validateFile(file: File) {
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      throw new Error('Invalid file type. Only JPEG, PNG, GIF and WEBP images are allowed.')
    }
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('File is too large. Maximum size is 5MB.')
    }
    return true
  }