import 'dotenv/config'
import express, { Express } from 'express'
import authRoutes from './src/routes/auth'
import postRoutes from './src/routes/posts'
import commentRoutes from './src/routes/comments'
import likeRoutes from './src/routes/likes'
import swaggerSetup from './swagger'

const app: Express = express()
const port = process.env.PORT || 3001

import cors from 'cors'

app.use(cors())
app.use('/uploads', express.static('uploads'))
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/posts/:postId/comments', commentRoutes)
app.use('/api/posts/:postId/likes', likeRoutes)

import userRoutes from './src/routes/users'

app.use('/api/users', userRoutes)

swaggerSetup(app)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
