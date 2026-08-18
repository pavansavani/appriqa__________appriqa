"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface CartItem {
  id: string | number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  thumbnail: string;
  type: "physical" | "digital";
}

interface Coupon {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder?: number;
}

interface CartContextType {
  cart: CartItem[];
  wishlist: (string | number)[];
  coupon: Coupon | null;
  couponError: string | null;
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  toggleWishlist: (id: string | number) => void;
  isInWishlist: (id: string | number) => boolean;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  getCartSubtotal: () => number;
  getDiscountAmount: () => number;
  getShippingFee: () => number;
  getTaxAmount: () => number;
  getCartTotal: () => number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const AVAILABLE_COUPONS: Coupon[] = [
  { code: "WELCOME10", type: "percentage", value: 10 },
  { code: "DEEPTECH25", type: "percentage", value: 25, minOrder: 500 },
  { code: "FLAT50", type: "fixed", value: 50, minOrder: 200 },
];

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<(string | number)[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart and wishlist from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("appriqa_cart");
    const savedWishlist = localStorage.getItem("appriqa_wishlist");
    
    // UUID regex to clear out old mock data
    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        const validCart = parsedCart.filter((item: any) => isUUID(item.id.toString()));
        setCart(validCart);
      } catch (e) {
        console.error(e);
      }
    }
    if (savedWishlist) {
      try {
        const parsedWishlist = JSON.parse(savedWishlist);
        const validWishlist = parsedWishlist.filter((id: any) => isUUID(id.toString()));
        setWishlist(validWishlist);
      } catch (e) {
        console.error(e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage when it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("appriqa_cart", JSON.stringify(cart));
    }
  }, [cart, isLoaded]);

  // Save wishlist to localStorage when it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("appriqa_wishlist", JSON.stringify(wishlist));
    }
  }, [wishlist, isLoaded]);

  const addToCart = (item: Omit<CartItem, "quantity">, quantity: number = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((i) => i.id === item.id);
      if (existingItem) {
        return prevCart.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...prevCart, { ...item, quantity }];
    });
  };

  const removeFromCart = (id: string | number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
  };

  const toggleWishlist = (id: string | number) => {
    const stringId = id.toString();
    setWishlist((prevWishlist) => {
      const stringifiedPrev = prevWishlist.map(i => i.toString());
      if (stringifiedPrev.includes(stringId)) {
        return stringifiedPrev.filter((itemId) => itemId !== stringId);
      }
      return [...stringifiedPrev, stringId];
    });
  };

  const isInWishlist = (id: string | number) => {
    const stringId = id.toString();
    return wishlist.some(i => i.toString() === stringId);
  };

  const applyCoupon = (code: string): boolean => {
    const uppercaseCode = code.toUpperCase().trim();
    const foundCoupon = AVAILABLE_COUPONS.find((c) => c.code === uppercaseCode);

    if (!foundCoupon) {
      setCouponError("Invalid coupon code.");
      setCoupon(null);
      return false;
    }

    const subtotal = getCartSubtotal();
    if (foundCoupon.minOrder && subtotal < foundCoupon.minOrder) {
      setCouponError(`Minimum order value of ₹${foundCoupon.minOrder} required for this coupon.`);
      setCoupon(null);
      return false;
    }

    setCoupon(foundCoupon);
    setCouponError(null);
    return true;
  };

  const removeCoupon = () => {
    setCoupon(null);
    setCouponError(null);
  };

  const getCartSubtotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getDiscountAmount = () => {
    if (!coupon) return 0;
    const subtotal = getCartSubtotal();
    if (coupon.type === "percentage") {
      return (subtotal * coupon.value) / 100;
    } else {
      return Math.min(coupon.value, subtotal);
    }
  };

  const getShippingFee = () => {
    const hasPhysical = cart.some((item) => item.type === "physical");
    if (!hasPhysical) return 0; // Digital products have free shipping
    const subtotal = getCartSubtotal();
    if (subtotal >= 150) return 0; // Free shipping above ₹150
    return 15; // Flat ₹15 shipping rate
  };

  const getTaxAmount = () => {
    const subtotal = getCartSubtotal();
    const discount = getDiscountAmount();
    // 8% tax rate applied to subtotal after discount
    return Math.max(0, (subtotal - discount) * 0.08);
  };

  const getCartTotal = () => {
    const subtotal = getCartSubtotal();
    const discount = getDiscountAmount();
    const shipping = getShippingFee();
    const tax = getTaxAmount();
    return Math.max(0, subtotal - discount + shipping + tax);
  };

  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        coupon,
        couponError,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleWishlist,
        isInWishlist,
        applyCoupon,
        removeCoupon,
        getCartSubtotal,
        getDiscountAmount,
        getShippingFee,
        getTaxAmount,
        getCartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
