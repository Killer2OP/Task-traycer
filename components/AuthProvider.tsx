'use client'

import { createContext, useContext, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Mock user for demo purposes
  const user: User = {
    id: '507f1f77bcf86cd799439011',
    email: 'demo@example.com',
    name: 'Demo User'
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - always return true
    return true
  }

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock register - always return true
    return true
  }

  const logout = () => {
    // Mock logout - no action needed
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading: false }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
