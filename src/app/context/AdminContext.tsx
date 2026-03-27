import React, { createContext, useContext, useState, useEffect } from 'react'

const API_BASE = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:5000/api'

type AdminContextType = {
  isAdmin: boolean
  adminEmail: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AdminContext = createContext<AdminContextType | undefined>(undefined)

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminEmail, setAdminEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if admin is already logged in (from localStorage)
  useEffect(() => {
    const savedEmail = localStorage.getItem('adminEmail')
    if (savedEmail) {
      setAdminEmail(savedEmail)
      setIsAdmin(true)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting admin login with:', email)
      
      // Verify email + password via /verify endpoint
      const response = await fetch(`${API_BASE}/admins/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Login failed')
      }
      
      const data = await response.json()
      
      // Store admin email in localStorage
      localStorage.setItem('adminEmail', email)
      setAdminEmail(email)
      setIsAdmin(true)
      console.log('Admin login successful')
    } catch (err) {
      console.error('Login error:', err)
      throw new Error(err instanceof Error ? err.message : 'Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('adminEmail')
    setAdminEmail(null)
    setIsAdmin(false)
    console.log('Admin logged out')
  }

  return (
    <AdminContext.Provider value={{ isAdmin, adminEmail, login, logout, isLoading }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
