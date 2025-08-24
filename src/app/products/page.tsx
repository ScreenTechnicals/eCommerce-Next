'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { products } from '@/data/products';
import ProductCard from '@/components/product-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { Product } from '@/lib/types';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';


const CATEGORIES = ['All', 'Electronics', 'Clothing', 'Books', 'Home Goods'];
const PRODUCTS_PER_PAGE = 8;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  
  const [sort, setSort] = useState('newest');
  const [category, setCategory] = useState(searchParams.get('category') || 'All');
  const [priceRange, setPriceRange] = useState([0, 2000]);
  const [currentPage, setCurrentPage] = useState(1);

  const filteredProducts = useMemo(() => {
    let filtered: Product[] = [...products];

    // Filter by search query
    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (category !== 'All') {
      filtered = filtered.filter(p => p.category === category);
    }

    // Filter by price
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sort
    switch (sort) {
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - b.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default: // newest
        // Assuming IDs are incremental
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
    }
    
    return filtered;
  }, [searchParams, category, priceRange, sort]);
  
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );
  
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-headline text-4xl font-bold">Our Products</h1>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
        {/* Filters */}
        <aside className="md:col-span-1">
          <div className="space-y-6 rounded-lg border p-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold">Category</h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map(cat => (
                  <Button
                    key={cat}
                    variant={category === cat ? 'default' : 'secondary'}
                    onClick={() => setCategory(cat)}
                    className="flex-grow"
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="mb-4 text-lg font-semibold">Price Range</h3>
              <Slider
                min={0}
                max={2000}
                step={50}
                value={priceRange}
                onValueChange={(value) => setPriceRange(value)}
              />
              <p className="mt-2 text-sm text-muted-foreground">
                {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
              </p>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="md:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </p>
            <Select onValueChange={setSort} defaultValue={sort}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
                <SelectItem value="price-asc">Price: Low to High</SelectItem>
                <SelectItem value="price-desc">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center h-[400px]">
              <h3 className="text-xl font-semibold">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your filters.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => handlePageChange(currentPage - 1)} />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem key={i}>
                       <PaginationLink onClick={() => handlePageChange(i + 1)} isActive={currentPage === i + 1}>
                         {i + 1}
                       </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext onClick={() => handlePageChange(currentPage + 1)} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}