"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, BarChart, FileOutput, Activity, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const analyticsLinks = [
  { name: "Analytics", href: "/admin/analytics/overview", icon: BarChart },
  { name: "Reports", href: "/admin/analytics/reports", icon: FileOutput },
  { name: "Audit Logs", href: "/admin/analytics/audit-logs", icon: Activity },
];

export default function AnalyticsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A]">
      {/* Workspace Header */}
      <header className="h-14 border-b border-[#2A2A2A] bg-[#141414] flex items-center px-4 shrink-0 justify-between">
        <Link 
          href="/admin/dashboard" 
          title="Back"
          className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#2A2A2A] text-[#8A8A8A] hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-white font-medium ml-4 hidden md:flex items-center gap-2">
          Analytics & Reporting
        </span>
        
        {/* Mobile menu toggle */}
        <button 
          className="md:hidden text-[#8A8A8A] hover:text-white ml-auto p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Secondary Sidebar */}
        <aside 
          className={cn(
            "w-64 border-r border-[#2A2A2A] bg-[#141414] flex flex-col shrink-0 absolute md:relative z-20 h-full transition-transform duration-300 ease-in-out",
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-[#2A2A2A]">
            <ul className="space-y-1 px-2">
              {analyticsLinks.map((link) => {
                const isActive = pathname.startsWith(link.href);
                const Icon = link.icon;
                return (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2.5 rounded-lg transition-colors text-sm font-medium",
                        isActive 
                          ? "bg-[#FF6B00]/10 text-[#FF6B00]" 
                          : "text-[#D4D4D4] hover:bg-[#1E1E1E] hover:text-white"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 flex-shrink-0 mr-3", isActive ? "text-[#FF6B00]" : "text-[#8A8A8A]")} />
                      {link.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Mobile overlay */}
        {mobileMenuOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-10 md:hidden" 
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Workspace Content */}
        <main className="flex-1 overflow-y-auto bg-[#0A0A0A] p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
