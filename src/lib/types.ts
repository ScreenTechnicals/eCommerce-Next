import type { Timestamp } from 'firebase/firestore';

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string | string[];
  category: 'Electronics' | 'Clothing' | 'Books' | 'Home Goods';
  stock: number;
  rating: number;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type User = {
  id: string;
  email: string;
  name: string;
};

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  zipCode: string;
  country: string;
};

export type Order = {
  id: string;
  userId: string;
  orderId: string;
  createdAt: Timestamp;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  items: CartItem[];
  total: number;
  shippingAddress: ShippingAddress;
  discount: number;
};
