import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import { fetchProducts, API_BASE } from '@/app/utils/api';
import { ProductCard } from '@/app/components/ProductCard';
import { Input } from '@/app/components/ui/input';
import { Search, Filter } from 'lucide-react';
import { toast } from 'sonner';

export function ProductsListPage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>(categoryParam || 'all');
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const categories = ['all', 'Web', 'Android', 'UI/UX', 'Machine Learning', 'Data Science'];

  const filteredProducts = products.filter((product) => {
    const title = (product.title || product.name || '').toLowerCase()
    const description = (product.description || '').toLowerCase()
    const matchesSearch = title.includes(searchQuery.toLowerCase()) || description.includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory

    return matchesSearch && matchesCategory
  });

  function mapBackendProduct(p: any) {
    return {
      id: p._id || p.id,
      title: p.name || p.title,
      thumbnail: p.image ? `${API_BASE.replace(/\/api$/, '')}/uploads/${p.image}` : (p.thumbnail || ''),
      description: p.description || '',
      category: p.category || '',
      price: p.price || 0,
      downloads: p.downloads || 0,
      techSpecs: p.techSpecs || { language: '' },
      ...p,
    }
  }

  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        setIsLoading(true)
        const data = await fetchProducts()
        if (!mounted) return
        setProducts(data.map(mapBackendProduct))
      } catch (err) {
        toast.error('Failed to load products')
      } finally {
        if (mounted) setIsLoading(false)
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8FBFF] to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Header */}
        <div className="space-y-3 animate-fade-in">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 to-[#4FC3F7] bg-clip-text text-transparent">All Products</h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Browse our complete collection of source codes, templates, and scripts for your next project
          </p>
        </div>

        {/* Filters Card */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 space-y-6">
          {/* Search */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#4FC3F7] w-5 h-5" />
            <Input
              type="text"
              placeholder="Search products by name, description, or technology..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 text-lg border-2 border-gray-200 rounded-xl focus:border-[#4FC3F7] focus:ring-4 focus:ring-[#4FC3F7]/20 transition-all duration-300 bg-gray-50 hover:bg-white"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-700 font-semibold">
              <Filter className="w-5 h-5 text-[#4FC3F7]" />
              Filter by Category
            </div>
            <div className="flex flex-wrap gap-3">
              {categories.map((category, idx) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#4FC3F7] to-[#87CEEB] text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-[#4FC3F7]'
                  }`}
                  style={{
                    animation: selectedCategory === category ? `pulse 2s infinite` : 'none'
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products Count Badge */}
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold text-gray-700">
            {isLoading ? (
              <span>Loading products...</span>
            ) : (
              <span>Found <span className="text-[#4FC3F7] font-bold">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}</span>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="flex justify-center items-center py-24">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-[#4FC3F7] rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-[#4FC3F7] rounded-full animate-bounce" style={{animationDelay: '0.2s'}} />
              <div className="w-3 h-3 bg-[#4FC3F7] rounded-full animate-bounce" style={{animationDelay: '0.4s'}} />
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <div key={product.id} style={{animation: `fadeInUp 0.5s ease-out ${idx * 0.1}s backwards`}}>
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 space-y-4">
            <div className="text-6xl">🔍</div>
            <p className="text-2xl font-semibold text-gray-800">No products found</p>
            <p className="text-lg text-gray-600">Try adjusting your search or category filters</p>
          </div>
        )}
      </div>

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

        .animate-fade-in {
          animation: fadeInUp 0.8s ease-out;
        }
      `}</style>
    </div>
  );
}
