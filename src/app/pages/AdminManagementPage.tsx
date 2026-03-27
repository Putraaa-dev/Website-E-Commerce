import { useEffect, useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { toast } from 'sonner'
import { Plus, Trash2, Eye, EyeOff, Lock, Copy, Check } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog'
import { API_BASE } from '@/app/utils/api'

export function AdminManagementPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isChangePassOpen, setIsChangePassOpen] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '' })
  const [changePassData, setChangePassData] = useState({ adminId: '', adminEmail: '', newPassword: '' })
  const [isLoading, setIsLoading] = useState(false)

  // Fetch all admins
  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const res = await fetch(`${API_BASE}/admins`, { method: 'GET' })
      if (!res.ok) throw new Error('Failed to fetch admins')
      const data = await res.json()
      const adminsWithVisibility = data.map((admin: any) => ({
        ...admin,
        showPassword: !!admin.lastPassword
      }))
      setAdmins(adminsWithVisibility)
    } catch (err) {
      toast.error('Failed to load admins')
      console.error(err)
    }
  }

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error('All fields are required')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/admins`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: 'admin'
        })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to add admin')
      }

      const newAdmin = await res.json()
      const adminData = newAdmin.admin || newAdmin
      
      adminData.showPassword = true
      setAdmins([...admins, adminData])
      setFormData({ name: '', email: '', password: '' })
      setIsFormOpen(false)
      toast.success('Admin created! Copy password sebelum ditutup!')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create admin'
      toast.error(msg)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = (adminId: string) => {
    setAdmins(admins.map(a =>
      a._id === adminId ? { ...a, showPassword: !a.showPassword } : a
    ))
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!changePassData.newPassword || changePassData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${API_BASE}/admins/${changePassData.adminId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: changePassData.newPassword })
      })

      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.message || 'Failed to change password')
      }

      // Update admin dengan password baru (temporary display)
      setAdmins(admins.map(a => 
        a._id === changePassData.adminId 
          ? { ...a, lastPassword: changePassData.newPassword, showPassword: true }
          : a
      ))
      
      setChangePassData({ adminId: '', adminEmail: '', newPassword: '' })
      setIsChangePassOpen(false)
      toast.success('Password changed! Copy password sebelum ditutup!')
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to change password'
      toast.error(msg)
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleDeleteAdmin = async (id: string, email: string) => {
    if (email === 'admin@example.com') {
      toast.error('Cannot delete default admin')
      return
    }

    if (!window.confirm(`Delete admin ${email}?`)) return

    try {
      const res = await fetch(`${API_BASE}/admins/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete admin')
      
      setAdmins(admins.filter(a => a._id !== id))
      toast.success('Admin deleted')
    } catch (err) {
      toast.error('Failed to delete admin')
      console.error(err)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Admin Management</h1>
          <p className="text-gray-600 mt-2">Manage and administer user accounts</p>
        </div>
        <Button 
          onClick={() => setIsFormOpen(true)}
          className="bg-gradient-to-r from-[#4FC3F7] to-[#87CEEB] hover:from-[#2BB5D9] hover:to-[#4FC3F7] text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-lg px-6 py-3"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Admin User
        </Button>
      </div>

      {/* Add Admin Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Admin User</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleAddAdmin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <Input
                type="text"
                placeholder="Admin name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <Input
                type="email"
                placeholder="admin@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-[#4FC3F7] to-[#87CEEB] text-white hover:from-[#2BB5D9] hover:to-[#4FC3F7] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {isLoading ? 'Creating...' : 'Create Admin'}
              </Button>
            </DialogFooter>
          </form>

          {/* Show temporary password after creation */}
          {formData.password && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Password Baru (Copy sekarang!):</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white p-2 rounded border border-yellow-300 text-sm font-mono">
                  {formData.password}
                </code>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => copyToClipboard(formData.password, 'new')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {copiedId === 'new' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-yellow-700 mt-2">Simpan password ini, tidak akan ditampilkan lagi!</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Password Dialog */}
      <Dialog open={isChangePassOpen} onOpenChange={setIsChangePassOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-gray-700">
                Admin: <span className="text-[#4FC3F7]">{changePassData.adminEmail}</span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min 6 characters"
                  value={changePassData.newPassword}
                  onChange={(e) => setChangePassData({ ...changePassData, newPassword: e.target.value })}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button type="button" variant="outline" onClick={() => setIsChangePassOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} className="bg-gradient-to-r from-[#4FC3F7] to-[#87CEEB] text-white hover:from-[#2BB5D9] hover:to-[#4FC3F7] shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {isLoading ? 'Changing...' : 'Change Password'}
              </Button>
            </DialogFooter>
          </form>

          {/* Show temporary password after change */}
          {changePassData.newPassword && (
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Password Baru (Copy sekarang!):</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white p-2 rounded border border-yellow-300 text-sm font-mono">
                  {changePassData.newPassword}
                </code>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => copyToClipboard(changePassData.newPassword, 'change')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white"
                >
                  {copiedId === 'change' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
              <p className="text-xs text-yellow-700 mt-2">Simpan password ini, tidak akan ditampilkan lagi!</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Admins Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#F0F8FF] to-[#E8F4F8] border-b border-gray-100">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Created At</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin, idx) => (
              <tr key={admin._id} className="border-t border-gray-100 hover:bg-gray-50 transition-colors duration-200 border-l-4 border-transparent hover:border-l-[#4FC3F7]" style={{animation: `slideIn 0.3s ease-out ${idx * 0.05}s backwards`}}>
                <td className="px-6 py-4 text-gray-800 font-medium">{admin.name}</td>
                <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                <td className="px-6 py-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold bg-gradient-to-r from-[#4FC3F7] to-[#87CEEB] text-white rounded-lg">
                    {admin.role || 'admin'}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600 text-sm">
                  {new Date(admin.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                      {admin.lastPassword && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => togglePasswordVisibility(admin._id)}
                            className="border-gray-300 text-gray-600 hover:bg-gray-100 transition-colors duration-200 rounded-lg"
                          >
                            {admin.showPassword ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                          </Button>
                          {admin.showPassword && (
                            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded-lg text-xs border border-blue-300 shadow-sm">
                              <code className="font-mono text-blue-900">{admin.lastPassword}</code>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => copyToClipboard(admin.lastPassword, admin._id)}
                                className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                              >
                                {copiedId === admin._id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                              </Button>
                            </div>
                          )}
                        </>
                      )}
                    <Button
                      size="sm"
                      variant="outline"
                        onClick={() => {
                          setChangePassData({ adminId: admin._id, adminEmail: admin.email, newPassword: '' })
                          setIsChangePassOpen(true)
                        }}
                      className="border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white transition-all duration-200 rounded-lg"
                    >
                      <Lock className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDeleteAdmin(admin._id, admin.email)}
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-200 rounded-lg"
                      disabled={admin.email === 'admin@example.com'}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {admins.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No admin users found
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300">
        <h3 className="font-semibold text-gray-800 mb-3 text-lg">Password Security</h3>
        <ul className="text-sm text-gray-700 space-y-2">
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> Passwords are hashed with bcrypt before storing in MongoDB</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> Minimum 6 characters required</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> Default admin cannot be deleted (admin@example.com)</li>
          <li className="flex items-center"><span className="text-green-500 mr-2">✅</span> Each admin needs unique email</li>
        </ul>
      </div>

      <style>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
