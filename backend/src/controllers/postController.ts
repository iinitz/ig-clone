import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'


const prisma = new PrismaClient()

export const createPost = async (req: Request, res: Response) => {
  try {
    const { caption } = req.body
    const imageFile = req.file

    if (!imageFile) {
      return res.status(400).json({ message: 'Image is required' })
    }

    const uploadsDir = path.join(__dirname, '..', '..', 'uploads')
    await fs.mkdir(uploadsDir, { recursive: true })

    const filename = `${imageFile.filename}.webp`
    const outputPath = path.join(uploadsDir, filename)

    await sharp(imageFile.path)
      .resize(800) // Resize image to a max width of 800px
      .webp({ quality: 80 }) // Convert to WebP and set quality
      .toFile(outputPath)

    // Remove the original uploaded file
    await fs.unlink(imageFile.path)

    const imageUrl = `uploads/${filename}`

    const newPost = await prisma.post.create({
      data: { caption, imageUrl, authorId: (req as any).user.userId },
    })
    res.status(201).json(newPost)
  } catch (error) {
    console.error('Error creating post:', error)
    res.status(500).json({ message: 'Server error' })
  }
}

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({ include: { author: { select: { id: true, username: true, avatarUrl: true } }, likes: true, comments: { select: { id: true, content: true, author: { select: { username: true, avatarUrl: true } } } } } })
    res.status(200).json(posts)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { likes: true, author: { select: { id: true, username: true, avatarUrl: true } }, comments: { include: { author: { select: { username: true, avatarUrl: true } } }, orderBy: { createdAt: 'asc' } } },
    })

    if (!post) {
      return res.status(404).json({ message: 'Post not found' })
    }

    res.status(200).json(post)
  } catch (error) {
    console.error('Error getting post by ID:', error)
    res.status(500).json({ message: 'Server error' })
  }
}
