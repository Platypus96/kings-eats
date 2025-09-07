
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Order, OrderStatus } from "@/lib/types";

interface ApproveOrderDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  order: Order;
  onConfirm: (orderId: string, status: OrderStatus, completionTime: Date | null) => void;
}

export function ApproveOrderDialog({ isOpen, setIsOpen, order, onConfirm }: ApproveOrderDialogProps) {
  const [minutes, setMinutes] = useState(15);

  const handleConfirm = () => {
    const completionTime = new Date();
    completionTime.setMinutes(completionTime.getMinutes() + minutes);
    onConfirm(order.id, 'Approved', completionTime);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Approve Order</DialogTitle>
          <DialogDescription>
            Estimate when the order will be ready for pickup. This will notify the user.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="minutes" className="text-right">
              Minutes
            </Label>
            <Input
              id="minutes"
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value, 10) || 0)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirm}>Approve & Notify</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
