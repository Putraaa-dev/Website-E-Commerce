import { ProtectedAdminRoute } from '@/app/components/ProtectedAdminRoute'
import { AdminHome } from '@/app/pages/AdminDashboard'

export function ProtectedAdminHome() {
  return (
    <ProtectedAdminRoute>
      <AdminHome />
    </ProtectedAdminRoute>
  )
}
