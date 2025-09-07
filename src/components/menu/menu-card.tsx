"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import type { MenuItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  return (
    <Card className={cn(
      "flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/50",
      !item.available && "opacity-50"
    )}>
       <CardHeader className="flex flex-row justify-between items-start pb-2">
        <CardTitle className="text-lg">{item.name}</CardTitle>
        {!item.available && (
          <Badge variant="destructive" className="ml-auto">UNAVAILABLE</Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-1">
        {/* Description removed */}
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="text-xl font-bold text-primary">₹{item.price}</p>
        <Button
          onClick={() => addToCart(item)}
          disabled={!item.available || !user}
          size="sm"
          aria-label={`Add ${item.name} to cart`}
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add
        </Button>
      </CardFooter>
    </Card>
  );
}
