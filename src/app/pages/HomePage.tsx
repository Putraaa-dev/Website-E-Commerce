import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, Globe, Smartphone, Palette, Brain, Shield, ArrowRight } from 'lucide-react';
import { fetchProducts, API_BASE } from '@/app/utils/api';
import { ProductCard } from '@/app/components/ProductCard';
import { Input } from '@/app/components/ui/input';
import { toast } from 'sonner';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const categories = [
    { id: 'web', name: 'Web', icon: Globe, color: '#4FC3F7' },
    { id: 'android', name: 'Android', icon: Smartphone, color: '#4FC3F7' },
    { id: 'uiux', name: 'UI/UX', icon: Palette, color: '#4FC3F7' },
    { id: 'ml', name: 'Machine Learning', icon: Brain, color: '#4FC3F7' },
  ];

  // Load products from backend
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchProducts();
        if (!mounted) return;
        
        const mapped = data.map((p: any) => ({
          id: p._id || p.id,
          title: p.name || p.title,
          thumbnail: p.image ? `${API_BASE.replace(/\/api$/, '')}/uploads/${p.image}` : (p.thumbnail || ''),
          description: p.description || '',
          category: p.category || '',
          price: p.price || 0,
          downloads: p.downloads || 0,
          techSpecs: p.techSpecs || { language: '' },
          ...p,
        }));
        
        setProducts(mapped);
        setFilteredProducts(mapped);
      } catch (err) {
        console.error('Failed to load products:', err);
        toast.error('Failed to load products');
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => { mounted = false };
  }, []);

  // Handle search
  const handleSearch = () => {
    if (!searchQuery.trim()) {
      setFilteredProducts(products);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = products.filter((product) =>
      (product.title || '').toLowerCase().includes(query) ||
      (product.description || '').toLowerCase().includes(query) ||
      (product.category || '').toLowerCase().includes(query) ||
      (product.techSpecs?.language || '').toLowerCase().includes(query)
    );
    
    setFilteredProducts(results);
    
    if (results.length === 0) {
      toast.info('No products found matching your search');
    } else {
      toast.success(`Found ${results.length} product(s)`);
    }
  };

  // Handle enter key in search input
  const handleSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-[#F8FBFF] to-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#F0F8FF] via-[#E8F4F8] to-white py-24 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#4FC3F7] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-8 right-1/4 w-96 h-96 bg-[#87CEEB] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Admin Portal Button */}
          <div className="flex justify-end mb-8 animate-fade-in-down">
            <button 
              onClick={() => navigate('/admin/login')}
              className="group inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-[#4FC3F7] text-[#4FC3F7] rounded-lg hover:bg-[#4FC3F7] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
            >
              <Shield className="w-4 h-4" />
              Admin Portal
            </button>
          </div>

          <div className="text-center space-y-8 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-gray-800 via-[#4FC3F7] to-gray-800 bg-clip-text text-transparent leading-tight">
              Find Affordable<br />Source Code
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Browse thousands of ready-made source codes, templates, and scripts for your next project. Fast, affordable, and developer-friendly.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto pt-8">
              <div className="relative flex items-center gap-3 group">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 group-hover:text-[#4FC3F7] transition-colors" />
                  <Input
                    type="text"
                    placeholder="Search for templates, scripts, or source code..."
                    value={searchQuery}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                    onKeyPress={handleSearchKeyPress}
                    className="pl-12 pr-4 h-16 text-lg border-2 border-gray-200 rounded-xl focus:border-[#4FC3F7] focus:ring-4 focus:ring-[#4FC3F7]/20 transition-all duration-300 bg-white shadow-lg hover:shadow-xl"
                  />
                </div>
                <button 
                  onClick={handleSearch}
                  className="h-16 px-10 bg-gradient-to-r from-[#4FC3F7] to-[#87CEEB] hover:from-[#2BB5D9] hover:to-[#4FC3F7] text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
                >
                  <Search className="w-5 h-5" />
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-16">
            Browse by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, idx) => {
              const Icon = category.icon;
              return (
                <Link
                  key={category.id}
                  to={`/products?category=${category.id}`}
                  className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#F0F8FF] to-[#E8F4F8] p-8 hover:from-[#4FC3F7] hover:to-[#87CEEB] transition-all duration-500 transform hover:-translate-y-2 hover:shadow-2xl cursor-pointer"
                  style={{
                    animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s backwards`
                  }}
                >
                  {/* Background decoration */}
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-300"></div>
                  
                  <div className="relative flex flex-col items-center justify-center text-center space-y-4 h-full">
                    <Icon className="w-16 h-16 text-[#4FC3F7] group-hover:text-white group-hover:scale-110 transition-all duration-300" />
                    <span className="text-xl font-semibold text-gray-800 group-hover:text-white transition-colors duration-300">
                      {category.name}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24 bg-gradient-to-b from-white to-[#F0F8FF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800">Featured Products</h2>
              <p className="text-gray-600 mt-2">Discover our handpicked selection</p>
            </div>
            <Link to="/products">
              <button className="group px-8 py-3 bg-gradient-to-r from-[#4FC3F7] to-[#87CEEB] hover:from-[#2BB5D9] hover:to-[#4FC3F7] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-white flex items-center gap-2">
                View All
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-flex gap-2">
                <div className="w-3 h-3 bg-[#4FC3F7] rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-[#4FC3F7] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                <div className="w-3 h-3 bg-[#4FC3F7] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
              </div>
              <p className="text-gray-500 mt-4">Loading products...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">
                {searchQuery ? 'No products found matching your search.' : 'No products available.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredProducts.slice(0, 8).map((product: any, idx: number) => (
                <div key={product.id} style={{animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s backwards`}}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-[#4FC3F7] via-[#87CEEB] to-[#4FC3F7] text-white relative overflow-hidden">
        {/* Background animation */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Ready to Build Something Amazing?
          </h2>
          <p className="text-xl md:text-2xl mb-12 opacity-95 max-w-3xl mx-auto leading-relaxed">
            Join thousands of developers who trust KodeMurah for their source code needs.
          </p>
          <Link to="/products">
            <button className="group inline-flex items-center gap-3 px-12 py-4 h-16 text-xl font-semibold bg-white text-[#4FC3F7] rounded-xl shadow-2xl hover:shadow-3xl hover:scale-105 transition-all duration-300 transform">
              Explore Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </div>
      </section>

      {/* CSS Keyframes for animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out;
        }

        .animate-fade-in-down {
          animation: fadeInDown 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
