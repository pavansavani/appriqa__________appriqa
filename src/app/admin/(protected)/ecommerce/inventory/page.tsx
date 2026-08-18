"use client";

import { useEffect, useState } from "react";
import { Search, AlertCircle, Package, Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InventoryItem {
  id: string;
  name: string;
  sku: string | null;
  stock: number;
  price: number;
  categories: { name: string } | null;
}

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState<number>(0);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/inventory");
      if (!res.ok) throw new Error("Failed to fetch inventory");
      const data = await res.json();
      setInventory(data.inventory || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  const handleEditClick = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditStock(item.stock);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditStock(0);
  };

  const handleSaveStock = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/inventory/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: editStock })
      });
      if (!res.ok) throw new Error("Failed to update stock");
      
      setInventory(inventory.map(item => item.id === id ? { ...item, stock: editStock } : item));
      setEditingId(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredInventory = inventory.filter(i => 
    i.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (i.sku && i.sku.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory Management</h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Track and adjust product stock levels.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6">
          <div className="text-[#8A8A8A] text-sm font-medium mb-2">Total Products</div>
          <div className="text-3xl font-bold text-white">{inventory.length}</div>
        </div>
        <div className="bg-[#141414] border border-red-500/30 rounded-xl p-6">
          <div className="text-red-400 text-sm font-medium mb-2">Out of Stock</div>
          <div className="text-3xl font-bold text-white">{inventory.filter(i => i.stock <= 0).length}</div>
        </div>
        <div className="bg-[#141414] border border-yellow-500/30 rounded-xl p-6">
          <div className="text-yellow-500 text-sm font-medium mb-2">Low Stock (≤ 5)</div>
          <div className="text-3xl font-bold text-white">{inventory.filter(i => i.stock > 0 && i.stock <= 5).length}</div>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#2A2A2A] flex flex-wrap gap-4 items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
            <input 
              type="text" 
              placeholder="Search by Product Name or SKU..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:border-[#FF6B00] outline-none transition-colors"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#1E1E1E]/50 border-b border-[#2A2A2A]">
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">SKU</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Available Stock</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#8A8A8A]">Loading inventory...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-red-400">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  </td>
                </tr>
              ) : filteredInventory.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#8A8A8A]">
                    <div className="flex flex-col items-center justify-center">
                      <Package className="w-8 h-8 text-[#2A2A2A] mb-3" />
                      <p>No products found in inventory.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredInventory.map(item => (
                  <tr key={item.id} className="hover:bg-[#1E1E1E]/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{item.name}</div>
                      <div className="text-xs text-[#8A8A8A]">₹{item.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D4D4D4]">
                      {item.sku || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D4D4D4]">
                      {item.categories?.name || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.stock <= 0 ? (
                        <span className="bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-bold px-2 py-1 rounded">Out of Stock</span>
                      ) : item.stock <= 5 ? (
                        <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 text-xs font-bold px-2 py-1 rounded">Low Stock</span>
                      ) : (
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold px-2 py-1 rounded">In Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingId === item.id ? (
                        <input
                          type="number"
                          className="bg-[#1E1E1E] border border-[#FF6B00] text-white px-2 py-1 rounded w-24 outline-none"
                          value={editStock}
                          onChange={(e) => setEditStock(parseInt(e.target.value) || 0)}
                          autoFocus
                        />
                      ) : (
                        <span className={`text-lg font-bold ${item.stock <= 0 ? 'text-red-400' : item.stock <= 5 ? 'text-yellow-500' : 'text-emerald-400'}`}>
                          {item.stock}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {editingId === item.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleSaveStock(item.id)}
                            className="p-1.5 rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                            title="Save"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={handleCancelEdit}
                            className="p-1.5 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleEditClick(item)}
                          className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#D4D4D4] hover:text-[#FF6B00] hover:border-[#FF6B00]/50 transition-all inline-flex items-center justify-center" 
                          title="Adjust Stock"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                      )}
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
