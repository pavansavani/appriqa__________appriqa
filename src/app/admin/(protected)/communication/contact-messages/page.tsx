"use client";

import { useEffect, useState } from "react";
import { Search, AlertCircle, MessageSquare, Trash2, Mail } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
}

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/contact-messages");
      if (!res.ok) throw new Error("Failed to fetch contact messages");
      const data = await res.json();
      setMessages(data.messages || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/contact-messages/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      fetchMessages();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/contact-messages/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete message");
      fetchMessages();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredMessages = messages.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.subject?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
          <p className="text-[#8A8A8A] text-sm mt-1">Manage and respond to customer inquiries.</p>
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
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider w-[40%]">Message</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-[#8A8A8A] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">Loading messages...</td>
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
              ) : filteredMessages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">
                    <div className="flex flex-col items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-[#2A2A2A] mb-3" />
                      <p>No contact messages found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredMessages.map(msg => (
                  <tr key={msg.id} className={`hover:bg-[#1E1E1E]/30 transition-colors ${msg.status === 'unread' ? 'bg-[#1E1E1E]/10' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`font-semibold ${msg.status === 'unread' ? 'text-white' : 'text-[#D4D4D4]'}`}>{msg.name}</div>
                      <div className="text-sm text-[#8A8A8A] flex items-center gap-1"><Mail className="w-3 h-3" /> {msg.email}</div>
                      {msg.phone && <div className="text-xs text-[#8A8A8A] mt-0.5">{msg.phone}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div className={`text-sm font-semibold mb-1 ${msg.status === 'unread' ? 'text-white' : 'text-[#D4D4D4]'}`}>
                        {msg.subject || 'No Subject'}
                      </div>
                      <p className="text-sm text-[#8A8A8A] line-clamp-2">
                        {msg.message}
                      </p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#8A8A8A]">
                      {new Date(msg.created_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select 
                        value={msg.status}
                        onChange={(e) => handleUpdateStatus(msg.id, e.target.value)}
                        className={`text-xs font-bold rounded-md px-2 py-1 outline-none cursor-pointer border ${
                          msg.status === 'unread' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                          msg.status === 'read' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          msg.status === 'replied' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}
                      >
                        <option className="bg-[#141414] text-white" value="unread">Unread</option>
                        <option className="bg-[#141414] text-white" value="read">Read</option>
                        <option className="bg-[#141414] text-white" value="replied">Replied</option>
                        <option className="bg-[#141414] text-white" value="archived">Archived</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button 
                        onClick={() => handleDelete(msg.id)}
                        className="p-2 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[#D4D4D4] hover:text-red-400 hover:border-red-400/50 transition-all inline-flex items-center justify-center" 
                        title="Delete Message"
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
