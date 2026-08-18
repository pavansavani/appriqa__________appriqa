"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    sku: "",
    price: "",
    compare_at_price: "",
    short_description: "",
    description: "",
    product_type: "physical",
    status: "draft",
    featured: false,
    best_seller: false,
    new_arrival: false,
    thumbnail_url: ""
  });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/admin/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        
        if (data.product) {
          setFormData({
            name: data.product.name || "",
            slug: data.product.slug || "",
            sku: data.product.sku || "",
            price: data.product.price ? data.product.price.toString() : "",
            compare_at_price: data.product.compare_at_price ? data.product.compare_at_price.toString() : "",
            short_description: data.product.short_description || "",
            description: data.product.description || "",
            product_type: data.product.product_type || "physical",
            status: data.product.status || "draft",
            featured: data.product.featured || false,
            best_seller: data.product.best_seller || false,
            new_arrival: data.product.new_arrival || false,
            thumbnail_url: data.product.thumbnail_url || ""
          });
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const generateSlug = () => {
    if (formData.name && !formData.slug) {
      setFormData(prev => ({
        ...prev,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update product");

      router.push("/admin/products");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center text-[#8A8A8A]">Loading product data...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products">
          <Button variant="outline" size="icon" className="bg-[#141414] border-[#2A2A2A] hover:bg-[#1E1E1E]">
            <ArrowLeft className="w-4 h-4 text-[#D4D4D4]" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Edit Product</h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Update existing product information.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">General Information</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#D4D4D4]">Product Name *</label>
                <input 
                  required
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={generateSlug}
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#FF6B00] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#D4D4D4]">URL Slug *</label>
                <input 
                  required
                  type="text" 
                  name="slug"
                  value={formData.slug}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#FF6B00] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#D4D4D4]">Short Description</label>
                <textarea 
                  name="short_description"
                  value={formData.short_description}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#FF6B00] outline-none h-20"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#D4D4D4]">Full Description</label>
                <textarea 
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#FF6B00] outline-none h-40"
                />
              </div>
            </div>

            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">Media</h2>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#D4D4D4]">Thumbnail URL</label>
                <input 
                  type="text" 
                  name="thumbnail_url"
                  value={formData.thumbnail_url}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#FF6B00] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">Pricing & Details</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#D4D4D4]">Price (INR) *</label>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#FF6B00] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#D4D4D4]">Compare at Price (INR)</label>
                <input 
                  type="number" 
                  step="0.01"
                  name="compare_at_price"
                  value={formData.compare_at_price}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#FF6B00] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#D4D4D4]">SKU *</label>
                <input 
                  required
                  type="text" 
                  name="sku"
                  value={formData.sku}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#FF6B00] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#D4D4D4]">Product Type</label>
                <select 
                  name="product_type"
                  value={formData.product_type}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#FF6B00] outline-none"
                >
                  <option value="physical">Physical</option>
                  <option value="digital">Digital Download</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-[#D4D4D4]">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2.5 text-sm text-white focus:border-[#FF6B00] outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-bold text-white mb-4">Badges</h2>
              
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="featured" checked={formData.featured} onChange={handleChange} className="accent-[#FF6B00] w-4 h-4" />
                <span className="text-sm text-[#D4D4D4]">Featured Product</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="best_seller" checked={formData.best_seller} onChange={handleChange} className="accent-[#FF6B00] w-4 h-4" />
                <span className="text-sm text-[#D4D4D4]">Best Seller</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="new_arrival" checked={formData.new_arrival} onChange={handleChange} className="accent-[#FF6B00] w-4 h-4" />
                <span className="text-sm text-[#D4D4D4]">New Arrival</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t border-[#2A2A2A]">
          <Link href="/admin/products">
            <Button type="button" variant="outline" className="bg-[#141414] border-[#2A2A2A] hover:bg-[#1E1E1E] text-white">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isSubmitting} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white min-w-[120px]">
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-4 h-4 mr-2" /> Update Product</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
