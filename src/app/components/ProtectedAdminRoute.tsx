import { Navigate } from 'react-router'
import { useAdmin } from '@/app/context/AdminContext'

type Props = {
  children: React.ReactNode
}

export function ProtectedAdminRoute({ children }: Props) {
  const { isAdmin, isLoading } = useAdmin()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}
