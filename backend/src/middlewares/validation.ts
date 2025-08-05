import { Request, Response, NextFunction } from 'express'
import { z, ZodSchema } from 'zod'

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
  try {
    schema.parse(req.body)
    next()
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: JSON.parse(JSON.stringify(error)).errors })
    }
    next(error)
  }
}

// Auth Schemas
export const registerSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
})

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

// Comment Schema
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment content is required'),
})

// Post Schema
export const createPostSchema = z.object({
  caption: z.string().optional(),
})
