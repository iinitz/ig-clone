import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { buildCommentTree } from './commentController'; // Import buildCommentTree

const prisma = new PrismaClient();

export const createPost = async (req: Request, res: Response) => {
  try {
    const { caption } = req.body;
    const imageUrl = req.file?.path;
    if (!imageUrl) {
      return res.status(400).json({ message: 'Image is required' });
    }
    const newPost = await prisma.post.create({
      data: { caption, imageUrl, authorId: (req as any).user.userId },
    });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({ include: { author: true, likes: true, comments: true } });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getPostById = async (req: Request, res: Response) => {
  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { likes: true, author: true }, // Remove comments include here
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Fetch all comments for this post and build the tree
    const comments = await prisma.comment.findMany({
      where: { postId: parseInt(req.params.id) },
      include: {
        author: true,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    const nestedComments = buildCommentTree(comments);

    // Assign the nested comments to the post object
    (post as any).comments = nestedComments;

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
