import { Link } from 'react-router';
import { Product } from '@/app/data/mockData';
import { Download, ArrowRight } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:border-[#4FC3F7] transition-all duration-300 transform hover:-translate-y-2">
      {/* Thumbnail */}
      <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-50 relative">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-gradient-to-r from-[#4FC3F7] to-[#87CEEB] text-white rounded-full shadow-md">
            {product.category}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded-full">
            <Download className="w-3 h-3" />
            <span>{product.downloads}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-gray-800 line-clamp-2 group-hover:text-[#4FC3F7] transition-colors duration-300">
          {product.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        {/* Tech Spec */}
        {product.techSpecs?.language && (
          <div className="text-xs text-gray-500 bg-gray-50 px-2 py-1 rounded inline-block">
            {product.techSpecs.language}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="text-2xl font-bold text-[#4FC3F7]">
            {formatPrice(product.price).split(',')[0]}
          </div>

          <Link to={`/product/${product.id}`}>
            <Button className="bg-gradient-to-r from-[#4FC3F7] to-[#87CEEB] hover:from-[#2BB5D9] hover:to-[#4FC3F7] text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2">
              View
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
