"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CanteenStatus } from "@/lib/types";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "../ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { updateCanteenStatus } from "@/app/actions";

export function CanteenSettings() {
  const [canteenStatus, setCanteenStatus] = useState<CanteenStatus['status']>('taking_orders');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const settingsRef = doc(db, "settings", "canteen");
    const unsubscribe = onSnapshot(settingsRef, (doc) => {
        if (doc.exists()) {
            setCanteenStatus(doc.data().status);
        }
        setLoading(false);
    }, (error) => {
        console.error("Error fetching canteen status:", error);
        setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleStatusChange = async (isTakingOrders: boolean) => {
      const newStatus = isTakingOrders ? 'taking_orders' : 'not_taking_orders';
      setCanteenStatus(newStatus); // Optimistic update
      const result = await updateCanteenStatus(newStatus);
      if (!result.success) {
          toast({ variant: "destructive", title: "Error", description: result.message });
          // Revert optimistic update
          setCanteenStatus(isTakingOrders ? 'not_taking_orders' : 'taking_orders');
      } else {
          toast({ title: "Success", description: "Canteen status updated." });
      }
  }

  if (loading) {
      return (
          <Card>
              <CardHeader>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-64 mt-2" />
              </CardHeader>
              <CardContent>
                  <Skeleton className="h-10 w-full" />
              </CardContent>
          </Card>
      )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Canteen Settings</CardTitle>
        <CardDescription>Manage global settings for the canteen.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
                <Label htmlFor="canteen-status" className="text-base">
                   {canteenStatus === 'taking_orders' ? 'Taking Orders' : 'Not Taking Orders'}
                </Label>
                <p className="text-sm text-muted-foreground">
                    Turn this off to prevent users from placing new orders.
                </p>
            </div>
            <Switch
                id="canteen-status"
                checked={canteenStatus === 'taking_orders'}
                onCheckedChange={handleStatusChange}
                aria-label="Canteen status toggle"
            />
        </div>
      </CardContent>
    </Card>
  );
}
