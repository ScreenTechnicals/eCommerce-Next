import Link from 'next/link';
import { Store, Github, Twitter, Linkedin } from 'lucide-react';

export default function Footer() {
  const socialLinks = [
    { icon: <Github className="size-5" />, href: '#' },
    { icon: <Twitter className="size-5" />, href: '#' },
    { icon: <Linkedin className="size-5" />, href: '#' },
  ];

  const footerLinks = [
    { title: 'Shop', links: [{label: 'All Products', href: '/products' }, {label: 'Electronics', href: '/products?category=Electronics'}, {label: 'Clothing', href: '/products?category=Clothing'}] },
    { title: 'About', links: [{label: 'Our Story', href: '/about'}, {label: 'Contact Us', href: '/about'}] },
    { title: 'Support', links: [{label: 'FAQ', href: '#'}, {label: 'Shipping & Returns', href: '#'}] },
  ];

  return (
    <footer className="bg-secondary/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold font-headline">
              <Store className="size-6 text-primary" />
              eCommerce Next
            </Link>
            <p className="text-muted-foreground">High-quality products for modern living.</p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <Link key={index} href={social.href} className="text-muted-foreground hover:text-foreground">
                  {social.icon}
                </Link>
              ))}
            </div>
          </div>
          {footerLinks.map((section) => (
            <div key={section.title} className="space-y-4">
              <h3 className="font-headline font-semibold">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-muted-foreground hover:text-foreground">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} eCommerce Next. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
