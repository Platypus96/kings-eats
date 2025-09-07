"use client";

import Link from "next/link";
import { Utensils } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { UserNav } from "@/components/auth/user-nav";
import { Button } from "@/components/ui/button";
import { CartIcon } from "@/components/cart/cart-icon";
import { Skeleton } from "@/components/ui/skeleton";

export function Header() {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Utensils className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">
              Kings Eats
            </span>
          </Link>
          <nav className="flex items-center gap-4 md:gap-6 text-sm">
            <Link
              href="/"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Menu
            </Link>
            {user && !user.isAdmin && (
              <Link
                href="/orders"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                My Orders
              </Link>
            )}
            {user?.isAdmin && (
               <Link
                href="/dashboard"
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                Dashboard
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2 md:space-x-4">
          {loading ? (
            <Skeleton className="h-8 w-20" />
          ) : user ? (
            <>
              <CartIcon />
              <UserNav />
            </>
          ) : (
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
