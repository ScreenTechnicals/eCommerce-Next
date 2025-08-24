'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';

export default function RegisterPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

   const handleGoogleSignUp = async () => {
    try {
      await login();
       toast({
        title: "Registration Successful",
        description: "Your account has been created.",
      });
    } catch (error) {
      console.error("Google Sign-Up Error:", error);
      toast({
        title: "Registration Failed",
        description: "Could not sign up with Google.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);


  return (
    <div className="container mx-auto flex items-center justify-center px-4 py-16">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-headline text-3xl">Create an Account</CardTitle>
          <CardDescription>Join us by signing up with your Google account.</CardDescription>
        </CardHeader>
        <CardContent>
           <Button onClick={handleGoogleSignUp} className="w-full" variant="outline">
              Sign Up with Google
           </Button>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Log in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
