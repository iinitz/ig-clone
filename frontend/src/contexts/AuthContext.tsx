'use client'

import { createContext, useState, useContext, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  user: { token: string; username: string; userId: number } | null;
  login: (token: string, username: string, userId: number) => void;
  logout: () => void;
  isAuthReady: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ token: string; username: string; userId: number } | null>(null)
  const [isAuthReady, setIsAuthReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('token')
    const username = localStorage.getItem('username')
    const userId = localStorage.getItem('userId')
    if (token && username && userId) {
      setUser({ token, username, userId: parseInt(userId) })
    }
    setIsAuthReady(true)
  }, [])

  const login = (token: string, username: string, userId: number) => {
    localStorage.setItem('token', token)
    localStorage.setItem('username', username)
    localStorage.setItem('userId', userId.toString())
    setUser({ token, username, userId })
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('userId')
    setUser(null)
    router.push('/login') // Redirect to login page on logout
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthReady }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}