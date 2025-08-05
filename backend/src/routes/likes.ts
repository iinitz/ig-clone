import express from 'express';
import * as likeController from '../controllers/likeController';
import authMiddleware from '../middlewares/authMiddleware';

const router = express.Router({ mergeParams: true });

/**
 * @swagger
 * tags:
 *   name: Likes
 *   description: Like management
 */

/**
 * @swagger
 * /api/posts/{postId}/likes:
 *   post:
 *     summary: Toggle like on a post
 *     tags: [Likes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the post to like/unlike
 *     responses:
 *       200:
 *         description: Post unliked successfully
 *       201:
 *         description: Post liked successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, likeController.toggleLike);

export default router;