"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Menu, X, ChevronDown, User, Phone, ShoppingCart, Heart, Cuboid, Bot, Code2, Factory, Brain } from "lucide-react";
import { DURATION, EASE } from "@/lib/motion";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { StoreNavbar } from "@store/components/layout/StoreNavbar";
import { supabase } from "@/lib/supabase";

const SOLUTIONS = [
  {
    name: "3D Designing & Printing",
    description: "Industrial-grade additive manufacturing and custom 3D modeling.",
    icon: Cuboid,
    href: "/solutions/3d-designing-and-printing"
  },
  {
    name: "Software Solutions",
    description: "High-performance distributed systems and cloud infrastructure.",
    icon: Code2,
    href: "/solutions/software-solutions"
  },
  {
    name: "AI Solutions",
    description: "Machine learning, computer vision, and predictive maintenance models.",
    icon: Brain,
    href: "/solutions/ai-solutions"
  },
  {
    name: "Robotics Prototyping",
    description: "Autonomous systems, robotic arms, and custom mechatronics.",
    icon: Bot,
    href: "/solutions/robotics-prototyping"
  },
  {
    name: "Product Designing and Development",
    description: "End-to-end engineering from concept sketch to market-ready product.",
    icon: Factory,
    href: "/solutions/product-designing-and-development"
  }
];

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const { cartCount, wishlist } = useCart();

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

  // Route check for store navbar (MUST BE AFTER ALL HOOKS)
  if (
    pathname.startsWith("/store") || 
    pathname.startsWith("/cart") || 
    pathname.startsWith("/checkout") || 
    pathname.startsWith("/dashboard")
  ) {
    return <StoreNavbar />;
  }

  return (
    <>
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-transparent",
          isScrolled 
            ? "bg-[#18181b]/90 backdrop-blur-md border-border/80 shadow-lg" 
            : "bg-[#121214]/60 backdrop-blur-sm"
        )}
      >
        <div className="container mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-4 relative z-50 group">
            <img src="/logo/logo-main.png" alt="APPRIQA Logo" className="h-12 w-auto object-contain drop-shadow-md group-hover:scale-105 transition-transform" />
            <span className="font-brand font-black text-2xl tracking-widest text-foreground">APPRIQA</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-base font-semibold tracking-wide hover:text-primary transition-colors">Home</Link>
            
            <div 
              className="relative group"
              onMouseEnter={() => setActiveMegaMenu("solutions")}
              onMouseLeave={() => setActiveMegaMenu(null)}
            >
              <button className="flex items-center gap-1 text-base font-semibold tracking-wide hover:text-primary transition-colors py-5">
                Solutions <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {activeMegaMenu === "solutions" && (
                  <MegaMenu title="Solutions" items={SOLUTIONS} basePath="/solutions" />
                )}
              </AnimatePresence>
            </div>

            {/* Products - simple clickable link, opens in new tab as requested */}
            <Link href="/store" target="_blank" rel="noopener noreferrer" className="text-base font-semibold tracking-wide hover:text-primary transition-colors flex items-center gap-1">
              Products <span className="text-[10px] uppercase bg-primary/20 text-primary px-1.5 py-0.5 rounded-sm font-bold tracking-widest ml-1">Store</span>
            </Link>

            <Link href="/projects" className="text-base font-semibold tracking-wide hover:text-primary transition-colors">Projects</Link>
            <Link href="/about" className="text-base font-semibold tracking-wide hover:text-primary transition-colors">About</Link>
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            {/* Login / Account */}
            {user ? (
              <Link
                href="/account"
                className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-foreground/80 hover:text-primary transition-colors group"
              >
                {user.user_metadata?.avatar_url ? (
                  <img 
                    src={user.user_metadata.avatar_url || user.user_metadata.picture} 
                    alt="Profile" 
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full border border-border/60 object-cover group-hover:border-primary/50 transition-all"
                  />
                ) : (
                  <span className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center bg-primary/10 text-primary font-bold group-hover:border-primary/50 transition-all">
                    {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.user_metadata?.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || <User className="w-3.5 h-3.5" />}
                  </span>
                )}
                <span>Account</span>
              </Link>
            ) : (
              <Link
                href={`/login?next=${encodeURIComponent(pathname)}`}
                className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-foreground/80 hover:text-primary transition-colors group"
              >
                <span className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                  <User className="w-3.5 h-3.5" />
                </span>
                <span>Login</span>
              </Link>
            )}
            {/* Wishlist */}
            <Link
              href="/wishlist"
              title="My Wishlist"
              className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-foreground/80 hover:text-primary transition-colors group relative"
            >
              <span className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                <Heart className="w-3.5 h-3.5" />
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
              <span className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                <ShoppingCart className="w-3.5 h-3.5" />
              </span>
              {isClient && cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
              <span>Cart</span>
            </Link>
            {/* Contact */}
            <Link
              href="/contact"
              className="flex items-center gap-1.5 text-sm font-semibold tracking-wide text-foreground/80 hover:text-primary transition-colors group"
            >
              <span className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                <Phone className="w-3.5 h-3.5" />
              </span>
              <span>Contact</span>
            </Link>
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
              <Link href="/" className="py-2 hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <div className="space-y-4">
                <div className="font-semibold text-muted-foreground text-sm uppercase tracking-wider">Solutions</div>
                <div className="grid grid-cols-1 gap-2 pl-4">
                  {SOLUTIONS.map(s => (
                    <Link key={s.name} href={s.href} onClick={() => setMobileMenuOpen(false)} className="py-2 text-base text-foreground/80 hover:text-primary transition-colors font-medium">
                      {s.name}
                    </Link>
                  ))}
                </div>
              </div>
              <Link href="/store" className="py-2 hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Products</Link>
              <Link href="/projects" className="py-2 hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>Projects</Link>
              <Link href="/about" className="py-2 hover:text-primary transition-colors" onClick={() => setMobileMenuOpen(false)}>About</Link>
              <div className="pt-8 border-t border-border flex flex-col gap-4">
                {user ? (
                  <Link
                    href="/account"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 py-2 text-foreground/80 hover:text-primary transition-colors text-base font-semibold group"
                  >
                    {user.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url || user.user_metadata.picture} 
                        alt="Profile" 
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full border border-border/60 object-cover group-hover:border-primary/50 transition-all"
                      />
                    ) : (
                      <span className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center bg-primary/10 text-primary font-bold group-hover:border-primary/50 transition-all">
                        {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.user_metadata?.first_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || <User className="w-5 h-5" />}
                      </span>
                    )}
                    My Account
                  </Link>
                ) : (
                  <Link
                    href={`/login?next=${encodeURIComponent(pathname)}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-4 py-2 text-foreground/80 hover:text-primary transition-colors text-base font-semibold group"
                  >
                    <span className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                      <User className="w-5 h-5" />
                    </span>
                    Login
                  </Link>
                )}
                <Link
                  href="/wishlist"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 py-2 text-foreground/80 hover:text-primary transition-colors text-base font-semibold group relative"
                >
                  <span className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                    <Heart className="w-5 h-5" />
                  </span>
                  Wishlist {isClient && wishlist.length > 0 && <span className="ml-2 bg-primary text-primary-foreground px-2 py-0.5 rounded-full text-xs">{wishlist.length}</span>}
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 py-2 text-foreground/80 hover:text-primary transition-colors text-base font-semibold group"
                >
                  <span className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all relative">
                    <ShoppingCart className="w-5 h-5" />
                    {isClient && cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </span>
                  Cart
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 py-2 text-foreground/80 hover:text-primary transition-colors text-base font-semibold group"
                >
                  <span className="w-10 h-10 rounded-full border border-border/60 flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/5 transition-all">
                    <Phone className="w-5 h-5" />
                  </span>
                  Contact & Queries
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function MegaMenu({ title, items, basePath }: { title: string, items: typeof SOLUTIONS, basePath: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: DURATION.fast, ease: EASE.standard }}
      className="absolute top-full left-[-5rem] w-[550px] bg-[#141414]/80 backdrop-blur-md border border-[#2A2A2A] rounded-2xl shadow-2xl p-4"
    >
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1A1A1A]/90 border border-transparent hover:border-[#2A2A2A] transition-all duration-300 group"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-[#202020]/80 border border-[#3A3A3A] flex items-center justify-center group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors duration-300 shadow-sm">
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
              </div>
              <div className="font-semibold text-foreground group-hover:text-primary transition-colors duration-300 text-sm">
                {item.name}
              </div>
            </Link>
          );
        })}
      </div>
      <div className="mt-4 pt-4 border-t border-[#2A2A2A]">
        <Link href={basePath} className="text-sm text-primary font-medium hover:underline flex items-center gap-1 group w-max">
          View all {title.toLowerCase()} 
          <span className="group-hover:translate-x-1 transition-transform">&rarr;</span>
        </Link>
      </div>
    </motion.div>
  );
}

