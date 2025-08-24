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
