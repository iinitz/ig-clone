import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const createComment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body
    const { postId } = req.params
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId),
        authorId: (req as any).user.userId,
      },
      include: {
        author: { select: { username: true, avatarUrl: true } },
      },
    })
    res.status(201).json(newComment)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId) }, // Fetch all comments for the post
      include: {
        author: { select: { username: true, avatarUrl: true } },
      },
      orderBy: {
        createdAt: 'asc',
      },
    })

    res.status(200).json(comments)
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}