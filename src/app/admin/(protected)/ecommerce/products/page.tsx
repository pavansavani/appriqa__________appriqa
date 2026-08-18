"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit, Trash2, Eye, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  status: string;
  featured_image?: string;
  product_type?: string;
  category: { name: string } | null;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/products");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to archive this product?")) return;
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      fetchProducts();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Manage your store's products and inventory.</p>
        </div>
        <Link href="/admin/products/new">
          <Button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#2A2A2A] flex flex-wrap gap-4 items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
            <input 
              type="text" 
              placeholder="Search products by name or SKU..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-[#FF6B00] outline-none transition-colors"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E1E1E]/50 border-b border-[#2A2A2A]">
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#8A8A8A]">Loading products...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-red-400">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#8A8A8A]">No products found.</td>
                </tr>
              ) : (
                filteredProducts.map(product => (
                  <tr key={product.id} className="hover:bg-[#1E1E1E]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        {product.featured_image ? (
                          <img src={product.featured_image} alt={product.name} className="w-10 h-10 object-cover rounded-md border border-[#3A3A3A]" />
                        ) : (
                          <div className="w-10 h-10 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center">
                            <Eye className="w-4 h-4 text-[#8A8A8A]" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-semibold text-white">{product.name}</span>
                          <span className="text-xs text-[#8A8A8A]">{product.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        product.status === 'published' ? 'bg-emerald-500/10 text-emerald-400' :
                        product.status === 'archived' ? 'bg-red-500/10 text-red-400' :
                        'bg-yellow-500/10 text-yellow-400'
                      }`}>
                        {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D4D4D4]">{product.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D4D4D4]">
                      {product.product_type === 'digital' ? 'Digital' : 'Physical'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D4D4D4]">
                      {product.category?.name || "Uncategorized"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-white">
                      ₹{product.price.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/products/${product.id}`}>
                          <button className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#D4D4D4] hover:text-[#FF6B00] hover:border-[#FF6B00]/50 transition-all" title="Edit">
                            <Edit className="w-4 h-4" />
                          </button>
                        </Link>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#D4D4D4] hover:text-red-400 hover:border-red-400/50 transition-all" 
                          title="Archive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
