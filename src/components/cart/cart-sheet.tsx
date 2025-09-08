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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, ShoppingCart } from "lucide-react";
import { placeOrder } from "@/app/actions";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { useRouter } from "next/navigation";

const hostels = ["BH1", "BH2", "BH3", "BH4", "BH5", "GH1", "GH2"];

export function CartSheet() {
  const { cart, removeFromCart, updateQuantity, cartTotal, itemCount, isCartOpen, setCartOpen, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [phone, setPhone] = useState("");
  const [hostel, setHostel] = useState("");
  const [instructions, setInstructions] = useState("");
  const router = useRouter();

  const discount = cartTotal * 0.05;
  const finalTotal = cartTotal - discount;

  const handlePlaceOrder = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Not signed in",
        description: "Please sign in to place an order.",
      });
      return;
    }
    if (!phone.trim()) {
      toast({
        variant: "destructive",
        title: "Phone Number Required",
        description: "Please enter your phone number.",
      });
      return;
    }
    if (!hostel) {
      toast({
        variant: "destructive",
        title: "Hostel Required",
        description: "Please select your hostel.",
      });
      return;
    }

    setIsPlacingOrder(true);
    try {
      const result = await placeOrder({
        userId: user.uid,
        userEmail: user.email!,
        items: cart,
        total: finalTotal,
        phone,
        hostel,
        instructions,
      });

      if (result.success) {
        toast({
          title: "Order Placed!",
          description: "Your order has been successfully placed.",
        });
        clearCart();
        setPhone("");
        setHostel("");
        setInstructions("");
        setCartOpen(false);
        router.push('/orders');
      } else {
        throw new Error(result.message);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: error.message || "There was a problem placing your order.",
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
            <div className="px-6 space-y-4 border-t pt-4">
              <div>
                <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" required />
              </div>
               <div>
                <Label htmlFor="hostel">Hostel <span className="text-destructive">*</span></Label>
                <Select value={hostel} onValueChange={setHostel} required>
                  <SelectTrigger id="hostel">
                    <SelectValue placeholder="Select your hostel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hostels.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="instructions">Special Instructions</Label>
                <Textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} placeholder="Any special requests for your order?" />
              </div>
            </div>
            <SheetFooter className="px-6 py-4 mt-auto bg-secondary/50">
              <div className="w-full space-y-4">
                 <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between text-sm text-green-500">
                  <span>Discount (5%)</span>
                  <span>- ₹{discount.toFixed(2)}</span>
                </div>
                 <div className="flex justify-between text-lg font-semibold border-t pt-2 mt-2">
                  <span>Total</span>
                  <span>₹{finalTotal.toFixed(2)}</span>
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
