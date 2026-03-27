import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAdmin } from '@/app/context/AdminContext'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'

export function AdminLoginPage() {
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAdmin()
  const navigate = useNavigate()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (!email) {
      setError('Email is required')
      return
    }

    if (!password) {
      setError('Password is required')
      return
    }

    setIsLoading(true)
    try {
      console.log('Starting login process...')
      await login(email, password)
      console.log('Login successful, redirecting...')
      toast.success('Login successful!')
      navigate('/admin')
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Login failed. Please check your email and password.'
      console.error('Login error:', errorMsg)
      setError(errorMsg)
      toast.error(errorMsg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#4FC3F7] to-[#87CEEB] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Kode<span className="text-[#4FC3F7]">Murah</span>
          </h1>
          <p className="text-gray-600 text-lg">Admin Portal</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Admin Email
            </label>
            <Input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value)
                setError('')
              }}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Password
            </label>
            <Input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value)
                setError('')
              }}
              disabled={isLoading}
              className="w-full"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#4FC3F7] hover:bg-[#87CEEB] text-white h-11 font-semibold"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-gray-600 text-sm text-center mb-4">
            <span className="font-semibold">Demo Account:</span>
          </p>
          <div className="bg-blue-50 rounded-lg p-4 text-sm space-y-2">
            <p className="text-gray-700">
              <span className="font-semibold">Email:</span> admin@example.com
            </p>
            <p className="text-gray-700">
              <span className="font-semibold">Password:</span> admin123
            </p>
          </div>
          <p className="text-gray-500 text-xs text-center mt-4">
            Only registered administrators with correct credentials can access this portal.
          </p>
        </div>
      </div>
    </div>
  )
}
