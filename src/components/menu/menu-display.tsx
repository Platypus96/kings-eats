"use client";

import { useState, useEffect } from 'react';
import { MenuCard } from "./menu-card";
import type { MenuItem } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';

function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <Skeleton className="h-[200px] w-full" />
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}


export function MenuDisplay() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const q = query(collection(db, "menu"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const items: MenuItem[] = [];
        querySnapshot.forEach((doc) => {
            items.push({ id: doc.id, ...doc.data() } as MenuItem);
        });
        setMenuItems(items);
        setLoading(false);
        setError(null);
    }, (err) => {
        console.error("Error fetching menu items: ", err);
        setError("Could not fetch menu items. Please make sure the database is set up correctly and check security rules.");
        toast({ variant: 'destructive', title: 'Database Error', description: 'Could not fetch menu items.' });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const availableItems = menuItems.filter(item => item.available);
  const unavailableItems = menuItems.filter(item => !item.available);

  if (loading) {
    return <MenuSkeleton />;
  }
  
  if (error) {
     return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Fetching Menu</AlertTitle>
        <AlertDescription>
          {error} This could be because the Firestore database has not been created or security rules are blocking access.
        </AlertDescription>
      </Alert>
    );
  }

  if (menuItems.length === 0) {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>No Items Available</AlertTitle>
        <AlertDescription>
          The menu is empty right now. The admin can add items from the dashboard.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {availableItems.map((item) => (
          <MenuCard key={item.id} item={item} />
        ))}
      </div>
      {unavailableItems.length > 0 && (
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-muted-foreground mb-4">Unavailable Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {unavailableItems.map((item) => (
              <MenuCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
