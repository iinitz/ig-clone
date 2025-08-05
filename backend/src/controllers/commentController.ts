import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createComment = async (req: Request, res: Response) => {
  try {
    const { content, parentId } = req.body;
    const { postId } = req.params;
    const newComment = await prisma.comment.create({
      data: {
        content,
        postId: parseInt(postId),
        authorId: (req as any).user.userId,
        parentId: parentId ? parseInt(parentId) : null,
      },
      include: {
        author: true,
      },
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCommentsByPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(postId), parentId: null }, // Only fetch top-level comments initially
      include: {
        author: true,
        replies: {
          include: {
            author: true,
            replies: {
              include: {
                author: true,
                // You can continue nesting includes for deeper replies if needed
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
