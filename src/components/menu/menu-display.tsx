"use client";

import { useState, useEffect } from 'react';
import type { MenuItem } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MenuListItem } from './menu-list-item';
import { Badge } from '../ui/badge';

function MenuSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-4">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-9 w-24" />
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
  const { user } = useAuth();

  useEffect(() => {
    const q = query(collection(db, "menu"), orderBy("name"));
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
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
            {availableItems.map((item) => (
              <MenuListItem key={item.id} item={item} disabled={!user} />
            ))}
            {unavailableItems.map((item) => (
               <div key={item.id} className="p-4 flex justify-between items-center opacity-50">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">₹{item.price}</p>
                </div>
                <Badge variant="outline">Unavailable</Badge>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}
