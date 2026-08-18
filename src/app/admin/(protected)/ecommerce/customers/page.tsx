"use client";

import { useEffect, useState } from "react";
import { Search, Eye, AlertCircle, Users } from "lucide-react";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchCustomers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/customers");
      if (!res.ok) throw new Error("Failed to fetch customers");
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchCustomers();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredCustomers = customers.filter(c => 
    (c.first_name + " " + c.last_name).toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Manage registered customers and accounts.</p>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#2A2A2A] flex flex-wrap gap-4 items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
            <input 
              type="text" 
              placeholder="Search by Name or Email..." 
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
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">Loading customers...</td>
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
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">
                    <div className="flex flex-col items-center justify-center">
                      <Users className="w-8 h-8 text-[#2A2A2A] mb-3" />
                      <p>No customers found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredCustomers.map(customer => (
                  <tr key={customer.id} className="hover:bg-[#1E1E1E]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{customer.first_name} {customer.last_name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{customer.email}</div>
                      <div className="text-xs text-[#8A8A8A]">{customer.phone || 'No phone provided'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8A8A8A]">
                      {new Date(customer.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        value={customer.status}
                        onChange={(e) => handleUpdateStatus(customer.id, e.target.value)}
                        className={`text-xs font-bold rounded-md px-2 py-1 outline-none cursor-pointer border ${
                          customer.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}
                      >
                        <option className="bg-[#141414] text-white" value="active">Active</option>
                        <option className="bg-[#141414] text-white" value="banned">Banned</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#D4D4D4] hover:text-[#FF6B00] hover:border-[#FF6B00]/50 transition-all inline-flex items-center justify-center" 
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
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
