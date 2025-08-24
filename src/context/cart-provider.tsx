'use client';

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useToast } from "@/hooks/use-toast"
import { useAuth } from './auth-context';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';


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
  const [localCart, setLocalCart] = useLocalStorage<CartItem[]>('cart', []);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const { toast } = useToast();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (loading) return;

    if (user) {
      const cartRef = doc(db, 'carts', user.id);
      
      const unsubscribe = onSnapshot(cartRef, (docSnap) => {
        if (docSnap.exists()) {
          const cartData = docSnap.data();
          const items = cartData.items || [];
          setCartItems(items);
          
          if(localCart.length > 0) {
             // Merge local cart into firestore cart
            const mergedCart = [...items];
            localCart.forEach(localItem => {
              const existingItemIndex = mergedCart.findIndex(item => item.product.id === localItem.product.id);
              if (existingItemIndex > -1) {
                mergedCart[existingItemIndex].quantity += localItem.quantity;
              } else {
                mergedCart.push(localItem);
              }
            });
            setDoc(cartRef, { items: mergedCart }, { merge: true });
            setLocalCart([]); // Clear local cart
          }

        } else {
          // No cart in Firestore, check local storage
          if (localCart.length > 0) {
            setCartItems(localCart);
            setDoc(cartRef, { items: localCart });
            setLocalCart([]); // Clear local cart
          } else {
            setCartItems([]);
          }
        }
      });

      return () => unsubscribe();
    } else {
      // Not logged in, use local storage
      setCartItems(localCart);
    }
  }, [user, loading, setLocalCart, localCart]);


  const updateCart = (newCartItems: CartItem[]) => {
    if (user) {
      const cartRef = doc(db, 'carts', user.id);
      setDoc(cartRef, { items: newCartItems }, { merge: true });
    } else {
      setLocalCart(newCartItems);
    }
     setCartItems(newCartItems);
  };


  const addToCart = (product: Product, quantity: number = 1) => {
    const existingItem = cartItems.find(item => item.product.id === product.id);
    let newCartItems;
    if (existingItem) {
      newCartItems = cartItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + quantity }
          : item
      );
    } else {
      newCartItems = [...cartItems, { product, quantity }];
    }
    updateCart(newCartItems);
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    })
  };

  const removeFromCart = (productId: string) => {
    const newCartItems = cartItems.filter(item => item.product.id !== productId);
    updateCart(newCartItems);
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
      const newCartItems = cartItems.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      );
      updateCart(newCartItems);
    }
  };

  const clearCart = () => {
    updateCart([]);
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
