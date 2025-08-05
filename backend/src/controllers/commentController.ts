import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to build a nested comment tree
export const buildCommentTree = (comments: any[], parentId: number | null = null) => {
  const commentTree: any[] = [];
  comments.forEach(comment => {
    if (comment.parentId === parentId) {
      const replies = buildCommentTree(comments, comment.id);
      if (replies.length > 0) {
        comment.replies = replies;
      }
      commentTree.push(comment);
    }
  });
  return commentTree;
};

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
      where: { postId: parseInt(postId) }, // Fetch all comments for the post
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const nestedComments = buildCommentTree(comments);
    res.status(200).json(nestedComments);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
