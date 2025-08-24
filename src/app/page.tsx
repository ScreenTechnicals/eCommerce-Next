import { products } from '@/data/products';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/product-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowRight, Book, Shirt, Utensils, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const newArrivals = products.slice(0, 8);
  const categories = [
    { name: 'Electronics', icon: <Zap className="size-8 text-primary" /> },
    { name: 'Clothing', icon: <Shirt className="size-8 text-primary" /> },
    { name: 'Books', icon: <Book className="size-8 text-primary" /> },
    { name: 'Home Goods', icon: <Utensils className="size-8 text-primary" /> },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="bg-secondary/50">
        <div className="container mx-auto grid grid-cols-1 items-center gap-8 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="space-y-6 text-center md:text-left">
            <h1 className="font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              Discover Your Next Favorite
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore our curated collection of high-quality products. From the latest tech to timeless apparel, we have it all.
            </p>
            <Button asChild size="lg">
              <Link href="/products">
                Shop Now <ArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <Card className="overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105">
              <CardContent className="p-0">
                <img
                  src="https://placehold.co/600x400.png"
                  alt="Featured product"
                  width={600}
                  height={400}
                  data-ai-hint="product lifestyle"
                  className="h-full w-full object-cover"
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <h2 className="mb-8 text-center font-headline text-3xl font-bold">Shop by Category</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:gap-8">
          {categories.map((category) => (
            <Link key={category.name} href={`/products?category=${category.name}`}>
              <Card className="group flex h-full transform flex-col items-center justify-center p-6 text-center transition-all hover:-translate-y-2 hover:shadow-lg">
                <div className="mb-4 rounded-full bg-primary/10 p-4 transition-colors group-hover:bg-primary/20">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="container mx-auto px-4">
        <h2 className="mb-8 text-center font-headline text-3xl font-bold">New Arrivals</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button asChild variant="outline">
            <Link href="/products">
              View All Products <ArrowRight className="ml-2" />
            </Link>
          </Button>
        </div>
      </section>
      
      {/* Newsletter Section */}
      <section className="bg-secondary/50">
        <div className="container mx-auto px-4 py-16">
          <Card className="mx-auto max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle className="font-headline text-3xl">Stay in the Loop</CardTitle>
              <p className="text-muted-foreground">Subscribe to our newsletter for the latest updates and offers.</p>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-4 sm:flex-row">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-grow"
                  aria-label="Email for newsletter"
                />
                <Button type="submit">Subscribe</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
