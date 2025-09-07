"use client";

import { useState, useEffect } from 'react';
import { MenuCard } from "./menu-card";
import type { MenuItem } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export function MenuDisplay() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
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
    }, (error) => {
        console.error("Error fetching menu items: ", error);
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch menu items.' });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [toast]);

  const availableItems = menuItems.filter(item => item.available);
  const unavailableItems = menuItems.filter(item => !item.available);

  if (loading) {
    // A skeleton is shown via Suspense in page.tsx
    return null;
  }
  
  if (menuItems.length === 0) {
    return (
      <Alert>
        <Terminal className="h-4 w-4" />
        <AlertTitle>No Items Available</AlertTitle>
        <AlertDescription>
          The menu is empty right now. Please check back later.
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
