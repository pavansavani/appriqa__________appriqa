"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, ShieldCheck, CheckCircle2, MapPin, Plus, Lock, Cpu, Loader2 } from "lucide-react";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";

function formatINR(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart, clearCart, getCartSubtotal, getDiscountAmount, getShippingFee, getTaxAmount, getCartTotal, coupon
  } = useCart();

  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [paymentProcessing, setPaymentProcessing] = useState(false);

  const isDigitalOnly = useMemo(() => {
    if (cart.length === 0) return false;
    return cart.every((item: any) => item.type === "digital");
  }, [cart]);

  useEffect(() => {
    setIsClient(true);
    checkAuthAndFetchData();
  }, []);

  const checkAuthAndFetchData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      router.push("/login?redirect=/checkout");
      return;
    }
    setUser(session.user);

    const { data: addressData } = await supabase
      .from("addresses")
      .select("*")
      .eq("user_id", session.user.id)
      .order("is_default", { ascending: false });

    if (addressData) {
      setAddresses(addressData);
      if (addressData.length > 0) {
        setSelectedAddressId(addressData[0].id);
      }
    }
    setLoading(false);
  };

  const handlePayNow = async () => {
    if (!selectedAddressId && !isDigitalOnly) {
      alert("Please select a delivery address.");
      return;
    }
    
    setPaymentProcessing(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const createRes = await fetch("/api/checkout/create", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session?.access_token}` 
        },
        body: JSON.stringify({
          addressId: selectedAddressId,
          cartItems: cart,
          subtotal: getCartSubtotal(),
          discount: getDiscountAmount(),
          shippingFee: getShippingFee(),
          tax: getTaxAmount(),
          total: getCartTotal()
        })
      });
      
      const createData = await createRes.json();
      if (!createRes.ok) throw new Error(createData.error);
      
      const dbOrderId = createData.orderId;
      const rzpOrderId = createData.rzpOrderId;
      
      const simulatePaymentSuccess = async () => {
        const verifyRes = await fetch("/api/checkout/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            orderId: dbOrderId,
            razorpay_order_id: rzpOrderId,
            razorpay_payment_id: "pay_mock_" + Math.random().toString(36).substring(7),
            razorpay_signature: "mock_signature"
          })
        });
        
        if (verifyRes.ok) {
          setOrderId(dbOrderId);
          setOrderConfirmed(true);
          clearCart();
        } else {
          alert("Payment verification failed.");
        }
      };
      
      setTimeout(() => {
        simulatePaymentSuccess();
        setPaymentProcessing(false);
      }, 2000);
      
    } catch (e: any) {
      alert("Checkout Error: " + e.message);
      setPaymentProcessing(false);
    }
  };

  if (!isClient) return null;

  if (loading) {
    return (
      <div className="pt-32 pb-20 flex flex-col items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-muted-foreground font-semibold">Loading secure checkout...</p>
      </div>
    );
  }

  if (cart.length === 0 && !orderConfirmed) {
    return (
      <div className="pt-32 pb-20 flex flex-col items-center justify-center text-center">
        <h2 className="text-3xl font-heading font-black mb-4">No Items to Checkout</h2>
        <p className="text-muted-foreground mb-8">Please add items to your cart before proceeding.</p>
        <Button asChild>
          <Link href="/store">Browse Products</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="pt-20">
      <Section>
        {!orderConfirmed && (
          <div className="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div>
              <h1 className="text-3xl font-heading font-black mb-2 text-foreground">Secure Checkout</h1>
              <p className="text-muted-foreground text-sm flex items-center gap-1.5"><Lock className="w-4 h-4 text-primary"/> End-to-end encrypted</p>
            </div>
            <div className="text-sm font-bold text-muted-foreground">Logged in as: <span className="text-foreground">{user?.email || user?.phone}</span></div>
          </div>
        )}

        <div className="max-w-6xl mx-auto">
          <AnimatePresence mode="wait">
            {!orderConfirmed ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                
                {/* Left Side: Address Selection */}
                <div className="lg:col-span-7 space-y-6">
                  {!isDigitalOnly && (
                    <div className="bg-card border border-border/80 p-8 rounded-2xl shadow-xl">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-heading font-bold text-foreground">Delivery Address</h2>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/account/addresses" target="_blank"><Plus className="w-4 h-4 mr-1.5" /> Manage</Link>
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {addresses.length === 0 ? (
                          <div className="text-center py-8 border border-dashed border-border/50 rounded-xl">
                            <MapPin className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                            <p className="text-muted-foreground text-sm font-medium mb-4">No addresses found</p>
                            <Button asChild size="sm">
                              <Link href="/account/addresses">Create Address</Link>
                            </Button>
                          </div>
                        ) : (
                          addresses.map((addr) => (
                            <div 
                              key={addr.id} 
                              onClick={() => setSelectedAddressId(addr.id)}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                                selectedAddressId === addr.id 
                                  ? "border-primary bg-primary/5 shadow-md" 
                                  : "border-border/50 hover:border-primary/50"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${selectedAddressId === addr.id ? "border-primary" : "border-muted-foreground"}`}>
                                  {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 bg-primary rounded-full" />}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-bold text-foreground">{addr.full_name}</span>
                                    <span className="text-[10px] uppercase font-bold bg-muted px-2 py-0.5 rounded text-muted-foreground">{addr.address_type}</span>
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                                    {addr.address_line_1}, {addr.city}, {addr.state} {addr.postal_code}
                                  </p>
                                  <p className="text-sm font-medium text-foreground mt-1">Phone: {addr.phone}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                  
                  {isDigitalOnly && (
                    <div className="bg-primary/5 border border-primary/20 p-6 rounded-xl">
                      <p className="text-primary font-bold">Digital Products Only</p>
                      <p className="text-sm text-muted-foreground mt-1">No shipping address required. Download links will be provided after successful payment.</p>
                    </div>
                  )}
                </div>

                {/* Right Side: Order Summary */}
                <div className="lg:col-span-5">
                  <div className="bg-card border border-border/80 rounded-2xl shadow-xl overflow-hidden sticky top-24">
                    <div className="p-6 bg-muted/30 border-b border-border/40">
                      <h2 className="text-lg font-heading font-bold text-foreground">Order Summary</h2>
                    </div>
                    
                    <div className="p-6 space-y-6">
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {cart.map((item: any) => (
                          <div key={item.id} className="flex gap-4">
                            <div className="w-16 h-16 rounded-lg bg-muted border border-border/50 overflow-hidden shrink-0">
                              <img src={item.thumbnail} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-bold text-sm text-foreground leading-tight mb-1">{item.name}</h4>
                              {item.type === "digital" && (
                                <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-1.5 py-0.5 rounded mb-1">
                                  Digital
                                </span>
                              )}
                              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-sm text-foreground">{formatINR(item.price * item.quantity)}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-3 pt-6 border-t border-border/40 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>Subtotal</span>
                          <span className="font-medium text-foreground">{formatINR(getCartSubtotal())}</span>
                        </div>
                        {getDiscountAmount() > 0 && (
                          <div className="flex justify-between text-emerald-500">
                            <span>Discount {coupon && `(${coupon.code})`}</span>
                            <span className="font-medium">-{formatINR(getDiscountAmount())}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-muted-foreground">
                          <span>Shipping</span>
                          <span className="font-medium text-foreground">{getShippingFee() === 0 ? "Free" : formatINR(getShippingFee())}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Estimated Tax</span>
                          <span className="font-medium text-foreground">{formatINR(getTaxAmount())}</span>
                        </div>
                        
                        <div className="flex justify-between text-lg font-bold text-foreground pt-3 border-t border-border/40 mt-3">
                          <span>Total</span>
                          <span>{formatINR(getCartTotal())}</span>
                        </div>
                      </div>

                      <Button 
                        onClick={handlePayNow} 
                        disabled={paymentProcessing || (!selectedAddressId && !isDigitalOnly)}
                        className="w-full h-14 text-base font-bold gap-2 shadow-[0_10px_30px_rgba(255,106,0,0.2)]"
                      >
                        {paymentProcessing ? (
                          <> <Loader2 className="w-5 h-5 animate-spin"/> Processing...</>
                        ) : (
                          <>Pay Securely <ArrowRight className="w-5 h-5" /></>
                        )}
                      </Button>
                      
                      <div className="flex items-center justify-center gap-2 text-xs font-semibold text-muted-foreground mt-4">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" /> Secure SSL Encrypted Checkout
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Success View */
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto bg-card border border-emerald-500/30 p-10 md:p-14 rounded-3xl shadow-[0_20px_50px_rgba(16,185,129,0.1)] text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-400 to-emerald-600" />
                <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: "spring", stiffness: 200 }}>
                    <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                  </motion.div>
                </div>
                
                <h2 className="text-3xl font-heading font-black text-foreground mb-4">Payment Successful!</h2>
                <p className="text-muted-foreground text-lg mb-8">
                  Thank you for your order. We are processing it right away.
                </p>
                
                <div className="bg-background rounded-2xl p-6 border border-border mb-8 max-w-sm mx-auto text-left">
                  <div className="flex justify-between items-center pb-4 border-b border-border/50">
                    <span className="text-sm font-semibold text-muted-foreground">Order ID</span>
                    <span className="font-bold text-foreground font-mono">{orderId}</span>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button asChild variant="outline" className="h-12 px-8 font-bold">
                    <Link href="/account/orders">View My Orders</Link>
                  </Button>
                  <Button asChild className="h-12 px-8 font-bold">
                    <Link href="/store">Continue Shopping</Link>
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Section>
    </div>
  );
}

