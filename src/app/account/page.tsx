
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
import { Package, Home, User, Download, PlusCircle } from 'lucide-react';
import type { CartItem } from '@/lib/types';
import { Separator } from '@/components/ui/separator';
import jsPDF from 'jspdf';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

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

const addressSchema = z.object({
  name: z.string().min(2, 'A name for the address is required'),
  phoneNumber: z.string().min(10, 'A valid phone number is required'),
  address: z.string().min(5, 'Please enter your full street address and ensure it is at least 5 characters long.'),
  city: z.string().min(2, 'City is required'),
  zipCode: z.string().min(5, 'A valid zip code is required'),
  country: z.string().min(2, 'Country is required'),
});

const handleDownloadInvoice = (order: typeof mockOrders[0]) => {
    const doc = new jsPDF();
    const pageHeight = doc.internal.pageSize.height;
    let y = 20;

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text("eCommerce Next", 20, y);
    y += 15;
    
    doc.setFontSize(18);
    doc.text("Invoice", 20, y);
    y += 10;
    
    // Order Details
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Order ID: ${order.orderId}`, 20, y);
    doc.text(`Date: ${format(order.date, 'PPP')}`, 190, y, { align: 'right' });
    y += 6;
    doc.text(`Status: ${order.status}`, 20, y);
    y += 12;

    // Table Header
    doc.setDrawColor(200); // Light gray for lines
    doc.setLineWidth(0.5);
    doc.line(20, y, 190, y); // Top border of table
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text("Item Description", 22, y);
    doc.text("Qty", 125, y, { align: 'center'});
    doc.text("Unit Price", 155, y, { align: 'right'});
    doc.text("Total", 188, y, { align: 'right'});
    y += 4;
    doc.line(20, y, 190, y); // Bottom border of header
    y += 8;
    
    // Table Rows
    doc.setFont('helvetica', 'normal');
    order.items.forEach(item => {
        doc.text(item.product.name, 22, y);
        doc.text(item.quantity.toString(), 125, y, { align: 'center'});
        doc.text(formatCurrency(item.price), 155, y, { align: 'right'});
        doc.text(formatCurrency(item.price * item.quantity), 188, y, { align: 'right'});
        y += 7;
    });

    // Table Footer (Grand Total)
    y += 5;
    doc.line(130, y, 190, y); // line above total
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.text("Grand Total:", 132, y);
    doc.text(formatCurrency(order.total), 188, y, { align: 'right'});

    // Footer
    const footerY = pageHeight - 20;
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Thank you for your business!", 105, footerY, { align: 'center'});
    doc.text("eCommerce Next | 123 Web St, Online City | contact@ecommercenext.com", 105, footerY + 5, { align: 'center'});


    doc.save(`invoice-${order.orderId}.pdf`);
};

const ProfileTab = ({ user }: { user: any }) => (
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
                    <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(order)}>
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

const AddressesTab = () => {
    const { user } = useAuth();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
  
    const form = useForm<z.infer<typeof addressSchema>>({
      resolver: zodResolver(addressSchema),
      defaultValues: { name: '', phoneNumber: '', address: '', city: '', zipCode: '', country: '' },
    });
  
    useEffect(() => {
      if (!user) return;
      const addressesRef = collection(db, 'users', user.id, 'addresses');
      const unsubscribe = onSnapshot(addressesRef, (snapshot) => {
        setAddresses(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });
      return () => unsubscribe();
    }, [user]);
  
    const handleAddAddress = async (values: z.infer<typeof addressSchema>) => {
      if (!user) return;
      const addressesRef = collection(db, 'users', user.id, 'addresses');
      await addDoc(addressesRef, values);
      form.reset();
      setIsFormOpen(false);
    };

    const handleRemoveAddress = async (addressId: string) => {
      if (!user) return;
      const addressRef = doc(db, 'users', user.id, 'addresses', addressId);
      await deleteDoc(addressRef);
    }
  
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Addresses</CardTitle>
          <CardDescription>Manage your saved shipping addresses.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {addresses.length > 0 ? (
            addresses.map(address => (
              <div key={address.id} className="flex items-start justify-between rounded-md border p-4">
                <div className="space-y-1">
                  <p className="font-semibold">{address.name}</p>
                  <p className="text-muted-foreground">{address.address}, {address.city}, {address.zipCode}, {address.country}</p>
                  <p className="text-sm text-muted-foreground">Phone: {address.phoneNumber}</p>
                </div>
                <div>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleRemoveAddress(address.id)}>Remove</Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">You have no saved addresses.</p>
          )}
           <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2" /> Add New Address
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add a New Address</DialogTitle>
                    <DialogDescription>
                        Enter the details for your new shipping address.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddAddress)} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Address Name (e.g. Home)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="phoneNumber" render={({ field }) => (
                                <FormItem><FormLabel>Receiver's Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                         <FormField control={form.control} name="address" render={({ field }) => (
                            <FormItem><FormLabel>Address</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                        )}/>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <FormField control={form.control} name="city" render={({ field }) => (
                                <FormItem><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="zipCode" render={({ field }) => (
                                <FormItem><FormLabel>Zip Code</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                             <FormField control={form.control} name="country" render={({ field }) => (
                                <FormItem><FormLabel>Country</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="secondary">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">Save Address</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
           </Dialog>
        </CardContent>
      </Card>
    );
  };

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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 font-headline text-4xl font-bold">My Account</h1>
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile"><User className="mr-2"/>Profile</TabsTrigger>
          <TabsTrigger value="orders"><Package className="mr-2"/>Orders</TabsTrigger>
          <TabsTrigger value="addresses"><Home className="mr-2"/>Addresses</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6"><ProfileTab user={user} /></TabsContent>
        <TabsContent value="orders" className="mt-6"><OrdersTab /></TabsContent>
        <TabsContent value="addresses" className="mt-6"><AddressesTab /></TabsContent>
      </Tabs>
    </div>
  );
}

    
