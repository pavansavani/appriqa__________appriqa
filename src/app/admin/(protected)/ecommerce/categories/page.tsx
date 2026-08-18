"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, AlertCircle, X, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  banner_image?: string;
  seo_title?: string;
  seo_description?: string;
  parent_id?: string;
  status: string;
  display_order: number;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    image: "",
    banner_image: "",
    seo_title: "",
    seo_description: "",
    parent_id: "",
    status: "active",
    display_order: 0,
  });

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/categories");
      if (!res.ok) throw new Error("Failed to fetch categories");
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete category");
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleOpenModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        slug: category.slug,
        description: category.description || "",
        image: category.image || "",
        banner_image: category.banner_image || "",
        seo_title: category.seo_title || "",
        seo_description: category.seo_description || "",
        parent_id: category.parent_id || "",
        status: category.status,
        display_order: category.display_order,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
        slug: "",
        description: "",
        image: "",
        banner_image: "",
        seo_title: "",
        seo_description: "",
        parent_id: "",
        status: "active",
        display_order: categories.length,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const url = editingCategory ? `/api/admin/categories/${editingCategory.id}` : `/api/admin/categories`;
      const method = editingCategory ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save category");
      }

      setIsModalOpen(false);
      fetchCategories();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Categories</h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Manage product categories, store navigation images, and details.</p>
        </div>
        <Button className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white flex items-center gap-2" onClick={() => handleOpenModal()}>
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#2A2A2A] flex flex-wrap gap-4 items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
            <input 
              type="text" 
              placeholder="Search categories..." 
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
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider w-16">Image</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Name / Slug</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Order</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">Loading categories...</td>
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
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">No categories found.</td>
                </tr>
              ) : (
                filteredCategories.map(cat => (
                  <tr key={cat.id} className="hover:bg-[#1E1E1E]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} className="w-10 h-10 object-cover rounded-md border border-[#3A3A3A]" />
                      ) : (
                        <div className="w-10 h-10 rounded-md bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center">
                          <ImageIcon className="w-4 h-4 text-[#8A8A8A]" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{cat.name}</div>
                      <div className="text-xs text-[#8A8A8A]">{cat.slug}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        cat.status === 'active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {cat.status.charAt(0).toUpperCase() + cat.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#D4D4D4]">{cat.display_order}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#D4D4D4] hover:text-[#FF6B00] hover:border-[#FF6B00]/50 transition-all" 
                          title="Edit" 
                          onClick={() => handleOpenModal(cat)}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(cat.id)}
                          className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#D4D4D4] hover:text-red-400 hover:border-red-400/50 transition-all" 
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl w-full max-w-xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 border-b border-[#2A2A2A] flex justify-between items-center bg-[#1E1E1E]/50">
              <h2 className="text-xl font-bold text-white">{editingCategory ? "Edit Category" : "Add New Category"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#8A8A8A] hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-5 overflow-y-auto space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#D4D4D4]">Category Name</label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value, slug: !editingCategory ? e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : formData.slug})}
                    className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#D4D4D4]">URL Slug</label>
                  <input
                    required
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#D4D4D4]">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Appears on the homepage Store section"
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#D4D4D4]">Category Image URL (Optional)</label>
                <div className="flex gap-3 items-start">
                  {formData.image && (
                    <div className="w-16 h-16 rounded-lg border border-[#3A3A3A] overflow-hidden flex-shrink-0 bg-[#1E1E1E]">
                      <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => setFormData({...formData, image: e.target.value})}
                    placeholder="https://..."
                    className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#D4D4D4]">SEO Title (Optional)</label>
                  <input
                    type="text"
                    value={formData.seo_title}
                    onChange={(e) => setFormData({...formData, seo_title: e.target.value})}
                    className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#D4D4D4]">SEO Description (Optional)</label>
                  <input
                    type="text"
                    value={formData.seo_description}
                    onChange={(e) => setFormData({...formData, seo_description: e.target.value})}
                    className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#D4D4D4]">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none transition-colors"
                  >
                    <option value="active">Active (Published)</option>
                    <option value="inactive">Inactive (Hidden)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#D4D4D4]">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({...formData, display_order: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-white focus:border-[#FF6B00] outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-[#2A2A2A]">
                <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-[#D4D4D4] hover:text-white hover:bg-[#1E1E1E]">Cancel</Button>
                <Button type="submit" disabled={isSaving} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white min-w-[100px]">
                  {isSaving ? "Saving..." : "Save Category"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
