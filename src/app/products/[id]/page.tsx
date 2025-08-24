'use client';

import { notFound, useParams } from 'next/navigation';
import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/cart-provider';
import { formatCurrency } from '@/lib/utils';
import ProductCard from '@/components/product-card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart } from 'lucide-react';

export default function ProductDetailPage() {
  const { addToCart } = useCart();
  const params = useParams();
  const { id } = params;

  const product = products.find(p => p.id === id);

  if (!product) {
    notFound();
  }

  const relatedProducts = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);
    
  const images = Array.isArray(product.imageUrl) ? product.imageUrl : [product.imageUrl];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((img, index) => (
                <CarouselItem key={index}>
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-0">
                      <img src={img} alt={`${product.name} image ${index + 1}`} className="h-full w-full rounded-lg object-cover" data-ai-hint="product image" />
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
        <div className="space-y-6">
          <h1 className="font-headline text-4xl font-bold">{product.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star className="size-5 fill-yellow-400 text-yellow-400" />
              <span className="text-lg font-medium">{product.rating}</span>
            </div>
            <span className="text-muted-foreground">|</span>
            <span className="text-lg text-primary">{product.category}</span>
          </div>
          <p className="text-3xl font-bold">{formatCurrency(product.price)}</p>
          <p className="text-lg text-muted-foreground">{product.description}</p>
          <div className="flex items-center gap-4">
            <Button size="lg" onClick={() => addToCart(product)}>
              <ShoppingCart className="mr-2" /> Add to Cart
            </Button>
            <p className="text-muted-foreground">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-8 text-center font-headline text-3xl font-bold">Related Products</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map(relatedProduct => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
