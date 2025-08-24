
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import { formatCurrency } from '@/lib/utils';
import { Package, Home, User, Download } from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

// Mock data - in a real app, this would come from a database
const mockOrders = [
  {
    orderId: 'ORD-1678886400000',
    date: new Date('2023-03-15'),
    status: 'Delivered',
    total: 145.98,
    items: [
      { product: { id: '3', name: 'Urban Explorer Jacket' }, quantity: 1, price: 129.99 },
      { product: { id: '4', name: 'The Midnight Library' }, quantity: 1, price: 15.99 },
    ],
  },
  {
    orderId: 'ORD-1676457600000',
    date: new Date('2023-02-15'),
    status: 'Delivered',
    total: 249.99,
    items: [
       { product: { id: '2', name: 'AcousticBliss Headphones' }, quantity: 1, price: 249.99 },
    ],
  },
];

const mockAddresses = [
    {
        id: '1',
        name: 'Home',
        address: '123 Main St, Anytown, USA 12345'
    },
    {
        id: '2',
        name: 'Work',
        address: '456 Business Ave, Workville, USA 54321'
    }
]


export default function AccountPage() {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/?showLogin=true');
    }
  }, [isAuthenticated, loading, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="container mx-auto flex items-center justify-center py-24">
        <p>Loading your account details...</p>
      </div>
    );
  }
  
  const ProfileTab = () => (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your personal account information.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
                <AvatarImage src={user?.photoURL} alt={user?.name} />
                <AvatarFallback>{user?.name?.[0].toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
                <h3 className="text-xl font-semibold">{user?.name}</h3>
                <p className="text-muted-foreground">{user?.email}</p>
            </div>
        </div>
      </CardContent>
    </Card>
  );
  
  const OrdersTab = () => (
     <Card>
      <CardHeader>
        <CardTitle>My Orders</CardTitle>
        <CardDescription>Here is a list of your past orders.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {mockOrders.length > 0 ? (
          mockOrders.map((order) => (
            <Card key={order.orderId} className="p-4">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <p className="font-semibold">Order ID:</p>
                  <p className="text-sm text-muted-foreground">{order.orderId}</p>
                </div>
                <div>
                  <p className="font-semibold">Date:</p>
                  <p className="text-sm text-muted-foreground">{format(order.date, 'PPP')}</p>
                </div>
                 <div>
                  <p className="font-semibold">Status:</p>
                  <p className="text-sm font-semibold text-green-600">{order.status}</p>
                </div>
                <div>
                  <p className="font-semibold">Total:</p>
                  <p className="text-sm font-semibold">{formatCurrency(order.total)}</p>
                </div>
                 <div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 size-4" />
                      Download Invoice
                    </Button>
                </div>
              </div>
              <Separator className="my-4" />
               <div>
                <h4 className="mb-2 font-medium">Items:</h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                    {order.items.map(item => (
                        <li key={item.product.id}>{item.product.name} x {item.quantity}</li>
                    ))}
                </ul>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <Package className="mx-auto h-12 w-12" />
            <p className="mt-4">You haven't placed any orders yet.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const AddressesTab = () => (
     <Card>
      <CardHeader>
        <CardTitle>My Addresses</CardTitle>
        <CardDescription>Manage your saved shipping addresses.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
           {mockAddresses.map(address => (
               <div key={address.id} className="flex items-center justify-between rounded-md border p-4">
                   <div className="space-y-1">
                       <p className="font-semibold">{address.name}</p>
                       <p className="text-muted-foreground">{address.address}</p>
                   </div>
                   <div>
                       <Button variant="ghost" size="sm">Edit</Button>
                       <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Remove</Button>
                   </div>
               </div>
           ))}
        </div>
        <Button>Add New Address</Button>
      </CardContent>
    </Card>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-headline text-4xl font-bold">My Account</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile"><User className="mr-2"/>Profile</TabsTrigger>
          <TabsTrigger value="orders"><Package className="mr-2"/>Orders</TabsTrigger>
          <TabsTrigger value="addresses"><Home className="mr-2"/>Addresses</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6"><ProfileTab /></TabsContent>
        <TabsContent value="orders" className="mt-6"><OrdersTab /></TabsContent>
        <TabsContent value="addresses" className="mt-6"><AddressesTab /></TabsContent>
      </Tabs>
    </div>
  );
}
