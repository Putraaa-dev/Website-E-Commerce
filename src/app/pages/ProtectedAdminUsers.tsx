import { ProtectedAdminRoute } from '@/app/components/ProtectedAdminRoute'
import { AdminUsersPage } from '@/app/pages/AdminUsersPage'

export function ProtectedAdminUsers() {
  return (
    <ProtectedAdminRoute>
      <AdminUsersPage />
    </ProtectedAdminRoute>
  )
}
