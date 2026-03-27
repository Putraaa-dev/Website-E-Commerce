import { useEffect, useState } from 'react';
import { fetchProducts, createProduct, updateProduct, deleteProduct, API_BASE } from '@/app/utils/api';
import ProductForm from '@/app/components/ProductForm';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { Edit, Trash2, Plus, Search } from 'lucide-react';
import { toast } from 'sonner';

export function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
      setProducts((prev) => prev.filter((p) => p.id !== id))
      toast.success('Product deleted successfully')
    } catch (err) {
      toast.error('Failed to delete product')
    }
  };

  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)

  const handleEdit = (id: string) => {
    const existing = products.find((p) => p.id === id)
    if (!existing) return
    setEditing(existing)
    setIsFormOpen(true)
  }

  const handleAdd = () => {
    setEditing(null)
    setIsFormOpen(true)
  }

  const handleSubmit = async (values: any) => {
    try {
      console.log('Saving product with values:', values)
      if (editing) {
        console.log('Updating product ID:', editing.id)
        const updated = await updateProduct(editing.id, values)
        console.log('Update response:', updated)
        setProducts((prev) => prev.map((p) => (p.id === editing.id ? mapBackendProduct(updated) : p)))
        setEditing(null)
        setIsFormOpen(false)
        toast.success('Product updated successfully')
      } else {
        console.log('Creating new product')
        const created = await createProduct(values)
        console.log('Create response:', created)
        setProducts((prev) => [mapBackendProduct(created), ...prev])
        setIsFormOpen(false)
        toast.success('Product created successfully')
      }
    } catch (err) {
      console.error('Save error:', err)
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      toast.error(`Failed to save product: ${errorMsg}`)
      throw err
    }
  }

  const filteredProducts = products.filter((product) =>
    (product.title || product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (product.category || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

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
        const data = await fetchProducts()
        if (!mounted) return
        setProducts(data.map(mapBackendProduct))
      } catch (err) {
        toast.error('Failed to load products')
      }
    })()
    return () => { mounted = false }
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl text-gray-800">Products Management</h1>
        <Button onClick={handleAdd} className="bg-[#4FC3F7] hover:bg-[#87CEEB] text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
        <ProductForm open={isFormOpen} onOpenChange={setIsFormOpen} initial={editing} onSubmit={handleSubmit} />
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 border-gray-300 focus:border-[#4FC3F7] focus:ring-[#4FC3F7]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-[#F0F8FF]">
              <TableHead className="text-gray-700">Image</TableHead>
              <TableHead className="text-gray-700">Name</TableHead>
              <TableHead className="text-gray-700">Category</TableHead>
              <TableHead className="text-gray-700">Price</TableHead>
              <TableHead className="text-gray-700">Downloads</TableHead>
              <TableHead className="text-gray-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.map((product) => (
              <TableRow key={product.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="w-16 h-16 rounded overflow-hidden bg-gray-100">
                    <img
                      src={product.thumbnail}
                      alt={product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs">
                    <div className="text-gray-800 line-clamp-1">{product.title}</div>
                    <div className="text-sm text-gray-500 line-clamp-1">
                      {product.techSpecs.language}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="inline-block px-3 py-1 text-xs bg-[#F0F8FF] text-[#4FC3F7] rounded-full">
                    {product.category}
                  </span>
                </TableCell>
                <TableCell className="text-gray-800">
                  {formatPrice(product.price)}
                </TableCell>
                <TableCell className="text-gray-600">{product.downloads}</TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(product.id)}
                      className="border-[#4FC3F7] text-[#4FC3F7] hover:bg-[#4FC3F7] hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(product.id)}
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No products found matching your search.
          </div>
        )}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
}
