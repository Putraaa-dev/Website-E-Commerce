import { Link, Outlet, useLocation, useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Package, Users, Code2, LogOut, Settings } from 'lucide-react';
import { useAdmin } from '@/app/context/AdminContext';
import { Button } from '@/app/components/ui/button';

export function AdminDashboard() {
  const location = useLocation();
  const { logout, adminEmail } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navigation = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Users', path: '/admin/users', icon: Users },
    { name: 'Admins', path: '/admin/management', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#F0F8FF]">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-2 mb-8">
              <Code2 className="w-8 h-8 text-[#4FC3F7]" />
              <span className="text-xl text-gray-800">
                Kode<span className="text-[#4FC3F7]">Murah</span>
              </span>
            </Link>

            <nav className="space-y-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive(item.path)
                        ? 'bg-[#4FC3F7] text-white'
                        : 'text-gray-600 hover:bg-[#F0F8FF] hover:text-[#4FC3F7]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Logout Section */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-4 px-4">{adminEmail}</div>
              <Button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white flex items-center gap-2"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export function AdminHome() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalAdmins: 0,
    totalDownloads: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [productsRes, adminsRes] = await Promise.all([
          fetch('http://localhost:5000/api/products'),
          fetch('http://localhost:5000/api/admins')
        ])
        
        if (productsRes.ok && adminsRes.ok) {
          const products = await productsRes.json()
          const admins = await adminsRes.json()
          
          const totalDownloads = products.reduce((sum: number, p: any) => sum + (p.downloads || 0), 0)
          
          setStats({
            totalProducts: products.length,
            totalAdmins: admins.length,
            totalDownloads
          })
        }
      } catch (err) {
        console.error('Failed to fetch stats:', err)
      }
    }
    
    fetchStats()
  }, [])

  return (
    <div>
      <h1 className="text-4xl text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Welcome to KodeMurah Admin Panel</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-semibold">Total Products</h3>
            <Package className="w-8 h-8 text-[#4FC3F7]" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{stats.totalProducts}</div>
          <p className="text-xs text-gray-500 mt-2">Active products</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-semibold">Total Downloads</h3>
            <LayoutDashboard className="w-8 h-8 text-[#4FC3F7]" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{stats.totalDownloads.toLocaleString()}</div>
          <p className="text-xs text-gray-500 mt-2">All time downloads</p>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-600 font-semibold">Admin Users</h3>
            <Users className="w-8 h-8 text-[#4FC3F7]" />
          </div>
          <div className="text-3xl font-bold text-gray-800">{stats.totalAdmins}</div>
          <p className="text-xs text-gray-500 mt-2">System administrators</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              to="/admin/products"
              className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <span className="text-gray-800 font-medium">Manage Products</span>
              <Package className="w-5 h-5 text-[#4FC3F7]" />
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center justify-between px-4 py-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
            >
              <span className="text-gray-800 font-medium">Manage Users</span>
              <Users className="w-5 h-5 text-[#4FC3F7]" />
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About KodeMurah</h2>
          <p className="text-gray-600 leading-relaxed">
            KodeMurah is a premium platform for buying and selling source code and digital products. Manage your inventory, track analytics, and grow your business with our powerful admin dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
