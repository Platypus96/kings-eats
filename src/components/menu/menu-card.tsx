"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
      <CardHeader className="p-0 relative">
        <Image
          src={item.imageUrl}
          alt={item.name}
          width={400}
          height={300}
          className="object-cover w-full h-48"
          data-ai-hint={item['data-ai-hint']}
        />
        {!item.available && (
          <Badge variant="destructive" className="absolute top-2 right-2">UNAVAILABLE</Badge>
        )}
      </CardHeader>
      <CardContent className="p-4 flex-1">
        <CardTitle className="text-lg">{item.name}</CardTitle>
        <CardDescription className="mt-1 text-sm h-10">{item.description}</CardDescription>
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
