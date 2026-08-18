"use client";

import { useEffect, useState } from "react";
import { Search, AlertCircle, MessageSquare, Trash2, Mail } from "lucide-react";

interface Query {
  id: string;
  customer_name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  priority: string;
  status: string;
  created_at: string;
}

export default function AdminQueriesPage() {
  const [queries, setQueries] = useState<Query[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchQueries = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/queries");
      if (!res.ok) throw new Error("Failed to fetch queries");
      const data = await res.json();
      setQueries(data.queries || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();
  }, []);

  const handleUpdateField = async (id: string, field: string, value: string) => {
    try {
      const res = await fetch(`/api/admin/queries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value })
      });
      if (!res.ok) throw new Error(`Failed to update ${field}`);
      fetchQueries();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this query ticket?")) return;
    try {
      const res = await fetch(`/api/admin/queries/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete query");
      fetchQueries();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredQueries = queries.filter(q => 
    q.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    q.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (q.subject && q.subject.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Support Queries</h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Manage customer support tickets.</p>
        </div>
      </div>

      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#2A2A2A] flex flex-wrap gap-4 items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
            <input 
              type="text" 
              placeholder="Search by Name, Email, or Subject..." 
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
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider w-[40%]">Ticket Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Priority</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">Loading support queries...</td>
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
              ) : filteredQueries.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">
                    <div className="flex flex-col items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-[#2A2A2A] mb-3" />
                      <p>No support queries found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQueries.map(q => (
                  <tr key={q.id} className="hover:bg-[#1E1E1E]/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-white">{q.customer_name}</div>
                      <div className="text-sm text-[#8A8A8A] flex items-center gap-1"><Mail className="w-3 h-3" /> {q.email}</div>
                      {q.phone && <div className="text-xs text-[#8A8A8A] mt-0.5">{q.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold mb-1 text-white">
                        {q.subject || 'No Subject'}
                      </div>
                      <p className="text-sm text-[#8A8A8A] line-clamp-2">
                        {q.message}
                      </p>
                      <div className="text-xs text-[#555] mt-2">
                        Created: {new Date(q.created_at).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        value={q.priority}
                        onChange={(e) => handleUpdateField(q.id, 'priority', e.target.value)}
                        className={`text-xs font-bold rounded-md px-2 py-1 outline-none cursor-pointer border ${
                          q.priority === 'urgent' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          q.priority === 'high' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          q.priority === 'normal' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}
                      >
                        <option className="bg-[#141414] text-white" value="low">Low</option>
                        <option className="bg-[#141414] text-white" value="normal">Normal</option>
                        <option className="bg-[#141414] text-white" value="high">High</option>
                        <option className="bg-[#141414] text-white" value="urgent">Urgent</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        value={q.status}
                        onChange={(e) => handleUpdateField(q.id, 'status', e.target.value)}
                        className={`text-xs font-bold rounded-md px-2 py-1 outline-none cursor-pointer border ${
                          q.status === 'open' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          q.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          q.status === 'waiting_for_customer' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                          'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        }`}
                      >
                        <option className="bg-[#141414] text-white" value="open">Open</option>
                        <option className="bg-[#141414] text-white" value="in_progress">In Progress</option>
                        <option className="bg-[#141414] text-white" value="waiting_for_customer">Waiting on Customer</option>
                        <option className="bg-[#141414] text-white" value="resolved">Resolved</option>
                        <option className="bg-[#141414] text-white" value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => handleDelete(q.id)}
                        className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#D4D4D4] hover:text-red-400 hover:border-red-400/50 transition-all inline-flex items-center justify-center" 
                        title="Delete Ticket"
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
