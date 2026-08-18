"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  company_name: string | null;
}

export default function AccountProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    company_name: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", user.id)
      .single();

    if (data) {
      setProfile(data);
      setFormData({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        company_name: data.company_name || "",
      });
    }
    setLoading(false);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        first_name: formData.first_name,
        last_name: formData.last_name,
        full_name: `${formData.first_name} ${formData.last_name}`.trim(),
        company_name: formData.company_name,
      })
      .eq("auth_user_id", user.id);

    if (error) {
      setMessage("Failed to update profile.");
      console.error(error);
    } else {
      setMessage("Profile updated successfully.");
      setIsEditing(false);
      fetchProfile();
    }
  };

  if (loading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted rounded w-1/4"></div>
      <div className="h-40 bg-muted rounded w-full"></div>
    </div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border/50 rounded-2xl p-6 md:p-8 shadow-sm"
    >
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">My Profile</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your personal information</p>
        </div>
        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      {message && (
        <div className={`p-4 rounded-xl mb-6 text-sm font-semibold ${message.includes("success") ? "bg-emerald-500/10 text-emerald-500" : "bg-destructive/10 text-destructive"}`}>
          {message}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleUpdate} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-colors"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-colors"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider block">Company Name (Optional)</label>
            <input
              type="text"
              value={formData.company_name}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              className="w-full bg-background border border-border rounded-xl py-3 px-4 outline-none focus:border-primary transition-colors"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit">Save Changes</Button>
            <Button type="button" variant="outline" onClick={() => { setIsEditing(false); setMessage(""); }}>Cancel</Button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 max-w-2xl">
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Full Name</p>
            <p className="text-foreground font-medium text-lg">{profile?.first_name} {profile?.last_name}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Company</p>
            <p className="text-foreground font-medium text-lg">{profile?.company_name || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Email</p>
            <p className="text-foreground font-medium text-lg">{profile?.email || "—"}</p>
          </div>
          <div>
            <p className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-1">Phone</p>
            <p className="text-foreground font-medium text-lg">{profile?.phone || "—"}</p>
          </div>
        </div>
      )}
    </motion.div>
  );
}
