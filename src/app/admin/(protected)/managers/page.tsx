"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Plus, Shield, ShieldAlert, Store, Globe, Trash2, Mail, Lock, User, Key, X } from "lucide-react";

type Manager = {
  id: string;
  auth_user_id: string;
  email: string;
  full_name: string;
  role: string;
  created_at: string;
};

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  store_manager: "Store Manager",
  website_manager: "Website Manager",
};

const roleIcons: Record<string, React.ReactNode> = {
  super_admin: <ShieldAlert className="w-4 h-4 text-red-500" />,
  admin: <Shield className="w-4 h-4 text-orange-500" />,
  store_manager: <Store className="w-4 h-4 text-blue-500" />,
  website_manager: <Globe className="w-4 h-4 text-green-500" />,
};

export default function ManagersPage() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "admin",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("auth_user_id", session.user.id)
        .single();
        
      setIsSuperAdmin(profile?.role === "super_admin");

      const res = await fetch("/api/admin/managers", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setManagers(data.managers);
      }
    } catch (err) {
      console.error("Error fetching managers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddManager = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error("Not authenticated");

      const res = await fetch("/api/admin/managers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to create manager");
      }

      if (data.updated) {
        setSuccess("Existing user's role updated successfully!");
      } else {
        setSuccess("Invite email sent successfully!");
      }
      setFormData({ name: "", email: "", role: "admin" });
      setShowAddModal(false);
      fetchManagers();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-[#FF6B00] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-[#8A8A8A]">You must be a Super Admin to view and manage team members.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-wide">Managers & Team</h1>
          <p className="text-sm text-[#8A8A8A] mt-1">Add and manage access levels for your team.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium text-sm"
        >
          <Plus className="w-4 h-4" />
          Add New Team Member
        </button>
      </div>

      {/* Managers Table */}
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#1E1E1E] text-[#8A8A8A]">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Email</th>
                <th className="px-6 py-4 font-medium">Access Level</th>
                <th className="px-6 py-4 font-medium">Added On</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A2A2A]">
              {managers.map((manager) => (
                <tr key={manager.id} className="hover:bg-[#1A1A1A] transition-colors">
                  <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2A2A2A] flex items-center justify-center font-bold text-xs uppercase text-[#FF6B00]">
                      {manager.full_name?.charAt(0) || manager.email.charAt(0)}
                    </div>
                    {manager.full_name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 text-[#D4D4D4]">{manager.email}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1A1A1A] border border-[#2A2A2A] w-max text-xs font-medium">
                      {roleIcons[manager.role]}
                      <span className="capitalize">{roleLabels[manager.role] || manager.role}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-[#8A8A8A]">
                    {new Date(manager.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-[#8A8A8A] hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors" title="Delete is disabled in this demo">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {managers.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-[#8A8A8A]">
                    No team members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-[#2A2A2A]">
              <h2 className="text-xl font-bold">Add Team Member</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-[#8A8A8A] hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddManager} className="p-6 space-y-4">
              {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}
              {success && <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">{success}</div>}
              
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#D4D4D4]">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#D4D4D4]">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-[#D4D4D4]">Access Level (Role)</label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A8A8A]" />
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none"
                  >
                    <option value="admin">Admin (Full access except Managers)</option>
                    <option value="store_manager">Store Manager (Products, Orders, etc.)</option>
                    <option value="website_manager">Website Manager (Content, Gallery, etc.)</option>
                    <option value="super_admin">Super Admin (Full Access)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2.5 rounded-lg border border-[#2A2A2A] hover:bg-[#1E1E1E] text-white transition-colors text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {submitting ? "Adding..." : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
