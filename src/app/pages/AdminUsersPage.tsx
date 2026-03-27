import { useEffect, useState } from 'react'
import { fetchAdmins, createAdmin } from '@/app/utils/api'
import { Input } from '@/app/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/app/components/ui/dialog'
import { toast } from 'sonner'

export function AdminUsersPage() {
  const [admins, setAdmins] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const data = await fetchAdmins()
        if (!mounted) return
        setAdmins(data)
      } catch (err) {
        // ignore
      }
    })()
    return () => { mounted = false }
  }, [])

  const handleCreate = async () => {
    if (!name || !email) return toast.error('Name and email required')
    try {
      const created = await createAdmin({ name, email })
      setAdmins((s) => [created, ...s])
      setIsOpen(false)
      setName('')
      setEmail('')
      toast.success('Admin created')
    } catch (err) {
      toast.error('Failed to create admin')
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl text-gray-800 font-bold">Admins Management</h1>
          <p className="text-gray-600 mt-2">Manage registered administrators</p>
        </div>
        <button onClick={() => setIsOpen(true)} className="px-6 py-3 bg-gradient-to-r from-[#4FC3F7] to-[#87CEEB] hover:from-[#2BB5D9] hover:to-[#4FC3F7] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">+ Add Admin</button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
        {admins.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <div className="text-5xl">👨‍💼</div>
            <p className="text-xl text-gray-600 font-semibold">No admins found</p>
            <p className="text-gray-500">Start by adding your first administrator</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            <div className="grid grid-cols-3 gap-4 bg-gradient-to-r from-[#F0F8FF] to-[#E8F4F8] px-6 py-4 font-semibold text-gray-700">
              <div>Name</div>
              <div>Email</div>
              <div>Role</div>
            </div>
            {admins.map((a, idx) => (
              <div key={a._id || a.id} className="grid grid-cols-3 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors duration-200 border-l-4 border-transparent hover:border-l-[#4FC3F7]" style={{animation: `slideIn 0.3s ease-out ${idx * 0.05}s backwards`}}>
                <div className="font-medium text-gray-800">{a.name}</div>
                <div className="text-gray-600">{a.email}</div>
                <div className="inline-block px-3 py-1 bg-gradient-to-r from-[#4FC3F7] to-[#87CEEB] text-white text-sm font-semibold rounded-lg w-fit">{a.role || 'admin'}</div>
              </div>
            ))}
          </div>
        )}
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

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">Add New Administrator</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Full Name</label>
              <Input placeholder="Enter admin name" value={name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)} className="h-10 border-2 border-gray-200 focus:border-[#4FC3F7] focus:ring-[#4FC3F7]/20" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Email Address</label>
              <Input placeholder="Enter email" type="email" value={email} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} className="h-10 border-2 border-gray-200 focus:border-[#4FC3F7] focus:ring-[#4FC3F7]/20" />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <button onClick={() => setIsOpen(false)} className="px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors duration-200">Cancel</button>
            <button onClick={handleCreate} className="px-4 py-2 bg-gradient-to-r from-[#4FC3F7] to-[#87CEEB] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">Save Admin</button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
