import express from 'express';
import * as postController from '../controllers/postController';
import authMiddleware from '../middlewares/authMiddleware';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 imageUrl:
 *                   type: string
 *                   example: /uploads/12345.jpg
 *                 caption:
 *                   type: string
 *                   example: My first post!
 *                 authorId:
 *                   type: integer
 *                   example: 1
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
 *                   imageUrl:
 *                     type: string
 *                     example: /uploads/12345.jpg
 *                   caption:
 *                     type: string
 *                     example: My first post!
 *                   author:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       username:
 *                         type: string
 *                         example: testuser
 *                   likes:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         userId:
 *                           type: integer
 *                           example: 1
 *                   comments:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: integer
 *                           example: 1
 *                         content:
 *                           type: string
 *                           example: This is a comment.
 *                         author:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: integer
 *                               example: 1
 *                             username:
 *                               type: string
 *                               example: testuser
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 imageUrl:
 *                   type: string
 *                   example: /uploads/12345.jpg
 *                 caption:
 *                   type: string
 *                   example: My first post!
 *                 author:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     username:
 *                       type: string
 *                       example: testuser
 *                 likes:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       userId:
 *                         type: integer
 *                         example: 1
 *                 comments:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       content:
 *                         type: string
 *                         example: This is a comment.
 *                       author:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 1
 *                           username:
 *                             type: string
 *                             example: testuser
 *       404:
 *         description: Post not found
 *       500:
 *         description: Server error
 */
router.post('/', authMiddleware, upload.single('image'), postController.createPost);
router.get('/', postController.getAllPosts);
router.get('/:id', postController.getPostById);

export default router;
