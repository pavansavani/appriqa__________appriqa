"use client";

import { useEffect, useState } from "react";
import { Search, AlertCircle, Download, Trash2, Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DigitalProduct {
  id: string;
  product_id: string;
  file_url: string;
  file_name: string | null;
  file_size: number | null;
  download_limit: number | null;
  status: string;
  products: {
    id: string;
    name: string;
    price: number;
  } | null;
}

export default function AdminDownloadsPage() {
  const [downloads, setDownloads] = useState<DigitalProduct[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    product_id: "",
    file_url: "",
    file_name: "",
    file_size: "",
    download_limit: "",
    status: "active"
  });

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [dlRes, prodRes] = await Promise.all([
        fetch("/api/admin/downloads"),
        fetch("/api/admin/products") // To get product list for dropdown
      ]);
      
      if (!dlRes.ok) throw new Error("Failed to fetch downloads");
      
      const dlData = await dlRes.json();
      setDownloads(dlData.downloads || []);

      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/downloads/${editingId}` : "/api/admin/downloads";
      const method = editingId ? "PUT" : "POST";
      
      const payload: any = {
        product_id: formData.product_id,
        file_url: formData.file_url,
        file_name: formData.file_name,
        status: formData.status
      };
      
      if (formData.file_size) payload.file_size = parseFloat(formData.file_size);
      if (formData.download_limit) payload.download_limit = parseInt(formData.download_limit);

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (!res.ok) throw new Error(editingId ? "Failed to update item" : "Failed to add item");
      
      setIsAdding(false);
      setEditingId(null);
      setFormData({ product_id: "", file_url: "", file_name: "", file_size: "", download_limit: "", status: "active" });
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (item: DigitalProduct) => {
    setFormData({
      product_id: item.product_id,
      file_url: item.file_url,
      file_name: item.file_name || "",
      file_size: item.file_size ? item.file_size.toString() : "",
      download_limit: item.download_limit ? item.download_limit.toString() : "",
      status: item.status
    });
    setEditingId(item.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this file mapping?")) return;
    try {
      const res = await fetch(`/api/admin/downloads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/downloads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredDownloads = downloads.filter(d => 
    d.products?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.file_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Digital Downloads</h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Manage files and links for digital products.</p>
        </div>
        <Button onClick={() => {
          setIsAdding(!isAdding);
          if (editingId) {
            setEditingId(null);
            setFormData({ product_id: "", file_url: "", file_name: "", file_size: "", download_limit: "", status: "active" });
          }
        }} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {isAdding ? "Cancel" : "Add Digital Product"}
        </Button>
      </div>

      {isAdding && (
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">{editingId ? 'Edit Mapping' : 'Link File to Product'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#8A8A8A] mb-1">Select Product</label>
                <select required value={formData.product_id} onChange={e => setFormData({...formData, product_id: e.target.value})} className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:border-[#FF6B00] outline-none">
                  <option value="">-- Select Product --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (₹{p.price})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8A8A8A] mb-1">File URL / Download Link</label>
                <input required type="url" value={formData.file_url} onChange={e => setFormData({...formData, file_url: e.target.value})} placeholder="https://..." className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:border-[#FF6B00] outline-none" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-[#8A8A8A] mb-1">File Name (Optional)</label>
                <input type="text" value={formData.file_name} onChange={e => setFormData({...formData, file_name: e.target.value})} placeholder="e.g. ebook_v2.pdf" className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8A8A8A] mb-1">File Size (MB)</label>
                <input type="number" step="0.1" value={formData.file_size} onChange={e => setFormData({...formData, file_size: e.target.value})} className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8A8A8A] mb-1">Download Limit</label>
                <input type="number" value={formData.download_limit} onChange={e => setFormData({...formData, download_limit: e.target.value})} placeholder="Unlimited" className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:border-[#FF6B00] outline-none" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5">
              {editingId ? 'Update Mapping' : 'Save Mapping'}
            </Button>
          </form>
        </div>
      )}

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#2A2A2A] flex flex-wrap gap-4 items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
            <input 
              type="text" 
              placeholder="Search Products or Files..." 
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
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">File Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Limits</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">Loading digital products...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-red-400">
                    <div className="flex items-center justify-center gap-2">
                      <AlertCircle className="w-5 h-5" />
                      {error}
                    </div>
                  </td>
                </tr>
              ) : filteredDownloads.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">
                    <div className="flex flex-col items-center justify-center">
                      <Download className="w-8 h-8 text-[#2A2A2A] mb-3" />
                      <p>No digital products found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDownloads.map(item => (
                  <tr key={item.id} className="hover:bg-[#1E1E1E]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{item.products?.name || 'Unknown Product'}</div>
                      <div className="text-xs text-[#8A8A8A]">₹{item.products?.price}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#D4D4D4] font-medium">{item.file_name || 'No filename specified'}</div>
                      <a href={item.file_url} target="_blank" rel="noreferrer" className="text-xs text-blue-400 hover:underline truncate block max-w-xs mt-1">
                        {item.file_url}
                      </a>
                      {item.file_size && <div className="text-xs text-[#8A8A8A] mt-1">{item.file_size} MB</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8A8A8A]">
                      {item.download_limit ? `${item.download_limit} max per user` : 'Unlimited'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        className={`text-xs font-bold rounded-md px-2 py-1 outline-none cursor-pointer border ${
                          item.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                      >
                        <option className="bg-[#141414] text-white" value="active">Active</option>
                        <option className="bg-[#141414] text-white" value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#D4D4D4] hover:text-[#FF6B00] hover:border-[#FF6B00]/50 transition-all inline-flex items-center justify-center" 
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#D4D4D4] hover:text-red-400 hover:border-red-400/50 transition-all inline-flex items-center justify-center" 
                          title="Delete"
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
