"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/hooks/use-cart";
import type { MenuItem } from "@/lib/types";
import { Plus, Minus, ShoppingCart } from "lucide-react";

interface MenuListItemProps {
  item: MenuItem;
  disabled: boolean;
}

export function MenuListItem({ item, disabled }: MenuListItemProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(item, quantity);
      setQuantity(1); // Reset quantity after adding to cart
    }
  };

  const handleQuantityChange = (amount: number) => {
    setQuantity(prev => Math.max(1, prev + amount));
  };

  return (
    <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className='flex-1 self-start sm:self-center'>
        <p className="font-medium">{item.name}</p>
        <p className="text-sm text-primary font-semibold">₹{item.price}</p>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => handleQuantityChange(-1)} disabled={disabled || quantity <= 1}>
            <Minus className="h-4 w-4" />
          </Button>
          <Input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value, 10) || 1))}
            className="h-9 w-16 text-center"
            disabled={disabled}
          />
          <Button variant="outline" size="icon" className="h-9 w-9 shrink-0" onClick={() => handleQuantityChange(1)} disabled={disabled}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleAddToCart} disabled={disabled} className="flex-grow sm:flex-grow-0">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add
        </Button>
      </div>
    </div>
  );
}
