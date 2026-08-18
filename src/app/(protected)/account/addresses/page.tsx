"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { MapPin, Plus, Trash2, Edit2, CheckCircle2 } from "lucide-react";

interface Address {
  id: string;
  full_name: string;
  phone: string;
  address_line_1: string;
  address_line_2: string | null;
  landmark: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  address_type: string;
  is_default: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const initialForm = {
    full_name: "", phone: "", address_line_1: "", address_line_2: "",
    landmark: "", city: "", state: "", postal_code: "", country: "India", address_type: "home"
  };
  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { data, error } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", user.id)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });
    
    if (data) setAddresses(data);
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (editingId) {
      await supabase.from("addresses").update(formData).eq("id", editingId).eq("user_id", user.id);
    } else {
      await supabase.from("addresses").insert([{ ...formData, user_id: user.id, is_default: addresses.length === 0 }]);
    }
    
    setIsAdding(false);
    setEditingId(null);
    setFormData(initialForm);
    fetchAddresses();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("addresses").delete().eq("id", id);
    fetchAddresses();
  };

  const handleSetDefault = async (id: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    // Because of the DB trigger, setting one to true will set others to false automatically!
    await supabase.from("addresses").update({ is_default: true }).eq("id", id).eq("user_id", user.id);
    fetchAddresses();
  };

  if (loading) return <div className="animate-pulse space-y-4"><div className="h-40 bg-muted rounded w-full"></div></div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex justify-between items-center bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">My Addresses</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your delivery locations</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => { setIsAdding(true); setFormData(initialForm); }}>
            <Plus className="w-4 h-4 mr-2" /> Add New Address
          </Button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {(isAdding || editingId) && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-card border border-primary/20 rounded-2xl p-6 shadow-sm relative">
              <h2 className="text-lg font-bold mb-6">{editingId ? "Edit Address" : "Add New Address"}</h2>
              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Full Name</label>
                  <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full bg-background border rounded-lg py-2.5 px-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Phone Number</label>
                  <input required type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-background border rounded-lg py-2.5 px-3 text-sm" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Address Line 1 (House No, Building, Street)</label>
                  <input required type="text" value={formData.address_line_1} onChange={e => setFormData({...formData, address_line_1: e.target.value})} className="w-full bg-background border rounded-lg py-2.5 px-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Address Line 2 / Area (Optional)</label>
                  <input type="text" value={formData.address_line_2} onChange={e => setFormData({...formData, address_line_2: e.target.value})} className="w-full bg-background border rounded-lg py-2.5 px-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Landmark (Optional)</label>
                  <input type="text" value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})} className="w-full bg-background border rounded-lg py-2.5 px-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">City</label>
                  <input required type="text" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-background border rounded-lg py-2.5 px-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">State</label>
                  <input required type="text" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full bg-background border rounded-lg py-2.5 px-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">PIN Code</label>
                  <input required type="text" value={formData.postal_code} onChange={e => setFormData({...formData, postal_code: e.target.value})} className="w-full bg-background border rounded-lg py-2.5 px-3 text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase">Address Type</label>
                  <select value={formData.address_type} onChange={e => setFormData({...formData, address_type: e.target.value})} className="w-full bg-background border rounded-lg py-2.5 px-3 text-sm">
                    <option value="home">Home (All Day Delivery)</option>
                    <option value="office">Office (Delivery 10AM - 5PM)</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="md:col-span-2 flex gap-3 pt-4 border-t border-border/50">
                  <Button type="submit">Save Address</Button>
                  <Button type="button" variant="outline" onClick={() => { setIsAdding(false); setEditingId(null); }}>Cancel</Button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addresses.map(addr => (
          <div key={addr.id} className={`bg-card border rounded-2xl p-5 relative transition-all ${addr.is_default ? "border-primary/50 shadow-[0_0_20px_rgba(255,106,0,0.05)]" : "border-border/50"}`}>
            {addr.is_default && (
              <div className="absolute top-4 right-4 flex items-center text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Default
              </div>
            )}
            
            <div className="flex items-center gap-2 mb-3">
              <span className="uppercase text-[10px] font-bold tracking-wider bg-muted text-muted-foreground px-2 py-0.5 rounded">{addr.address_type}</span>
              <h3 className="font-bold text-foreground">{addr.full_name}</h3>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed mb-1">{addr.address_line_1}</p>
            {addr.address_line_2 && <p className="text-sm text-muted-foreground leading-relaxed mb-1">{addr.address_line_2}</p>}
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              {addr.city}, {addr.state} {addr.postal_code}<br/>
              Phone: <span className="font-medium text-foreground">{addr.phone}</span>
            </p>
            
            <div className="flex items-center gap-2 pt-4 border-t border-border/40">
              <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => {
                setEditingId(addr.id);
                setFormData({
                  full_name: addr.full_name, phone: addr.phone, address_line_1: addr.address_line_1,
                  address_line_2: addr.address_line_2 || "", landmark: addr.landmark || "",
                  city: addr.city, state: addr.state, postal_code: addr.postal_code,
                  country: addr.country, address_type: addr.address_type
                });
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}>
                <Edit2 className="w-3.5 h-3.5 mr-1.5" /> Edit
              </Button>
              <Button variant="ghost" size="sm" className="h-8 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleDelete(addr.id)}>
                <Trash2 className="w-3.5 h-3.5 mr-1.5" /> Delete
              </Button>
              {!addr.is_default && (
                <Button variant="ghost" size="sm" className="h-8 text-xs ml-auto text-muted-foreground" onClick={() => handleSetDefault(addr.id)}>
                  Set as Default
                </Button>
              )}
            </div>
          </div>
        ))}
        {addresses.length === 0 && !isAdding && (
          <div className="col-span-full py-12 text-center border border-dashed border-border/50 rounded-2xl bg-card">
            <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-1">No Addresses Found</h3>
            <p className="text-sm text-muted-foreground">Add an address to checkout quickly</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
