"use client";

import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

export function CartIcon() {
  const { itemCount, setCartOpen } = useCart();

  return (
    <Button variant="ghost" size="icon" className="relative" onClick={() => setCartOpen(true)}>
      <ShoppingCart className="h-5 w-5" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
          {itemCount}
        </span>
      )}
      <span className="sr-only">Open cart</span>
    </Button>
  );
}
