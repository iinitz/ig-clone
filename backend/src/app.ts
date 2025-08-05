import express, { Express } from 'express'
import authRoutes from './routes/auth'
import postRoutes from './routes/posts'
import commentRoutes from './routes/comments'
import likeRoutes from './routes/likes'
import swaggerSetup from '../swagger'
import cors from 'cors'
import userRoutes from './routes/users'
import { errorHandler } from './middlewares/errorHandler'

const app: Express = express()

const allowedOrigins = ['http://localhost:3000']

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}))
app.use('/uploads', express.static('uploads'))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/posts/:postId/comments', commentRoutes)
app.use('/api/posts/:postId/likes', likeRoutes)
app.use('/api/users', userRoutes)

swaggerSetup(app)

// Centralized error handling middleware
app.use(errorHandler)

export default app