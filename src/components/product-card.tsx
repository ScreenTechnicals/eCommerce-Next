'use client';

import Link from 'next/link';
import type { Product } from '@/lib/types';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-provider';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const imageUrl = Array.isArray(product.imageUrl) ? product.imageUrl[0] : product.imageUrl;

  return (
    <Card className="group flex h-full transform flex-col overflow-hidden transition-all duration-300 hover:shadow-xl">
      <CardHeader className="p-0">
        <Link href={`/products/${product.id}`} className="block overflow-hidden">
          <img
            src={imageUrl}
            alt={product.name}
            width={400}
            height={400}
            data-ai-hint="product image"
            className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-110"
          />
        </Link>
      </CardHeader>
      <CardContent className="flex-grow p-4">
        <CardTitle className="mb-2 h-12 text-lg font-semibold leading-tight">
          <Link href={`/products/${product.id}`}>{product.name}</Link>
        </CardTitle>
        <div className="flex items-center justify-between">
            <Badge variant="secondary">{product.category}</Badge>
            <div className="flex items-center gap-1">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-muted-foreground">{product.rating}</span>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4">
        <p className="text-xl font-bold text-primary">{formatCurrency(product.price)}</p>
        <Button onClick={() => addToCart(product)}>Add to Cart</Button>
      </CardFooter>
    </Card>
  );
}
