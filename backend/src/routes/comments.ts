import express from 'express';
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 content:
 *                   type: string
 *                   example: This is a great post!
 *                 authorId:
 *                   type: integer
 *                   example: 1
 *                 postId:
 *                   type: integer
 *                   example: 1
 *                 parentId:
 *                   type: integer
 *                   example: null
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
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   content:
 *                     type: string
 *                     example: This is a comment.
 *                   author:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: testuser
 *                   replies:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 2
 *                         content:
 *                           type: string
 *                           example: This is a reply.
 *                         author:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 2
 *                             username:
 *                               type: string
 *                               example: anotheruser
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, commentController.createComment);
router.get('/', commentController.getCommentsByPost);

export default router;