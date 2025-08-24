'use client';

import Link from 'next/link';
import { ShoppingBag, Store, Menu, User, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductSearch from '@/components/product-search';
import { useCart } from '@/context/cart-provider';
import { useAuth } from '@/context/auth-context';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from './ui/sheet';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About' },
];

export default function Header() {
  const { itemCount } = useCart();
  const { isAuthenticated, user, login, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    await logout();
    router.push('/');
     toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  }

  const handleLogin = async () => {
    try {
      await login();
      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });
    } catch (error) {
       console.error("Google Sign-In Error:", error);
      toast({
        title: "Login Failed",
        description: "Could not sign in with Google.",
        variant: "destructive",
      });
    }
  };

  const UserMenu = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <User className="size-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isAuthenticated ? (
          <>
            <DropdownMenuLabel>Hi, {user?.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </>
        ) : (
          <>
            <DropdownMenuItem onClick={handleLogin}>Login with Google</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const MobileNav = () => (
    <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <div className="flex h-full flex-col">
          <div className="border-b p-4">
             <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline" onClick={() => setIsMobileMenuOpen(false)}>
                <Store className="size-6 text-primary" />
                eCommerce Next
            </Link>
          </div>
          <nav className="flex flex-col gap-4 p-4">
            {navLinks.map((link) => (
              <SheetClose key={link.href} asChild>
                <Link href={link.href} className="text-lg font-medium text-muted-foreground hover:text-foreground">
                    {link.label}
                </Link>
              </SheetClose>
            ))}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center px-4">
        <div className="flex items-center gap-6">
          <MobileNav />
          <Link href="/" className="hidden items-center gap-2 text-xl font-bold font-headline md:flex">
            <Store className="size-6 text-primary" />
            eCommerce Next
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-end gap-4">
          <div className="w-full max-w-xs hidden sm:block">
            <ProductSearch />
          </div>
          <UserMenu />
          <Button asChild variant="ghost" size="icon" className="relative">
            <Link href="/cart">
              <ShoppingBag className="size-5" />
              {itemCount > 0 && (
                <Badge variant="destructive" className="absolute -right-2 -top-2 flex size-5 justify-center rounded-full p-0">
                  {itemCount}
                </Badge>
              )}
            </Link>
          </Button>
        </div>
      </div>
       <div className="container mx-auto px-4 pb-2 sm:hidden">
          <ProductSearch />
        </div>
    </header>
  );
}
