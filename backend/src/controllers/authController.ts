import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const register = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body

    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: { username, email, password: hashedPassword },
    })

    res.status(201).json({ message: 'User registered successfully' })
  } catch (error) {
    res.status(500).json({ message: 'Server error' })
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    console.log('Login attempt received')
    const { email, password } = req.body
    console.log('Email:', email)

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, username: true, password: true, avatarUrl: true },
    })
    if (!user) {
      console.log('User not found for email:', email)
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    console.log('User found:', user.username)

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      console.log('Password mismatch for user:', user.username)
      return res.status(400).json({ message: 'Invalid credentials' })
    }
    console.log('Password matched for user:', user.username)

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, { expiresIn: '1h' })
    console.log('JWT token generated for user:', user.username)

    res.status(200).json({ token, username: user.username, userId: user.id, avatarUrl: user.avatarUrl })
  } catch (error) {
    
    res.status(500).json({ message: 'Server error' })
  }
}