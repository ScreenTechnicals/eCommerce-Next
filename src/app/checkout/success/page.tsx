'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, Package } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import type { Order } from '@/lib/types';

export default function OrderSuccessPage() {
  const [order, setOrder] = useState<Omit<Order, 'createdAt'> | null>(null);

  useEffect(() => {
    const lastOrder = localStorage.getItem('lastOrder');
    if (lastOrder) {
      setOrder(JSON.parse(lastOrder));
      // Optional: remove the item from localStorage after displaying it
      // localStorage.removeItem('lastOrder');
    }
  }, []);

  if (!order) {
    return (
      <div className="container mx-auto flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-lg text-center">
          <CardHeader>
            <CardTitle className="font-headline text-3xl">Loading Order...</CardTitle>
          </CardHeader>
          <CardContent>
            <p>If you are not redirected, please click the button below.</p>
            <Button asChild className="mt-4">
              <Link href="/">Go to Homepage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="size-10 text-green-600" />
          </div>
          <CardTitle className="mt-4 font-headline text-3xl">Order Placed Successfully!</CardTitle>
          <CardDescription>
            Thank you for your purchase. A confirmation email has been sent.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg border bg-muted/50 p-4 text-sm">
            <p className="font-semibold">Order ID: <span className="font-normal">{order.orderId}</span></p>
          </div>
          
          <div>
            <h3 className="mb-4 font-headline text-lg font-semibold">Order Summary</h3>
            <div className="space-y-2">
              {order.items.map(item => (
                <div key={item.product.id} className="flex justify-between items-center">
                  <span>{item.product.name} <span className="text-muted-foreground">x {item.quantity}</span></span>
                  <span>{formatCurrency(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total Paid</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
          
          <Separator />

          <div>
            <h3 className="mb-2 font-headline text-lg font-semibold">Shipping To</h3>
            <address className="not-italic text-muted-foreground">
              {order.shippingAddress.fullName}<br />
              {order.shippingAddress.address}<br />
              {order.shippingAddress.city}, {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}
            </address>
          </div>
        </CardContent>
        <CardFooter className="flex-col gap-4">
           <p className="text-center text-sm text-muted-foreground">You can track your order status from your account page.</p>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
