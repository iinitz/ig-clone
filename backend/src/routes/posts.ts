import express, { Request, Response, NextFunction } from 'express'
import * as postController from '../controllers/postController'
import authMiddleware from '../middlewares/authMiddleware'
import multer from 'multer'
import { validate, createPostSchema } from '../middlewares/validation'

const upload = multer({ dest: 'uploads/' })
const router = express.Router()

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: Post management
 */

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: Create a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - image
 *             properties:
 *               caption:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *       400:
 *         description: Image is required or invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get all posts
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: List of posts
 *       500:
 *         description: Server error
 *
 * /api/posts/{id}:
 *   get:
 *     summary: Get a post by ID
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Post data
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  validate(createPostSchema),
  postController.createPost
)
router.get('/', postController.getAllPosts)
router.get('/:id', postController.getPostById)

export default router