"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, ShoppingCart, Heart, Star, Shield, 
  Truck, ArrowRight, CheckCircle2, ChevronRight,
  Download, Award, Settings, BookOpen, Layers, Check
} from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { PRODUCTS } from "@/data/products";
import { Product } from "@/types";
import { useCart } from "@/context/CartContext";
import { DURATION, EASE, VARIANTS } from "@/lib/motion";
import { motion } from "framer-motion";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { slug } = use(params);
  const { addToCart, toggleWishlist, isInWishlist } = useCart();
  const [activeTab, setActiveTab] = useState("overview");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Find product by slug
  const product = useMemo(() => {
    return PRODUCTS.find(p => p.slug === slug);
  }, [slug]);

  // Find related products in the same category
  const relatedProducts = useMemo(() => {
    if (!product) return [];
    return PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
  }, [product]);

  if (!product) {
    return (
      <div className="pt-32 pb-20 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-heading font-black mb-4">Product Not Found</h2>
        <p className="text-muted-foreground mb-8">The product you are looking for does not exist or has been removed.</p>
        <Button asChild>
          <Link href="/store">Back to Store</Link>
        </Button>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      thumbnail: product.thumbnail,
      type: product.type
    }, quantity);
  };

  return (
    <div className="pt-20">
      {/* Breadcrumbs */}
      <div className="bg-secondary/5 border-b border-border/40 py-3.5">
        <div className="container mx-auto px-4 md:px-6 flex items-center gap-2 text-xs text-muted-foreground">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/store" className="hover:text-primary transition-colors">Products</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-foreground font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <Section>
        {/* Back Link */}
        <Link href="/store" className="inline-flex items-center gap-2 text-sm text-primary font-semibold hover:underline mb-8">
          <ArrowLeft className="w-4 h-4" /> Back to Store
        </Link>

        {/* Core Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-card border border-border/80 rounded-2xl p-8 aspect-square flex items-center justify-center relative overflow-hidden group shadow-lg">
              {/* Product Glow */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] bg-primary/5 rounded-full blur-[60px]" />
              
              <img 
                src={product.images[activeImageIndex] || product.thumbnail} 
                alt={product.name} 
                className="object-contain max-h-full max-w-full drop-shadow-2xl relative z-10 transition-transform duration-500 group-hover:scale-105" 
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`aspect-square border rounded-lg p-2 bg-card hover:bg-white/5 flex items-center justify-center transition-all ${
                      activeImageIndex === index ? "border-primary shadow-md shadow-primary/10" : "border-border"
                    }`}
                  >
                    <img src={img} alt="" className="object-contain max-h-full max-w-full" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Actions and Core Info */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div>
              <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-md border mb-4 ${
                product.type === "digital" 
                  ? "bg-accent/15 border-accent/30 text-accent" 
                  : "bg-primary/10 border-primary/20 text-primary"
              }`}>
                {product.type === "digital" ? "Digital File (3D Printed Design)" : "Physical Product"}
              </span>

              <h1 className="text-3xl md:text-5xl font-heading font-black text-foreground mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating) ? "fill-primary" : "text-border"
                      }`} 
                    />
                  ))}
                </div>
                <span className="text-sm font-bold text-foreground">{product.rating}</span>
                <span className="text-xs text-muted-foreground">({product.reviews?.length || 0} customer reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4 mb-6">
                <span className="text-3xl font-bold text-foreground">{formatINR(product.price)}</span>
                {product.compareAtPrice && (
                  <>
                    <span className="text-lg text-muted-foreground line-through">{formatINR(product.compareAtPrice)}</span>
                    <span className="text-xs font-bold text-primary px-2 py-0.5 rounded-full bg-primary/10 border border-primary/20">
                      {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="text-muted-foreground leading-relaxed text-base mb-8">
                {product.description}
              </p>

              {/* Special Attributes Row */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8 p-4 bg-secondary/10 border border-border/60 rounded-xl">
                {product.type === "digital" ? (
                  <>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">File Format</span>
                      <span className="block text-sm font-semibold mt-0.5 text-foreground">{product.fileFormat}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">File Size</span>
                      <span className="block text-sm font-semibold mt-0.5 text-foreground">{product.fileSize}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">License</span>
                      <span className="block text-sm font-semibold mt-0.5 text-foreground truncate" title={product.license}>{product.license}</span>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Availability</span>
                      <span className={`block text-sm font-bold mt-0.5 ${(product.stock || 0) > 0 ? "text-emerald-500" : "text-destructive"}`}>
                        {(product.stock || 0) > 0 ? "In Stock" : "Out of Stock"}
                      </span>
                    </div>
                    {product.skillLevel && (
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Skill Level</span>
                        <span className="block text-sm font-semibold mt-0.5 text-foreground">{product.skillLevel}</span>
                      </div>
                    )}
                    {product.ageRecommendation && (
                      <div>
                        <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Ages</span>
                        <span className="block text-sm font-semibold mt-0.5 text-foreground">{product.ageRecommendation}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Cart controls */}
            <div className="space-y-4 pt-6 border-t border-border/40">
              <div className="flex flex-wrap gap-4 items-center">
                {(product.stock || 0) > 0 && (
                  <div className="flex items-center bg-card border border-border rounded-lg h-12">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="px-4 text-muted-foreground hover:text-foreground text-lg font-bold"
                    >
                      -
                    </button>
                    <span className="w-12 text-center text-sm font-bold text-foreground">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => Math.min(product.stock || 0, q + 1))}
                      className="px-4 text-muted-foreground hover:text-foreground text-lg font-bold"
                    >
                      +
                    </button>
                  </div>
                )}

                <Button
                  onClick={handleAddToCart}
                  disabled={(product.stock || 0) <= 0}
                  className="flex-1 h-12 gap-2 text-sm font-bold"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </Button>

                <button
                  onClick={() => toggleWishlist(product.id)}
                  className={`h-12 w-12 rounded-lg border flex items-center justify-center transition-all ${
                    isInWishlist(product.id)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:bg-white/5 text-muted-foreground"
                  }`}
                  title={isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? "fill-primary" : ""}`} />
                </button>
              </div>

              {product.type === "digital" ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Download className="w-4 h-4 text-primary shrink-0" />
                  <span>Instant download available after secure checkout. No shipping required.</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Truck className="w-4 h-4 text-primary shrink-0" />
                  <span>Free shipping on orders above ₹150. Deployed via Shiprocket tracking.</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tabbed Content */}
        <div className="mb-16">
          <div className="flex border-b border-border/60 gap-8 mb-8 overflow-x-auto scrollbar-none">
            {["overview", "specifications", "reviews"].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-3 text-sm font-semibold capitalize relative transition-all whitespace-nowrap ${
                  activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <motion.div 
                    layoutId="activeTabIndicator" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" 
                  />
                )}
              </button>
            ))}
          </div>

          <div className="bg-card border border-border/80 p-8 rounded-2xl min-h-[200px]">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-heading font-bold text-foreground mb-4">Key Features</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {product.features?.map((feat, i) => (
                      <li key={i} className="flex items-start gap-3 text-muted-foreground">
                        <Check className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {product.learningOutcomes && (
                  <div className="pt-4">
                    <h3 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      STEM Learning Outcomes
                    </h3>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {product.learningOutcomes.map((out, i) => (
                        <li key={i} className="flex items-start gap-3 text-muted-foreground">
                          <Award className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                          <span>{out}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {product.components && product.components.length > 0 && (
                  <div className="pt-4">
                    <h3 className="text-xl font-heading font-bold text-foreground mb-4 flex items-center gap-2">
                      <Layers className="w-5 h-5 text-primary" />
                      What's Included in the Box
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {product.components.map((comp, i) => (
                        <span key={i} className="px-3 py-1.5 bg-background border border-border rounded-lg text-xs font-semibold text-foreground">
                          {comp}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === "specifications" && (
              <div>
                <h3 className="text-xl font-heading font-bold text-foreground mb-6">Technical Specifications</h3>
                <div className="border border-border/60 rounded-xl overflow-hidden divide-y divide-border/40">
                  {Object.entries(product.specifications || {}).map(([key, value]) => (
                    <div key={key} className="grid grid-cols-3 p-4 bg-secondary/5 text-sm">
                      <div className="font-bold text-muted-foreground col-span-1">{key}</div>
                      <div className="text-foreground col-span-2 font-medium">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 justify-between">
                  <h3 className="text-xl font-heading font-bold text-foreground">Customer Feedback</h3>
                  <div className="text-sm font-bold text-foreground bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>{product.rating} average rating</span>
                  </div>
                </div>

                <div className="divide-y divide-border/40 space-y-6">
                  {product.reviews?.map(rev => (
                    <div key={rev.id} className="pt-6 first:pt-0">
                      <div className="flex justify-between items-start gap-4 mb-2">
                        <div>
                          <div className="font-semibold text-foreground flex items-center gap-2">
                            <span>{rev.author}</span>
                            {rev.verified && (
                              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">{rev.date}</span>
                        </div>
                        <div className="flex items-center text-primary">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-3.5 h-3.5 ${
                                i < rev.rating ? "fill-primary" : "text-border"
                              }`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-muted-foreground text-sm leading-relaxed">{rev.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-heading font-black text-foreground mb-8">Related Items</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map(prod => (
                <div
                  key={prod.id}
                  className="group bg-card border border-border hover:border-primary/40 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col relative"
                >
                  {/* Image */}
                  <Link href={`/products/${prod.slug}`} className="relative h-44 overflow-hidden bg-secondary/20 flex items-center justify-center p-4">
                    <img 
                      src={prod.thumbnail} 
                      alt={prod.name} 
                      className="object-contain max-h-full max-w-full drop-shadow-md group-hover:scale-105 transition-transform duration-500" 
                    />
                  </Link>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">{prod.subcategory}</span>
                      <h3 className="font-heading font-bold text-base mb-2 text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        <Link href={`/products/${prod.slug}`}>{prod.name}</Link>
                      </h3>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-border/40 mt-3">
                      <span className="font-bold text-foreground">{formatINR(prod.price)}</span>
                      <Link href={`/products/${prod.slug}`} className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
                        View Details <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
