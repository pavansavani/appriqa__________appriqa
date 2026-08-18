"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, ShoppingCart, Heart, Star, Sparkles, AlertCircle, 
  ChevronDown, ChevronRight, X, Eye, Package, Download,
  Shield, Truck, Award, Check, ZoomIn, Loader2
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { DURATION, EASE } from "@/lib/motion";

// ─── Constants ───────────────────────────────────────────────
const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "all", label: "All" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

// ─── Format INR ───────────────────────────────────────────────
function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

// ─── Quick View Modal ─────────────────────────────────────────
function QuickViewModal({ 
  product, 
  onClose,
  relatedProducts
}: { 
  product: Product; 
  onClose: () => void;
  relatedProducts: Product[];
}) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      thumbnail: product.thumbnail,
      type: product.type
    }, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="bg-[#0f0f11] border border-border/80 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="bg-secondary/10 border border-border/60 rounded-xl aspect-square flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-radial from-primary/5 to-transparent" />
                <img
                  src={product.images[activeImageIdx] || product.thumbnail}
                  alt={product.name}
                  className="object-contain max-h-full max-w-full p-6 drop-shadow-2xl relative z-10"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImageIdx(i)}
                      className={`aspect-square border rounded-lg p-1.5 bg-card hover:bg-white/5 flex items-center justify-center transition-all ${
                        activeImageIdx === i ? "border-primary shadow-md shadow-primary/10" : "border-border"
                      }`}
                    >
                      <img src={img} alt="" className="object-contain max-h-full max-w-full" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                  product.type === "digital" 
                    ? "bg-accent/15 border-accent/30 text-accent" 
                    : "bg-primary/10 border-primary/20 text-primary"
                }`}>
                  {product.type === "digital" ? "Digital Download" : "Physical"}
                </span>
                <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border border-border/50 bg-white/5 text-muted-foreground">
                  {product.categoryLabel}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-heading font-black text-foreground mb-3 leading-tight">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(product.rating || 5) ? "fill-primary" : "text-border"}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-foreground">{product.rating || 5}</span>
                <span className="text-xs text-muted-foreground">({product.reviews?.length || 0} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-4">
                <span className="text-2xl font-bold text-foreground">{formatINR(product.price)}</span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-sm text-muted-foreground line-through">{formatINR(product.compareAtPrice)}</span>
                    <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                      {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-3">
                {product.description}
              </p>

              {product.features && product.features.length > 0 && (
                <div className="mb-4">
                  <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Key Features</div>
                  <ul className="space-y-1.5">
                    {product.features.slice(0, 3).map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                        <Check className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className={`text-xs font-semibold mb-4 ${(product.stock || 0) > 0 ? "text-emerald-500" : "text-destructive"}`}>
                {(product.stock || 0) > 0 ? `✓ ${product.stock} in stock` : "✗ Out of Stock"}
              </div>

              <div className="space-y-3 mt-auto">
                {product.type === "physical" && (
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Qty:</span>
                    <div className="flex items-center gap-2 bg-secondary/20 border border-border rounded-lg">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-3 py-2 hover:bg-white/5 rounded-l-lg transition-colors text-foreground font-bold">−</button>
                      <span className="px-3 py-2 text-sm font-bold min-w-[2rem] text-center text-foreground">{quantity}</span>
                      <button onClick={() => setQuantity(q => Math.min(product.stock || 0, q + 1))} className="px-3 py-2 hover:bg-white/5 rounded-r-lg transition-colors text-foreground font-bold">+</button>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddToCart}
                    disabled={(product.stock || 0) <= 0}
                    className="flex-1 h-11 gap-2"
                  >
                    {added ? (
                      <><Check className="w-4 h-4" /> Added!</>
                    ) : (
                      <><ShoppingCart className="w-4 h-4" /> Add to Cart</>
                    )}
                  </Button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`w-11 h-11 rounded-lg border flex items-center justify-center transition-all ${
                      isInWishlist(product.id)
                        ? "bg-primary/10 border-primary/40 text-primary"
                        : "bg-secondary/20 border-border/60 text-foreground hover:border-primary/40 hover:text-primary"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? "fill-primary" : ""}`} />
                  </button>
                </div>
                <Link
                  href={`/store/${product.slug}`}
                  target="_blank"
                  className="flex items-center justify-center gap-2 text-xs font-semibold text-primary hover:underline"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                  View Full Details in New Tab
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border/40">
                <div className="flex flex-col items-center gap-1 text-center">
                  <Shield className="w-4 h-4 text-primary" />
                  <span className="text-[10px] text-muted-foreground">Secure Pay</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <Truck className="w-4 h-4 text-primary" />
                  <span className="text-[10px] text-muted-foreground">Fast Delivery</span>
                </div>
                <div className="flex flex-col items-center gap-1 text-center">
                  <Award className="w-4 h-4 text-primary" />
                  <span className="text-[10px] text-muted-foreground">Quality Assured</span>
                </div>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-border/40">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-4">Related Products</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {relatedProducts.slice(0, 3).map(rel => (
                  <div
                    key={rel.id}
                    className="bg-secondary/10 border border-border/60 rounded-xl p-3 flex gap-3 items-center hover:border-primary/40 transition-all cursor-pointer group"
                    onClick={() => {
                      onClose();
                      setTimeout(() => window.open(`/store/${rel.slug}`, "_blank"), 100);
                    }}
                  >
                    <div className="w-12 h-12 rounded-lg bg-card border border-border/60 flex items-center justify-center shrink-0 overflow-hidden">
                      <img src={rel.thumbnail} alt={rel.name} className="object-contain w-full h-full p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">{rel.name}</div>
                      <div className="text-xs text-primary font-bold mt-0.5">{formatINR(rel.price)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Product Card ─────────────────────────────────────────────
function ProductCard({ 
  product, 
  onQuickView
}: { 
  product: Product; 
  onQuickView: (product: Product) => void;
}) {
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [added, setAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      thumbnail: product.thumbnail,
      type: product.type
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="group bg-card border border-border hover:border-primary/40 rounded-xl overflow-hidden shadow-md hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 flex flex-col relative"
    >
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
        className="absolute top-3 right-3 z-10 p-2 rounded-full bg-[#121214]/70 hover:bg-[#121214]/95 border border-white/10 hover:border-primary/50 text-foreground transition-all"
        title={isInWishlist(product.id) ? "Remove from Wishlist" : "Save to Wishlist"}
      >
        <Heart 
          className={`w-4 h-4 transition-all ${
            isInWishlist(product.id) ? "fill-primary text-primary" : "text-foreground hover:text-primary"
          }`} 
        />
      </button>

      <div className="absolute top-3 left-3 z-10">
        <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
          product.type === "digital" 
            ? "bg-accent/15 border-accent/30 text-accent" 
            : "bg-primary/10 border-primary/20 text-primary"
        }`}>
          {product.type === "digital" ? "Digital" : "Physical"}
        </span>
      </div>

      <a 
        href={`/store/${product.slug}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="relative h-48 overflow-hidden bg-secondary/20 block"
      >
        <div className="w-full h-full relative group-hover:scale-105 transition-transform duration-700 ease-out flex items-center justify-center p-4">
          <img 
            src={product.thumbnail} 
            alt={product.name} 
            className="object-contain max-h-full max-w-full drop-shadow-lg" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent" />
      </a>

      <div className="p-5 flex-1 flex flex-col">
        <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5 flex justify-between items-center">
          <span>{product.subcategory}</span>
          <span className="flex items-center gap-1 text-foreground">
            <Star className="w-3 h-3 fill-primary text-primary" />
            <span>{product.rating || 5}</span>
          </span>
        </div>

        <h3 className="font-heading font-bold text-base mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-1">
          <a href={`/store/${product.slug}`} target="_blank" rel="noopener noreferrer">{product.name}</a>
        </h3>

        <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed mb-4 flex-1">
          {product.shortDescription}
        </p>

        <div className="mb-3">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">{formatINR(product.price)}</span>
            {product.compareAtPrice && (
              <span className="text-xs text-muted-foreground line-through">{formatINR(product.compareAtPrice)}</span>
            )}
            {product.compareAtPrice && (
              <span className="text-[10px] font-bold text-primary px-1.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
              </span>
            )}
          </div>
          <span className={`text-[10px] font-semibold ${(product.stock || 0) > 0 ? "text-emerald-500" : "text-destructive"}`}>
            {(product.stock || 0) > 0 ? `${product.stock} in stock` : "Out of Stock"}
          </span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onQuickView(product)}
            className="flex-1 flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg border border-border/60 bg-secondary/20 hover:bg-white/5 hover:border-primary/40 text-xs font-semibold text-foreground hover:text-primary transition-all"
          >
            <Eye className="w-3.5 h-3.5" />
            Quick View
          </button>
          <Button
            onClick={handleAddToCart}
            disabled={(product.stock || 0) <= 0}
            size="sm"
            className={`flex-1 h-9 px-3 gap-1.5 text-xs ${added ? "bg-emerald-600 hover:bg-emerald-600" : ""}`}
          >
            {added ? (
              <><Check className="w-3.5 h-3.5" /> Added!</>
            ) : (
              <><ShoppingCart className="w-3.5 h-3.5" />{product.type === "digital" ? "Download" : "Add to Cart"}</>
            )}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
export function ProductCatalog({ initialCategory = "all", initialSearchQuery = "" }: { initialCategory?: string, initialSearchQuery?: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, label: string, subcategories: string[]}[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [priceRange, setPriceRange] = useState<number>(200000);
  const [sortBy, setSortBy] = useState("featured");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Pagination & Recently Viewed
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 30;
  const [recentlyVisited, setRecentlyVisited] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch("/api/public/products"),
          fetch("/api/public/categories")
        ]);
        
        const prodData = await prodRes.json();
        const catData = await catRes.json();
        
        if (prodData.products) setProducts(prodData.products);
        if (catData.categories) setCategories(catData.categories);
      } catch (err) {
        console.error("Failed to fetch store data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();

    // Load recently visited
    try {
      const stored = localStorage.getItem('appriqa_recently_visited');
      if (stored) {
        setRecentlyVisited(JSON.parse(stored));
      }
    } catch (e) {
      // ignore
    }
  }, []);

  // Update URL params when search query or category changes (optional, but good for keeping URL in sync)
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, selectedSubcategory, priceRange, sortBy]);

  const dynamicSubcategories = useMemo(() => {
    const list = new Set<string>();
    products.forEach(p => {
      if (activeCategory === "all" || p.category === activeCategory) {
        if (p.subcategory) list.add(p.subcategory);
      }
    });
    return Array.from(list);
  }, [activeCategory, products]);

  const handleCategoryChange = useCallback((catId: string) => {
    setActiveCategory(catId);
    setSelectedSubcategory("all");
    setExpandedCategory(catId === "all" ? null : catId);
  }, []);

  const maxPrice = useMemo(() => {
    if (products.length === 0) return 200000;
    const prices = products.map(p => p.price);
    return Math.ceil(Math.max(...prices) * 1.1);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCategory = activeCategory === "all" || p.category === activeCategory;
      const matchesSubcategory = selectedSubcategory === "all" || p.subcategory === selectedSubcategory;
      const matchesSearch = !searchQuery || 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
      const matchesPrice = p.price <= priceRange;
      return matchesCategory && matchesSubcategory && matchesSearch && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "rating") return (b.rating || 5) - (a.rating || 5);
      if (sortBy === "newest") return b.id.toString().localeCompare(a.id.toString());
      return (b.rating || 5) * (b.compareAtPrice ? 1.1 : 1) - (a.rating || 5) * (a.compareAtPrice ? 1.1 : 1);
    });
  }, [activeCategory, selectedSubcategory, searchQuery, priceRange, sortBy, products]);

  const quickViewRelated = useMemo(() => {
    if (!quickViewProduct) return [];
    return products.filter(p => 
      p.category === quickViewProduct.category && p.id !== quickViewProduct.id
    ).slice(0, 3);
  }, [quickViewProduct, products]);

  // Paginate filtered products
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Track quick view as recently visited
  useEffect(() => {
    if (quickViewProduct) {
      setRecentlyVisited(prev => {
        const filtered = prev.filter(p => p.id !== quickViewProduct.id);
        const newVisited = [quickViewProduct, ...filtered].slice(0, 10);
        localStorage.setItem('appriqa_recently_visited', JSON.stringify(newVisited));
        return newVisited;
      });
    }
  }, [quickViewProduct]);

  const resetFilters = () => {
    setActiveCategory("all");
    setSelectedSubcategory("all");
    setPriceRange(maxPrice);
    setSearchQuery("");
    setSortBy("featured");
    setExpandedCategory(null);
  };

  return (
    <div className="pt-4">
      <div className="container mx-auto px-4 md:px-6 py-8">
        
        {/* Mobile Filters Toggle */}
        <div className="lg:hidden mb-6">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-between"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
          >
            <span className="font-bold">Filters & Categories</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showMobileFilters ? "rotate-180" : ""}`} />
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className={`w-full lg:w-64 shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`}>
            <div className="sticky top-32 space-y-6 bg-card lg:bg-transparent p-4 lg:p-0 rounded-xl lg:rounded-none border lg:border-none border-border">

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Categories</label>
                <div className="space-y-1">
                  {categories.map(cat => (
                    <div key={cat.id}>
                      <button
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`w-full flex items-center justify-between text-sm py-2 px-3 rounded-lg transition-colors ${
                          activeCategory === cat.id
                            ? "bg-primary/10 text-primary font-bold border border-primary/20"
                            : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                        }`}
                      >
                        <span>{cat.label}</span>
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${
                            activeCategory === cat.id ? "rotate-180" : ""
                          }`} />
                        )}
                      </button>
                      <AnimatePresence>
                        {activeCategory === cat.id && cat.id !== "all" && dynamicSubcategories.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-3 mt-1 space-y-1 border-l border-primary/20 ml-3 overflow-hidden"
                          >
                            <button
                              onClick={() => setSelectedSubcategory("all")}
                              className={`block w-full text-left text-xs py-1.5 px-2 rounded-md transition-colors ${
                                selectedSubcategory === "all"
                                  ? "text-primary font-bold bg-primary/5"
                                  : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                              }`}
                            >
                              All {cat.label}
                            </button>
                            {dynamicSubcategories.map(sub => (
                              <button
                                key={sub}
                                onClick={() => setSelectedSubcategory(sub)}
                                className={`block w-full text-left text-xs py-1.5 px-2 rounded-md transition-colors ${
                                  selectedSubcategory === sub
                                    ? "text-primary font-bold bg-primary/5"
                                    : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                }`}
                              >
                                {sub}
                              </button>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Sort By</label>
                <div className="space-y-1">
                  {SORT_OPTIONS.map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSortBy(opt.value)}
                      className={`block w-full text-left text-sm py-1.5 px-3 rounded-lg transition-colors ${
                        sortBy === opt.value
                          ? "bg-primary/10 text-primary font-bold border border-primary/20"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Max Price</label>
                  <span className="text-sm font-bold text-primary">{formatINR(priceRange)}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max={maxPrice}
                  step="100"
                  value={priceRange}
                  onChange={e => setPriceRange(Number(e.target.value))}
                  className="w-full accent-primary bg-secondary/20 rounded-lg appearance-none h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground">
                  <span>₹100</span>
                  <span>{formatINR(maxPrice)}+</span>
                </div>
              </div>

              <button
                onClick={resetFilters}
                className="w-full text-xs font-semibold py-2.5 px-4 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:bg-white/5 hover:border-primary/30 transition-all"
              >
                Reset All Filters
              </button>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div className="text-sm text-muted-foreground">
                <span className="font-bold text-foreground">{filteredProducts.length}</span> products found
              </div>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24">
                <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading products from database...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-24 bg-card border border-border border-dashed rounded-xl">
                <AlertCircle className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-bold mb-2">No Products Found</h3>
                <p className="text-muted-foreground text-sm max-w-sm mb-6">
                  No products match your current filters. Try adjusting your search or category.
                </p>
                <Button onClick={resetFilters}>Clear All Filters</Button>
              </div>
            ) : (
              <>
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
                >
                  <AnimatePresence mode="popLayout">
                    {paginatedProducts.map(prod => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onQuickView={setQuickViewProduct}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12 pt-8 border-t border-border/60">
                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.max(1, prev - 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === 1}
                      className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center gap-1 mx-4">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                          key={page}
                          onClick={() => {
                            setCurrentPage(page);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-semibold transition-all ${
                            currentPage === page 
                              ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
                              : "bg-card border border-border hover:bg-white/5"
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setCurrentPage(prev => Math.min(totalPages, prev + 1));
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 rounded-lg bg-card border border-border text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/5 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                )}

                {/* Recently Visited Items */}
                {recentlyVisited.length > 0 && (
                  <div className="mt-20 pt-10 border-t border-border/80">
                    <h3 className="text-xl font-bold font-heading mb-6 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Recently Visited Items
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {recentlyVisited.slice(0, 4).map(prod => (
                        <ProductCard
                          key={prod.id}
                          product={prod}
                          onQuickView={setQuickViewProduct}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            onClose={() => setQuickViewProduct(null)}
            relatedProducts={quickViewRelated}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
