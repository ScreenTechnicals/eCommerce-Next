'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from "@/hooks/use-toast"

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  itemCount: number;
  applyCoupon: (code: string) => void;
  discount: number;
  cartTotalWithDiscount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const VALID_COUPONS = {
    'DISCOUNT10': 0.10,
    'SAVE20': 0.20,
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('cart', []);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const { toast } = useToast();

  const addToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { product, quantity }];
    });
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.id !== productId));
     toast({
      title: "Item removed",
      description: "The item has been removed from your cart.",
      variant: "destructive"
    })
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.product.id === productId ? { ...item, quantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setDiscount(0);
    setAppliedCoupon(null);
  };

  const cartTotal = cartItems.reduce((total, item) => total + item.product.price * item.quantity, 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  
  const applyCoupon = (code: string) => {
    const upperCaseCode = code.toUpperCase() as keyof typeof VALID_COUPONS;
    if (VALID_COUPONS[upperCaseCode]) {
        const discountRate = VALID_COUPONS[upperCaseCode];
        setDiscount(cartTotal * discountRate);
        setAppliedCoupon(upperCaseCode);
        toast({
            title: "Coupon Applied",
            description: `Successfully applied coupon "${upperCaseCode}".`,
        })
    } else {
        setDiscount(0);
        setAppliedCoupon(null);
        toast({
            title: "Invalid Coupon",
            description: "The coupon code you entered is not valid.",
            variant: "destructive",
        })
    }
  };
  
  const cartTotalWithDiscount = cartTotal - discount;


  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartTotal,
    itemCount,
    applyCoupon,
    discount,
    cartTotalWithDiscount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
