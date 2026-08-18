"use client";

import { useEffect, useState } from "react";
import { Search, AlertCircle, ImageIcon, Trash2, Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GalleryItem {
  id: string;
  title: string | null;
  description: string | null;
  image_url: string;
  category: string | null;
  display_order: number;
  status: string;
}

export default function AdminGalleryPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image_url: "",
    category: "",
    display_order: 0,
    status: "published"
  });

  const fetchGallery = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/gallery");
      if (!res.ok) throw new Error("Failed to fetch gallery items");
      const data = await res.json();
      setGallery(data.gallery || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId ? `/api/admin/gallery/${editingId}` : "/api/admin/gallery";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          display_order: parseInt(formData.display_order as any) || 0
        })
      });
      
      if (!res.ok) throw new Error(editingId ? "Failed to update item" : "Failed to add item");
      
      setIsAdding(false);
      setEditingId(null);
      setFormData({ title: "", description: "", image_url: "", category: "", display_order: 0, status: "published" });
      fetchGallery();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (item: GalleryItem) => {
    setFormData({
      title: item.title || "",
      description: item.description || "",
      image_url: item.image_url,
      category: item.category || "",
      display_order: item.display_order,
      status: item.status
    });
    setEditingId(item.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this item?")) return;
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete item");
      fetchGallery();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchGallery();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredGallery = gallery.filter(g => 
    g.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    g.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Visual Showcase</h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Manage the gallery images and showcase projects.</p>
        </div>
        <Button onClick={() => {
          setIsAdding(!isAdding);
          if (editingId) {
            setEditingId(null);
            setFormData({ title: "", description: "", image_url: "", category: "", display_order: 0, status: "published" });
          }
        }} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {isAdding ? "Cancel" : "Add Image"}
        </Button>
      </div>

      {isAdding && (
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">{editingId ? 'Edit Image' : 'Add New Image'}</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#8A8A8A] mb-1">Title (Optional)</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8A8A8A] mb-1">Image URL</label>
                <div className="flex gap-3">
                  {formData.image_url && (
                    <div className="w-10 h-10 rounded border border-[#2A2A2A] flex-shrink-0 bg-[#1E1E1E] overflow-hidden">
                      <img src={formData.image_url} className="w-full h-full object-cover" alt="Preview" />
                    </div>
                  )}
                  <input required type="url" value={formData.image_url} onChange={e => setFormData({...formData, image_url: e.target.value})} placeholder="https://..." className="flex-1 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:border-[#FF6B00] outline-none" />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8A8A8A] mb-1">Description (Optional)</label>
              <textarea rows={2} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:border-[#FF6B00] outline-none" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#8A8A8A] mb-1">Category (Optional)</label>
                <input type="text" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8A8A8A] mb-1">Display Order</label>
                <input type="number" value={formData.display_order} onChange={e => setFormData({...formData, display_order: parseInt(e.target.value) || 0})} className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:border-[#FF6B00] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8A8A8A] mb-1">Status</label>
                <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:border-[#FF6B00] outline-none">
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5">
              {editingId ? 'Update Image' : 'Save Image'}
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
              placeholder="Search Showcase..." 
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
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider w-[15%]">Image</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider w-[25%]">Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">Loading showcase...</td>
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
              ) : filteredGallery.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">
                    <div className="flex flex-col items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-[#2A2A2A] mb-3" />
                      <p>No images found in the showcase.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredGallery.map(item => (
                  <tr key={item.id} className="hover:bg-[#1E1E1E]/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-20 h-20 rounded-md border border-[#2A2A2A] bg-[#1E1E1E] overflow-hidden">
                        <img src={item.image_url} alt={item.title || "Gallery Item"} className="w-full h-full object-cover" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-white">{item.title || 'Untitled'}</div>
                      {item.category && <div className="text-xs text-[#FF6B00] mt-1 font-bold">{item.category}</div>}
                      <div className="text-sm text-[#8A8A8A] mt-1 line-clamp-1">{item.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8A8A8A]">
                      {item.display_order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        value={item.status}
                        onChange={(e) => handleUpdateStatus(item.id, e.target.value)}
                        className={`text-xs font-bold rounded-md px-2 py-1 outline-none cursor-pointer border ${
                          item.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}
                      >
                        <option className="bg-[#141414] text-white" value="published">Published</option>
                        <option className="bg-[#141414] text-white" value="draft">Draft</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEdit(item)}
                          className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#D4D4D4] hover:text-[#FF6B00] hover:border-[#FF6B00]/50 transition-all inline-flex items-center justify-center" 
                          title="Edit Image"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(item.id)}
                          className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#D4D4D4] hover:text-red-400 hover:border-red-400/50 transition-all inline-flex items-center justify-center" 
                          title="Delete Image"
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
