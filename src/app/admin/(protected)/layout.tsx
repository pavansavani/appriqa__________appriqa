"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { 
  LayoutDashboard, ShoppingCart, Package, Tags, Archive, Users, ShieldCheck, Star, 
  Ticket, CreditCard, Truck, Download, MessageSquare, Mail, Lightbulb, Briefcase, 
  HelpCircle, FileText, Image as ImageIcon, FileSpreadsheet, BarChart, FileOutput, 
  Settings, Activity, Menu, X, LogOut, Bell, Info, LayoutTemplate
} from "lucide-react";
import { Button } from "@/components/ui/button";

const sidebarLinks = [
  { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { name: "E-Commerce", href: "/admin/ecommerce/orders", icon: ShoppingCart },
  { name: "Website Editor", href: "/admin/website-editor/home", icon: LayoutTemplate },
  { name: "Team", href: "/admin/managers", icon: ShieldCheck },
  { name: "Communication", href: "/admin/communication/queries", icon: MessageSquare },
  { name: "Analytics", href: "/admin/analytics/overview", icon: BarChart },
];

const getFilteredLinks = (role: string) => {
  return sidebarLinks.filter(link => {
    if (role === "super_admin") return true;
    if (role === "admin") return true;
    if (role === "store_manager") {
      const storeLinks = ["Dashboard", "E-Commerce", "Analytics"];
      return storeLinks.includes(link.name);
    }
    if (role === "website_manager") {
      const webLinks = ["Dashboard", "Website Editor", "Communication"];
      return webLinks.includes(link.name);
    }
    return false;
  });
};

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  const isWorkspace = ['/admin/ecommerce', '/admin/website-editor', '/admin/communication', '/admin/analytics'].some(p => pathname.startsWith(p));

  useEffect(() => {
    setSidebarOpen(!isWorkspace);
  }, [isWorkspace]);

  useEffect(() => {
    async function checkAuth() {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        router.push("/login");
        return;
      }
      
      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("auth_user_id", user.id)
        .single();
        
      if (profileError || !["super_admin", "admin", "store_manager", "website_manager"].includes(userProfile?.role)) {
        router.push("/login");
        return;
      }
      
      setProfile(userProfile);
      setLoading(false);
    }
    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="animate-pulse w-12 h-12 rounded-full bg-[#FF6B00]/50" />
      </div>
    );
  }

  const filteredLinks = getFilteredLinks(profile?.role || "");

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col md:flex-row text-white font-sans">
      {/* Sidebar */}
      <aside 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${(isSidebarOpen || isHovered) ? "w-64" : "w-20"} transition-all duration-300 bg-[#141414] border-r border-[#2A2A2A] flex flex-col hidden md:flex h-screen sticky top-0 z-50`}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#2A2A2A] overflow-hidden whitespace-nowrap">
          {(isSidebarOpen || isHovered) ? (
            <span className="font-bold text-lg tracking-wider text-[#FF6B00]">APPRIQA</span>
          ) : (
            <span className="font-bold text-lg tracking-wider text-[#FF6B00] mx-auto">A</span>
          )}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="text-[#8A8A8A] hover:text-white shrink-0">
            <Menu className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-[#2A2A2A]">
          <ul className="space-y-1 px-2">
            {filteredLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const Icon = link.icon;
              return (
                <li key={link.name}>
                  <Link 
                    href={link.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${isActive ? 'bg-[#FF6B00]/10 text-[#FF6B00]' : 'text-[#D4D4D4] hover:bg-[#1E1E1E] hover:text-white'}`}
                  >
                    <Icon className={`w-5 h-5 flex-shrink-0 ${(isSidebarOpen || isHovered) ? '' : 'mx-auto'} ${isActive ? 'text-[#FF6B00]' : 'text-[#8A8A8A]'}`} />
                    {(isSidebarOpen || isHovered) && <span className="ml-3 text-sm font-medium whitespace-nowrap">{link.name}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#2A2A2A] space-y-2">
          <Link 
            href="/admin/settings"
            className={`flex items-center w-full px-3 py-2 text-[#D4D4D4] hover:bg-[#1E1E1E] hover:text-white rounded-lg transition-colors ${!(isSidebarOpen || isHovered) && 'justify-center'}`}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {(isSidebarOpen || isHovered) && <span className="ml-3 text-sm font-medium whitespace-nowrap">Settings</span>}
          </Link>
          <button 
            onClick={handleLogout}
            className={`flex items-center w-full px-3 py-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors ${!(isSidebarOpen || isHovered) && 'justify-center'}`}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {(isSidebarOpen || isHovered) && <span className="ml-3 text-sm font-medium whitespace-nowrap">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-[#141414] border-b border-[#2A2A2A] flex items-center justify-between px-4 md:px-8 z-10 sticky top-0">
          <div className="flex items-center md:hidden">
            <span className="font-bold text-lg tracking-wider text-[#FF6B00]">APPRIQA</span>
          </div>
          <div className="flex items-center space-x-4 ml-auto">
            <span className="text-sm font-medium text-[#D4D4D4] capitalize hidden md:inline-block">
              {profile?.role.replace('_', ' ')}
            </span>
            <button className="text-[#8A8A8A] hover:text-white relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#FF6B00] rounded-full"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-center overflow-hidden">
              <span className="text-sm font-medium">A</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#0A0A0A] relative">
          {children}
        </main>
      </div>
    </div>
  );
}
