import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import { Header } from '@/components/layout/header';
import { cn } from '@/lib/utils';
import { CartSheet } from '@/components/cart/cart-sheet';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  title: 'Kings Eats',
  description: 'Order food from the Kings Canteen at IIIT Allahabad',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className={cn('font-body antialiased min-h-screen bg-background text-foreground')}>
        <Providers>
          <div className="relative flex min-h-dvh flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartSheet />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
