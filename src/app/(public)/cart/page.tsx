"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingBag, Trash2, ArrowRight, Percent, Check, AlertCircle, ShieldCheck } from "lucide-react";
import { Section, SectionHeader } from "@/components/layout/Section";
import { Button, buttonVariants } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    applyCoupon, 
    removeCoupon,
    coupon, 
    couponError,
    getCartSubtotal,
    getDiscountAmount,
    getShippingFee,
    getTaxAmount,
    getCartTotal
  } = useCart();

  const [couponCode, setCouponCode] = useState("");
  const [couponSuccess, setCouponSuccess] = useState(false);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode) return;
    const success = applyCoupon(couponCode);
    setCouponSuccess(success);
    if (success) {
      setCouponCode("");
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setCouponSuccess(false);
  };

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 bg-secondary/20 text-muted-foreground rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-heading font-black mb-4">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-8 max-w-sm">
          Looks like you haven't added any items to your shopping cart yet. Let's explore our engineering catalog!
        </p>
        <Link href="/store" className={buttonVariants({ size: "lg" })}>
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Section className="pb-6">
        <SectionHeader 
          title="Your Shopping Cart" 
          subtitle="Review your selected hardware products, kits, and digital designs before proceeding to checkout."
        />
      </Section>

      <Section className="pt-0">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-card border border-border/80 rounded-2xl overflow-hidden divide-y divide-border/60">
              {cart.map(item => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center gap-6">
                  {/* Thumbnail */}
                  <Link href={`/products/${item.slug}`} className="w-20 h-20 shrink-0 bg-secondary/15 rounded-lg flex items-center justify-center p-2 border border-border/40">
                    <img src={item.thumbnail} alt={item.name} className="object-contain max-h-full max-w-full drop-shadow" />
                  </Link>

                  {/* Details */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                      {item.type === "digital" ? "Digital Download" : "Physical Product"}
                    </span>
                    <h3 className="font-heading font-bold text-lg text-foreground hover:text-primary transition-colors truncate mt-0.5">
                      <Link href={`/products/${item.slug}`}>{item.name}</Link>
                    </h3>
                    <span className="text-sm font-semibold text-primary mt-1 block">{formatINR(item.price)} each</span>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex items-center bg-background border border-border rounded-lg h-10">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 text-muted-foreground hover:text-foreground font-bold"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-foreground">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 text-muted-foreground hover:text-foreground font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[80px] text-center sm:text-right">
                    <span className="text-base font-bold text-foreground block">{formatINR(item.price * item.quantity)}</span>
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 border border-transparent hover:border-destructive/20 rounded-lg transition-all"
                    title="Remove item"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Shop Guarantee */}
            <div className="flex flex-col sm:flex-row items-center gap-4 p-4 border border-border bg-primary/5 rounded-2xl">
              <ShieldCheck className="w-10 h-10 text-primary shrink-0" />
              <div className="text-center sm:text-left text-xs">
                <strong className="text-foreground block mb-0.5">Secure Checkout Guaranteed</strong>
                <span className="text-muted-foreground">Every purchase is protected with enterprise-grade encryption. Digital goods are delivered instantly. Physical items are tracked via Shiprocket.</span>
              </div>
            </div>
          </div>

          {/* Cart Summary Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-card border border-border/80 p-6 rounded-2xl shadow-xl">
              <h3 className="text-lg font-heading font-bold text-foreground mb-6">Order Summary</h3>
              
              {/* Calculations */}
              <div className="space-y-4 text-sm mb-6 border-b border-border/40 pb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-semibold">{formatINR(getCartSubtotal())}</span>
                </div>

                {coupon && (
                  <div className="flex justify-between text-emerald-500 font-semibold bg-emerald-500/5 border border-emerald-500/10 p-2 rounded-lg">
                    <span className="flex items-center gap-1">
                      <Percent className="w-3.5 h-3.5" />
                      <span>Discount ({coupon.code})</span>
                    </span>
                    <span>-{formatINR(getDiscountAmount())}</span>
                  </div>
                )}

                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-foreground font-semibold">
                    {getShippingFee() === 0 ? (
                      <span className="text-emerald-500 font-bold uppercase text-xs">Free Shipping</span>
                    ) : (
                      formatINR(getShippingFee())
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-foreground font-semibold">{formatINR(getTaxAmount())}</span>
                </div>
              </div>

              {/* Promo Code Input */}
              <div className="mb-6">
                {coupon ? (
                  <div className="flex items-center justify-between bg-secondary/15 border border-border/60 px-3 py-2 rounded-lg text-xs">
                    <span className="font-semibold text-foreground">Code Applied: <strong className="text-primary">{coupon.code}</strong></span>
                    <button onClick={handleRemoveCoupon} className="text-destructive font-bold hover:underline">Remove</button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="space-y-2">
                    <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider block">Promo Code</label>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        placeholder="WELCOME10" 
                        value={couponCode}
                        onChange={e => setCouponCode(e.target.value)}
                        className="bg-background border border-border rounded-lg px-3 py-2 text-xs outline-none focus:border-primary flex-1 text-foreground"
                      />
                      <Button type="submit" size="sm" variant="outline" className="text-xs font-semibold h-9">Apply</Button>
                    </div>
                    {couponError && (
                      <span className="text-[10px] text-destructive font-bold flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3" /> {couponError}
                      </span>
                    )}
                    <span className="text-[9px] text-muted-foreground block mt-1">
                      Tip: Use <strong className="text-foreground">WELCOME10</strong> for 10% off. Use <strong className="text-foreground">DEEPTECH25</strong> for 25% off (orders &gt;₹500).
                    </span>
                  </form>
                )}
              </div>

              {/* Total */}
              <div className="flex justify-between items-baseline mb-6 pt-2 border-t border-border/40">
                <span className="text-base font-bold text-foreground">Total</span>
                <span className="text-2xl font-brand font-black text-primary">{formatINR(getCartTotal())}</span>
              </div>

              {/* Checkout Trigger */}
              <Button asChild size="lg" className="w-full h-12 text-sm font-bold gap-2">
                <Link href="/checkout">
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

