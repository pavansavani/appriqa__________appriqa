"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Menu, X, ChevronDown, User, ShoppingCart, Heart, Reply, Package, Truck, CheckCircle2, XCircle, RefreshCcw, FileText, Gift, Coins, Star, RefreshCw, HeadphonesIcon, LogOut, Settings, Search } from "lucide-react";
import { DURATION, EASE } from "@/lib/motion";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

const ORDER_LINKS = [
  { name: "Current Orders", icon: Package, href: "/dashboard/orders/current" },
  { name: "Track Order", icon: Truck, href: "/dashboard/orders/track" },
  { name: "Delivered Orders", icon: CheckCircle2, href: "/dashboard/orders/delivered" },
  { name: "Cancelled Orders", icon: XCircle, href: "/dashboard/orders/cancelled" },
  { name: "Returns & Refunds", icon: RefreshCcw, href: "/dashboard/orders/returns" },
  { name: "Invoices", icon: FileText, href: "/dashboard/orders/invoices" },
  { name: "Offers & Coupons", icon: Gift, href: "/dashboard/offers" },
  { name: "Cashback & Rewards", icon: Coins, href: "/dashboard/rewards" },
  { name: "Reviews & Ratings", icon: Star, href: "/dashboard/reviews" },
  { name: "Buy Again", icon: RefreshCw, href: "/dashboard/buy-again" },
  { name: "Order Support", icon: HeadphonesIcon, href: "/contact/support" }
];

const CATEGORIES = [
  { name: "3D Printers & Resins", href: "/store/category/3d-printing" },
  { name: "Robotics Kits & Motors", href: "/store/category/robotics" },
  { name: "IoT Sensors & Boards", href: "/store/category/iot" },
  { name: "AI Software Licenses", href: "/store/category/ai" },
  { name: "Enterprise CRM Modules", href: "/store/category/software" },
  { name: "Industrial Design Assets", href: "/store/category/design" },
];

export function StoreNavbar() {
  const { scrollY } = useScroll();
  const router = useRouter();
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const { cartCount, wishlist } = useCart();
  
  // Search State
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  
  // User State
  const [user, setUser] = useState<any>(null); 

  useEffect(() => {
    setIsClient(true);
    
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    const scrollSub = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });

    return () => {
      authListener.subscription.unsubscribe();
      scrollSub();
    };
  }, [scrollY]);

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    // Construct search URL
    const searchParams = new URLSearchParams({
      q: searchQuery.trim(),
      ...(selectedCategory !== "All Categories" && { category: selectedCategory })
    });
    
    router.push(`/products/search?${searchParams.toString()}`);
    setActiveMegaMenu(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled 
            ? "bg-[#18181b]/90 backdrop-blur-md border-border/80 shadow-lg" 
            : "bg-[#121214]/80 backdrop-blur-md border-border/40"
        )}
      >
        <div className="w-full px-4 md:px-8 lg:px-12 h-20 flex items-center justify-between gap-4 lg:gap-8">
          {/* Left Side: Back Icon & Logo */}
          <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
            <Link 
              href="/" 
              title="Back to Main Site"
              className="hidden md:flex items-center justify-center w-11 h-11 text-white hover:text-primary transition-colors bg-black rounded-2xl shadow-md border border-[#222] group"
            >
              <Reply className="w-5 h-5 group-hover:-translate-y-0.5 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            
            <Link href="/store" className="flex items-center gap-3 relative z-50 group">
              <img src="/logo/logo-main.png" alt="APPRIQA Logo" className="h-10 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform" />
              <div className="flex flex-col">
                <span className="font-brand font-black text-2xl tracking-widest text-foreground leading-none">APPRIQA</span>
                <span className="text-[11px] uppercase text-primary font-bold tracking-[0.2em] leading-none mt-1">Store</span>
              </div>
            </Link>
          </div>

          {/* Search Bar (Amazon Style) */}
          <div className="hidden xl:flex items-center flex-1 max-w-2xl group relative z-40">
            <div className="flex w-full bg-[#1A1A1A] rounded-full border border-[#333] group-hover:border-primary/50 transition-colors focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 shadow-inner">
              {/* Category Dropdown (Custom Animated) */}
              <div 
                className="relative flex items-center border-r border-[#333] bg-[#222] hover:bg-[#2A2A2A] transition-colors flex-shrink-0 cursor-pointer rounded-l-full"
                onMouseEnter={() => setActiveMegaMenu("search-category")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <div className="flex items-center pl-5 pr-8 py-3 text-sm text-foreground/80 font-medium max-w-[160px]">
                  <span className="truncate">{selectedCategory}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-foreground/50 absolute right-3" />
                </div>
                
                <AnimatePresence>
                  {activeMegaMenu === "search-category" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: DURATION.fast, ease: EASE.standard }}
                      className="absolute top-[calc(100%+8px)] left-0 w-56 bg-[#141414]/95 backdrop-blur-xl border border-[#2A2A2A] rounded-2xl shadow-2xl p-2 z-50"
                    >
                      <div className="flex flex-col max-h-[400px] overflow-y-auto">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCategory("All Categories");
                            setActiveMegaMenu(null);
                          }}
                          className={cn(
                            "text-left px-3 py-2.5 rounded-xl transition-colors text-sm font-medium mb-1",
                            selectedCategory === "All Categories" ? "bg-primary/10 text-primary font-bold" : "hover:bg-[#202020] hover:text-white text-foreground/80"
                          )}
                        >
                          All Categories
                        </button>
                        {CATEGORIES.map((cat, idx) => (
                          <button 
                            key={idx} 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedCategory(cat.name);
                              setActiveMegaMenu(null);
                            }}
                            className={cn(
                              "text-left px-3 py-2.5 rounded-xl transition-colors text-sm font-medium",
                              selectedCategory === cat.name ? "bg-primary/10 text-primary font-bold" : "hover:bg-[#202020] hover:text-white text-foreground/80"
                            )}
                          >
                            {cat.name}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Search Input */}
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search Appriqa Store..." 
                className="flex-1 bg-transparent px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              
              {/* Search Button */}
              <button 
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 flex items-center justify-center transition-colors rounded-r-full"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>



          {/* Right Side */}
          <div className="hidden lg:flex items-center gap-4 flex-shrink-0">
            {/* Auth State: Profile or Login */}
            {user ? (
              <div 
                className="relative group"
                onMouseEnter={() => setActiveMegaMenu("profile")}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <button className="flex items-center gap-2 text-sm font-semibold tracking-wide text-foreground/80 hover:text-primary transition-colors py-5">
                  {user.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url || user.user_metadata.picture} 
                      alt="Profile" 
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full border border-border/60 object-cover group-hover:border-primary/50 transition-all"
                    />
                  ) : (
                    <span className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-border/60 group-hover:border-primary/50 transition-all">
                      {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.user_metadata?.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || <User className="w-4 h-4" />}
                    </span>
                  )}
                  <span className="hidden xl:inline">Profile</span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-70" />
                </button>
                <AnimatePresence>
                  {activeMegaMenu === "profile" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: DURATION.fast, ease: EASE.standard }}
                      className="absolute top-full right-0 w-56 bg-[#141414]/95 backdrop-blur-xl border border-[#2A2A2A] rounded-2xl shadow-2xl p-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-[#2A2A2A] mb-1">
                        <p className="text-sm font-bold text-white">{user.user_metadata?.full_name || user.user_metadata?.first_name || "User"}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <Link href="/dashboard/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#202020] transition-colors text-sm text-foreground/90">
                        <Settings className="w-4 h-4 text-muted-foreground" /> Account Details
                      </Link>
                      <button onClick={async () => { await supabase.auth.signOut(); setUser(null); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#202020] transition-colors text-sm text-red-400">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                href={`/login?next=${encodeURIComponent(pathname)}`}
                className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-foreground/80 hover:text-primary transition-colors group"
              >
                <span className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                  <User className="w-4 h-4" />
                </span>
                <span className="hidden xl:inline">Login</span>
              </Link>
            )}

            {/* Wishlist */}
            <Link
              href="/wishlist"
              title="My Wishlist"
              className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-foreground/80 hover:text-primary transition-colors group relative"
            >
              <span className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                <Heart className="w-4 h-4" />
              </span>
              {isClient && wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            
            {/* Cart */}
            <Link
              href="/cart"
              className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-foreground/80 hover:text-primary transition-colors group relative"
            >
              <span className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                <ShoppingCart className="w-4 h-4" />
              </span>
              {isClient && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
              <span className="hidden xl:inline">Cart</span>
            </Link>
            
            {/* Orders Dropdown */}
            <div 
              className="relative group"
              onMouseEnter={() => setActiveMegaMenu("orders")}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-foreground/80 hover:text-primary transition-colors group py-5">
                <span className="w-9 h-9 rounded-full border border-border/60 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                  <Package className="w-4 h-4" />
                </span>
                <span className="hidden xl:inline">Orders</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 transition-opacity" />
              </button>
              
              <AnimatePresence>
                {activeMegaMenu === "orders" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: DURATION.fast, ease: EASE.standard }}
                    className="absolute top-full right-0 w-64 bg-[#141414]/95 backdrop-blur-xl border border-[#2A2A2A] rounded-2xl shadow-2xl p-2 z-50 overflow-hidden"
                  >
                    <div className="flex flex-col">
                      {ORDER_LINKS.map((link, idx) => {
                        const Icon = link.icon;
                        return (
                          <Link 
                            key={link.name} 
                            href={link.href}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#202020] transition-colors group/item",
                              idx === 6 && "mt-1 border-t border-[#2A2A2A] pt-3"
                            )}
                          >
                            <Icon className="w-4 h-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                            <span className="text-sm font-medium text-foreground/90 group-hover/item:text-white transition-colors">
                              {link.name}
                            </span>
                          </Link>
                        )
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <button 
            className="lg:hidden relative z-50 p-3 -mr-3"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.header>

      {/* Spacer for fixed main header */}
      <div className="h-20 w-full" />

      {/* Secondary Category Bar (Non-Fixed) */}
      <div className="w-full bg-[#171719] border-b border-[#2A2A2A] hidden md:block">
        <div className="w-full px-4 md:px-8 lg:px-12 h-10 flex items-center gap-6 overflow-x-auto custom-scrollbar whitespace-nowrap">
          <Link href="/store" className="flex items-center gap-2 text-sm font-bold text-foreground hover:text-primary transition-colors">
            <Menu className="w-4 h-4" /> All
          </Link>
          
          {CATEGORIES.map((cat, idx) => (
            <Link 
              key={idx} 
              href={cat.href}
              className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors"
            >
              {cat.name}
            </Link>
          ))}
          
          <Link href="/store/customization" className="text-sm font-medium text-foreground/80 hover:text-primary transition-colors ml-auto">
            Customization
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: DURATION.fast, ease: EASE.standard }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg pt-24 pb-12 px-6 lg:hidden overflow-y-auto"
          >
            <div className="flex flex-col gap-8 text-lg">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 text-primary py-2">
                <Reply className="w-5 h-5" /> Back to Main Site
              </Link>
              
              <div className="pt-6 border-t border-border flex flex-col gap-4">
                <Link href="/store" onClick={() => setMobileMenuOpen(false)} className="py-2 text-foreground/80 hover:text-primary">Home</Link>
                <div className="py-2 text-foreground/80 font-bold">Categories</div>
                <div className="pl-4 border-l-2 border-border/50 flex flex-col gap-2">
                  {CATEGORIES.map(cat => (
                    <Link key={cat.name} href={cat.href} onClick={() => setMobileMenuOpen(false)} className="py-2 text-base text-foreground/70 hover:text-primary">
                      {cat.name}
                    </Link>
                  ))}
                </div>
                <Link href="/store/customization" onClick={() => setMobileMenuOpen(false)} className="py-2 text-foreground/80 hover:text-primary">Customization</Link>
              </div>

              <div className="pt-6 border-t border-border flex flex-col gap-4">
                {user ? (
                  <Link href="/dashboard/profile" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 py-2">
                    {user.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url || user.user_metadata.picture} 
                        alt="Profile" 
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-full border border-border/60 object-cover"
                      />
                    ) : (
                      <span className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center bg-primary/10 text-primary font-bold">
                        {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.user_metadata?.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                      </span>
                    )}
                    My Profile
                  </Link>
                ) : (
                  <Link href={`/login?next=${encodeURIComponent(pathname)}`} onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 py-2">
                    <User className="w-5 h-5" /> Login
                  </Link>
                )}
                
                <Link href="/wishlist" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 py-2">
                  <Heart className="w-5 h-5" /> Wishlist
                </Link>
                <Link href="/cart" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-4 py-2 relative">
                  <ShoppingCart className="w-5 h-5" /> Cart
                  {isClient && cartCount > 0 && (
                    <span className="ml-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </Link>
              </div>

              <div className="pt-4 border-t border-border">
                <div className="font-semibold text-muted-foreground text-sm uppercase tracking-wider mb-4">My Orders</div>
                <div className="grid grid-cols-1 gap-2">
                  {ORDER_LINKS.map(link => {
                    const Icon = link.icon;
                    return (
                      <Link 
                        key={link.name} 
                        href={link.href} 
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center gap-3 py-2 text-base text-foreground/80 hover:text-primary transition-colors"
                      >
                        <Icon className="w-4 h-4" /> {link.name}
                      </Link>
                    )
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

