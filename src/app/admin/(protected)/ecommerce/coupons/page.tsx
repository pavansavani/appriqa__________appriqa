"use client";

import { useEffect, useState } from "react";
import { Search, AlertCircle, Ticket, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Coupon {
  id: string;
  code: string;
  discount_type: string;
  discount_value: number;
  min_purchase_amount: number | null;
  max_discount_amount: number | null;
  expiry_date: string | null;
  usage_limit: number | null;
  times_used: number;
  status: string;
  created_at: string;
}

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_value: "",
    status: "active"
  });

  const fetchCoupons = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/coupons");
      if (!res.ok) throw new Error("Failed to fetch coupons");
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          code: formData.code.toUpperCase(),
          discount_value: parseFloat(formData.discount_value)
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to add coupon");
      }
      setIsAdding(false);
      setFormData({ code: "", discount_type: "percentage", discount_value: "", status: "active" });
      fetchCoupons();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchCoupons();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this coupon?")) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete coupon");
      fetchCoupons();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Coupons</h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Manage discount codes and promotions.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white flex items-center gap-2">
          <Plus className="w-4 h-4" />
          {isAdding ? "Cancel" : "Add Coupon"}
        </Button>
      </div>

      {isAdding && (
        <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl p-6 mb-6">
          <h2 className="text-lg font-bold text-white mb-4">Create New Coupon</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-[#8A8A8A] mb-1">Coupon Code</label>
              <input required type="text" placeholder="e.g. SUMMER20" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:border-[#FF6B00] outline-none uppercase" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8A8A8A] mb-1">Discount Type</label>
              <select value={formData.discount_type} onChange={e => setFormData({...formData, discount_type: e.target.value})} className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:border-[#FF6B00] outline-none">
                <option value="percentage">Percentage (%)</option>
                <option value="fixed_amount">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8A8A8A] mb-1">Discount Value</label>
              <input required type="number" step="0.01" min="0" placeholder="e.g. 20" value={formData.discount_value} onChange={e => setFormData({...formData, discount_value: e.target.value})} className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-2 text-white focus:border-[#FF6B00] outline-none" />
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5">
              Save Coupon
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
              placeholder="Search by Code..." 
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
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Code</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Discount</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Usage</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">Loading coupons...</td>
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
              ) : filteredCoupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">
                    <div className="flex flex-col items-center justify-center">
                      <Ticket className="w-8 h-8 text-[#2A2A2A] mb-3" />
                      <p>No coupons found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCoupons.map(coupon => (
                  <tr key={coupon.id} className="hover:bg-[#1E1E1E]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-bold text-white tracking-widest">{coupon.code}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-emerald-400 font-semibold">
                        {coupon.discount_type === 'percentage' ? `${coupon.discount_value}% OFF` : `₹${coupon.discount_value} OFF`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8A8A8A]">
                      {coupon.times_used} {coupon.usage_limit ? `/ ${coupon.usage_limit}` : 'uses'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        value={coupon.status}
                        onChange={(e) => handleUpdateStatus(coupon.id, e.target.value)}
                        className={`text-xs font-bold rounded-md px-2 py-1 outline-none cursor-pointer border ${
                          coupon.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          coupon.status === 'expired' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}
                      >
                        <option className="bg-[#141414] text-white" value="active">Active</option>
                        <option className="bg-[#141414] text-white" value="inactive">Inactive</option>
                        <option className="bg-[#141414] text-white" value="expired">Expired</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => handleDelete(coupon.id)}
                        className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#D4D4D4] hover:text-red-400 hover:border-red-400/50 transition-all inline-flex items-center justify-center" 
                        title="Delete Coupon"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
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
