import { useParams, Link } from 'react-router';
import { useEffect, useState } from 'react';
import { fetchProduct, API_BASE } from '@/app/utils/api';
import { useCart } from '@/app/context/CartContext';
import { Button } from '@/app/components/ui/button';
import { ArrowLeft, Download, ExternalLink, Check } from 'lucide-react';
import { toast } from 'sonner';

export function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      if (!id) return
      try {
        const p = await fetchProduct(id)
        if (!mounted) return
        if (!p) {
          setProduct(null)
        } else {
          setProduct({
            id: p._id || p.id,
            title: p.name || p.title,
            thumbnail: p.image ? `${API_BASE.replace(/\/api$/, '')}/uploads/${p.image}` : (p.thumbnail || ''),
            description: p.description || '',
            category: p.category || '',
            price: p.price || 0,
            downloads: p.downloads || 0,
            techSpecs: p.techSpecs || { language: '' },
            features: p.features || [],
            demoUrl: p.demoUrl || p.demo_url,
            ...p,
          })
        }
      } catch (err) {
        setProduct(null)
      }
    })()
    return () => { mounted = false }
  }, [id])

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl text-gray-800 mb-4">Product Not Found</h1>
          <Link to="/">
            <Button className="bg-[#4FC3F7] hover:bg-[#87CEEB] text-white">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-[#4FC3F7] mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </Link>

        {/* Product Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image */}
          <div className="space-y-4">
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
              <img
                src={product.thumbnail}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Additional Info */}
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Download className="w-4 h-4" />
                <span>{product.downloads} downloads</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="px-3 py-1 bg-[#F0F8FF] text-[#4FC3F7] rounded-full">
                  {product.category}
                </span>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl text-gray-800 mb-4">
                {product.title}
              </h1>
              <div className="text-3xl text-[#4FC3F7] mb-6">
                {formatPrice(product.price)}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                onClick={handleAddToCart}
                className="flex-1 h-12 bg-[#4FC3F7] hover:bg-[#87CEEB] text-white"
              >
                Buy Now
              </Button>
              {product.demoUrl && (
                <Button
                  variant="outline"
                  className="h-12 px-6 border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white"
                  asChild
                >
                  <a href={product.demoUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live Demo
                  </a>
                </Button>
              )}
            </div>

            {/* Tech Specs */}
            <div className="border border-gray-200 rounded-lg p-6 bg-[#F0F8FF]">
              <h3 className="text-xl text-gray-800 mb-4">
                Technical Specifications
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Language:</span>
                  <span className="text-gray-800">{product.techSpecs.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Database:</span>
                  <span className="text-gray-800">{product.techSpecs.database}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Framework:</span>
                  <span className="text-gray-800">{product.techSpecs.framework}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="text-gray-800">{product.techSpecs.version}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-xl text-gray-800 mb-3">
                Description
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl text-gray-800 mb-3">
                Features
              </h3>
              <ul className="space-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <Check className="w-5 h-5 text-[#4FC3F7] mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
