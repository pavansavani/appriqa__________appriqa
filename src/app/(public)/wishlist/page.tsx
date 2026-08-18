"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  ArrowRight,
  ZoomIn
} from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { DURATION, EASE, VARIANTS } from "@/lib/motion";

export default function WishlistPage() {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/public/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products || []);
        }
      } catch (err) {
        console.error("Failed to fetch products for wishlist", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const wishlistProducts = products.filter(p => wishlist.includes(p.id.toString()) || wishlist.includes(p.id as string));

  return (
    <div className="pt-20">
      <Section className="pb-20">
        <SectionHeader
          title="Your Wishlist"
          subtitle="All the items you've liked. Ready to add them to your cart?"
        />

        <div className="mt-12">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : wishlistProducts.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card border border-border rounded-2xl p-12 text-center max-w-2xl mx-auto shadow-2xl"
            >
              <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-heading font-bold mb-4">Your wishlist is empty</h3>
              <p className="text-muted-foreground mb-8">
                Looks like you haven't liked any products yet. Browse our catalog and click the heart icon on any product to save it here.
              </p>
              <Link href="/store">
                <Button size="lg" className="gap-2">
                  Browse Products <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {wishlistProducts.map(product => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: DURATION.fast, ease: EASE.standard }}
                    className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col group relative"
                  >
                    <button
                      onClick={() => toggleWishlist(product.id)}
                      className="absolute top-4 right-4 z-10 w-10 h-10 bg-background/80 backdrop-blur-md rounded-full flex items-center justify-center border border-border text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors shadow-lg"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <Link href={`/products/${product.slug}`} className="relative h-64 overflow-hidden block bg-secondary/10">
                      <img 
                        src={product.thumbnail} 
                        alt={product.name} 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-6">
                        <span className="flex items-center gap-2 text-sm font-semibold text-white bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
                          <ZoomIn className="w-4 h-4" /> View Details
                        </span>
                      </div>
                    </Link>

                    <div className="p-6 flex flex-col flex-1">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <Link href={`/products/${product.slug}`} className="hover:text-primary transition-colors">
                          <h3 className="text-xl font-bold line-clamp-2">{product.name}</h3>
                        </Link>
                      </div>
                      
                      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
                        {product.categoryLabel}
                      </div>

                      <div className="flex items-end gap-3 mb-6">
                        <span className="text-2xl font-bold text-primary">₹{product.price.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
                        {product.compareAtPrice && product.compareAtPrice > product.price && (
                          <span className="text-sm font-semibold text-muted-foreground line-through mb-1">
                            ₹{product.compareAtPrice.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                          </span>
                        )}
                      </div>

                      <div className="mt-auto pt-4 border-t border-border/40">
                        <Button 
                          onClick={() => addToCart(product, 1)} 
                          className="w-full h-12 gap-2 text-base font-bold"
                          disabled={(product.stock || 0) <= 0}
                        >
                          <ShoppingCart className="w-5 h-5" />
                          {(product.stock || 0) > 0 ? "Add to Cart" : "Out of Stock"}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
}

