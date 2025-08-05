import { Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params
    const userId = (req as any).user.userId

    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId: parseInt(postId),
          userId: userId,
        },
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId: parseInt(postId),
            userId: userId,
          },
        },
      })
      res.status(200).json({ message: 'Post unliked successfully' })
    } else {
      const newLike = await prisma.like.create({
        data: { postId: parseInt(postId), userId: userId },
      })
      res.status(201).json(newLike)
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}
