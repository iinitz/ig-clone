import express, { Express } from 'express';
import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import commentRoutes from './routes/comments';
import likeRoutes from './routes/likes';
import swaggerSetup from '../swagger';
import cors from 'cors';
import userRoutes from './routes/users';

const app: Express = express();

app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/posts/:postId/comments', commentRoutes);
app.use('/api/posts/:postId/likes', likeRoutes);
app.use('/api/users', userRoutes);

swaggerSetup(app);

export default app;
