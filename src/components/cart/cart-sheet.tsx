"use client";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingCart } from "lucide-react";
import { placeOrder } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function CartSheet() {
  const { cart, removeFromCart, updateQuantity, cartTotal, itemCount, isCartOpen, setCartOpen, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const router = useRouter();

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not signed in",
        description: "Please sign in to place an order.",
      });
      return;
    }
    setIsPlacingOrder(true);
    try {
      await placeOrder({
        userId: user.uid,
        userEmail: user.email!,
        items: cart,
        total: cartTotal,
      });
      toast({
        title: "Order Placed!",
        description: "Your order has been successfully placed.",
      });
      clearCart();
      setCartOpen(false);
      router.push('/orders');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "There was a problem placing your order.",
      });
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <Sheet open={isCartOpen} onOpenChange={setCartOpen}>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle>Your Cart ({itemCount})</SheetTitle>
        </SheetHeader>
        {itemCount > 0 ? (
          <>
            <ScrollArea className="flex-1 my-4">
              <div className="px-6 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-md object-cover"
                      data-ai-hint={item['data-ai-hint']}
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ₹{item.price}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                       <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                        className="h-8 w-16 text-center"
                        aria-label={`Quantity for ${item.name}`}
                      />
                      <Button variant="outline" size="icon" onClick={() => removeFromCart(item.id)} aria-label={`Remove ${item.name} from cart`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
            <SheetFooter className="px-6 py-4 mt-auto bg-secondary/50">
              <div className="w-full space-y-4">
                 <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₹{cartTotal}</span>
                </div>
                <Button onClick={handlePlaceOrder} className="w-full" disabled={isPlacingOrder}>
                  {isPlacingOrder ? "Placing Order..." : "Place Order"}
                </Button>
              </div>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">Your cart is empty</h3>
              <p className="mt-1 text-sm text-muted-foreground">Add some items from the menu to get started.</p>
              <SheetClose asChild>
                <Button variant="outline" className="mt-6">Continue Shopping</Button>
              </SheetClose>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
