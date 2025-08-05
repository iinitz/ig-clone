import express from 'express';
import { body, validationResult } from 'express-validator';
import * as commentController from '../controllers/commentController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router({ mergeParams: true });

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
 *               parentId:
 *                 type: integer
 *                 description: ID of the parent comment (optional, for replies)
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
  [
    body('content').notEmpty().withMessage('Comment content is required'),
    body('parentId').optional().isInt().withMessage('Parent ID must be an integer'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  commentController.createComment
);
router.get('/', commentController.getCommentsByPost);

export default router;
