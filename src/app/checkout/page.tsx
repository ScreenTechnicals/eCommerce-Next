'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/context/cart-provider';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { formatCurrency } from '@/lib/utils';
import { Separator } from '@/components/ui/separator';

const shippingSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(5, 'A valid zip code is required'),
  country: z.string().min(2, 'Country is required'),
});

const paymentSchema = z.object({
    cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
    expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Expiry date must be in MM/YY format'),
    cvc: z.string().regex(/^\d{3,4}$/, 'CVC must be 3 or 4 digits'),
});

const checkoutSchema = shippingSchema.merge(paymentSchema);

export default function CheckoutPage() {
  const { cartItems, cartTotal, discount, cartTotalWithDiscount, clearCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      address: '',
      city: '',
      zipCode: '',
      country: '',
      cardNumber: '',
      expiryDate: '',
      cvc: '',
    },
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/?showLogin=true');
    }
    if (cartItems.length === 0) {
      router.push('/products');
    }
  }, [isAuthenticated, router, cartItems]);

  const onSubmit = (values: z.infer<typeof checkoutSchema>) => {
    const orderDetails = {
      shipping: values,
      items: cartItems,
      total: cartTotalWithDiscount,
      orderId: `ORD-${Date.now()}`
    };
    localStorage.setItem('lastOrder', JSON.stringify(orderDetails));
    
    console.log('Order submitted:', values);
    clearCart();
    router.push('/checkout/success');
  };

  if (!isAuthenticated || cartItems.length === 0) {
    return (
        <div className="container mx-auto flex items-center justify-center py-24">
            <p>You must be logged in to checkout. Redirecting...</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-headline text-4xl font-bold">Checkout</h1>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping & Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  {/* Shipping Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Shipping Address</h3>
                    <FormField control={form.control} name="fullName" render={({ field }) => (
                      <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <FormField control={form.control} name="address" render={({ field }) => (
                      <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                    )}/>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <FormField control={form.control} name="city" render={({ field }) => (
                        <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                      <FormField control={form.control} name="zipCode" render={({ field }) => (
                        <FormItem><FormLabel>Zip Code</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                      <FormField control={form.control} name="country" render={({ field }) => (
                        <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                    </div>
                  </div>
                  
                  <Separator />

                  {/* Payment Details */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Payment Details</h3>
                     <FormField control={form.control} name="cardNumber" render={({ field }) => (
                        <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input placeholder="•••• •••• •••• ••••" {...field} /></FormControl><FormMessage /></FormItem>
                      )}/>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <FormField control={form.control} name="expiryDate" render={({ field }) => (
                            <FormItem><FormLabel>Expiry Date</FormLabel><FormControl><Input placeholder="MM/YY" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <FormField control={form.control} name="cvc" render={({ field }) => (
                            <FormItem><FormLabel>CVC</FormLabel><FormControl><Input placeholder="•••" {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                    </div>
                  </div>
                  
                  <Button type="submit" size="lg" className="w-full">Place Order</Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {cartItems.map(item => (
                <div key={item.product.id} className="flex justify-between items-center text-sm">
                  <span className="truncate">{item.product.name} x {item.quantity}</span>
                  <span className="font-medium">{formatCurrency(item.product.price * item.quantity)}</span>
                </div>
              ))}
               <Separator />
                <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{formatCurrency(cartTotal)}</span>
                </div>
                {discount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                        <span>Discount</span>
                        <span>-{formatCurrency(discount)}</span>
                    </div>
                )}
               <Separator />
               <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>{formatCurrency(cartTotalWithDiscount)}</span>
                </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
