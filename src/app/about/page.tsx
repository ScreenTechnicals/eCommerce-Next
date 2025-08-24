import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Target, Eye } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="font-headline text-5xl font-bold">About eCommerce Next</h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
          We are dedicated to providing the best products with a seamless shopping experience.
        </p>
      </div>
      
      <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card className="text-center">
          <CardHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Target className="size-6 text-primary" />
            </div>
            <CardTitle className="mt-4 font-headline text-2xl">Our Mission</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To curate a collection of high-quality, innovative products that enhance the lives of our customers, all delivered with exceptional service.
            </p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader>
             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Eye className="size-6 text-primary" />
            </div>
            <CardTitle className="mt-4 font-headline text-2xl">Our Vision</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To be the most trusted and inspiring online destination for modern living, where technology and style meet quality and convenience.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardHeader>
             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="size-6 text-primary" />
            </div>
            <CardTitle className="mt-4 font-headline text-2xl">Our Team</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              A passionate group of designers, developers, and product enthusiasts dedicated to creating a memorable and delightful shopping journey for you.
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-24 grid grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div>
          <img 
            src="https://placehold.co/600x400.png" 
            alt="Our team working" 
            className="rounded-lg shadow-lg"
            data-ai-hint="team collaboration"
          />
        </div>
        <div className="space-y-4">
            <h2 className="font-headline text-4xl font-bold">From Our Founder</h2>
            <p className="text-lg text-muted-foreground">
                “eCommerce Next was born from a simple idea: shopping online should be exciting, easy, and reliable. We believe in the power of great products to bring joy and solve problems. Every item in our store is selected with care, and we've built this platform to make your experience as smooth as possible. Thank you for joining us on this journey.”
            </p>
        </div>
      </div>
    </div>
  );
}
