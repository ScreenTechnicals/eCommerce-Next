import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Frown } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="container mx-auto flex h-[60vh] flex-col items-center justify-center text-center">
      <Frown className="size-24 text-primary" />
      <h1 className="mt-8 font-headline text-5xl font-bold">404 - Page Not Found</h1>
      <p className="mt-4 max-w-md text-lg text-muted-foreground">
        Oops! The page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Button asChild className="mt-8">
        <Link href="/">Go Back Home</Link>
      </Button>
    </div>
  );
}
