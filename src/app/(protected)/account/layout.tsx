"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { 
  User, MapPin, Package, Heart, ShoppingCart, 
  Download, FileText, MessageSquare, Shield, LogOut 
} from "lucide-react";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  const navItems = [
    { name: "Profile", href: "/account", icon: User },
    { name: "My Orders", href: "/account/orders", icon: Package },
    { name: "My Addresses", href: "/account/addresses", icon: MapPin },
    { name: "Wishlist", href: "/wishlist", icon: Heart },
    { name: "Cart", href: "/cart", icon: ShoppingCart },
    { name: "Digital Downloads", href: "/account/downloads", icon: Download },
    { name: "Service Requests", href: "/account/services", icon: FileText },
    { name: "My Queries", href: "/account/queries", icon: MessageSquare },
    { name: "Security", href: "/account/security", icon: Shield },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-card border border-border/50 rounded-2xl p-4 sticky top-24 shadow-[0_0_30px_rgba(255,106,0,0.03)]">
            <h2 className="font-heading font-bold text-lg mb-4 px-3 text-foreground">My Account</h2>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm ${
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors font-medium text-sm text-destructive hover:bg-destructive/10 mt-4"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
