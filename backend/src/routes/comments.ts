import express, { Request, Response, NextFunction } from 'express'
import * as commentController from '../controllers/commentController'
import authMiddleware from '../middlewares/authMiddleware'
import { validate, createCommentSchema } from '../middlewares/validation'

const router = express.Router({ mergeParams: true })

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management
 */

/**
 * @swagger
 * /api/posts/{postId}/comments:
 *   post:
 *     summary: Add a comment to a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post to comment on
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 *   get:
 *     summary: Get comments for a post
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post to get comments for
 *     responses:
 *       200:
 *         description: List of comments
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  authMiddleware,
  validate(createCommentSchema),
  commentController.createComment
)
router.get('/', commentController.getCommentsByPost)

export default router