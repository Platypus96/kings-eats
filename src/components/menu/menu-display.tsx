

"use client";

import { useState, useEffect } from 'react';
import type { MenuItem, CanteenStatus } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal, Search, ShoppingCart } from 'lucide-react';
import { collection, onSnapshot, query, orderBy, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '../ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader } from '../ui/card';
import { MenuListItem } from './menu-list-item';
import { Badge } from '../ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '../ui/button';

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

const ITEMS_PER_PAGE = 5;

export function MenuDisplay() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [canteenStatus, setCanteenStatus] = useState<CanteenStatus['status']>('taking_orders');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const settingsRef = doc(db, "settings", "canteen");
    const unsubscribeStatus = onSnapshot(settingsRef, (doc) => {
        if (doc.exists()) {
            setCanteenStatus(doc.data().status);
        }
    });

    return () => unsubscribeStatus();
  }, []);

  useEffect(() => {
    const q = query(collection(db, "menu"), orderBy("name"));
    const unsubscribeMenu = onSnapshot(q, (querySnapshot) => {
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

    return () => unsubscribeMenu();
  }, [toast]);
  
  const isCanteenClosed = canteenStatus === 'not_taking_orders';
  
  const filteredItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const availableItems = filteredItems.filter(item => item.available);
  const unavailableItems = filteredItems.filter(item => !item.available);
  const sortedItems = [...availableItems, ...unavailableItems];

  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );
  
  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }
  
  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }

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

  return (
    <Card>
       <CardHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search menu..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
       {isCanteenClosed && (
        <div className="p-4 border-b">
          <Alert variant="destructive">
            <ShoppingCart className="h-4 w-4" />
            <AlertTitle>Not Taking Orders</AlertTitle>
            <AlertDescription>
              The canteen is currently closed for new orders. Please check back later.
            </AlertDescription>
          </Alert>
        </div>
      )}
      <CardContent className="p-0">
        {menuItems.length === 0 && !loading ? (
           <div className="text-center py-16">
             <p className="text-muted-foreground">The menu is empty. The admin can add items from the dashboard.</p>
           </div>
        ) : paginatedItems.length > 0 ? (
          <div className="divide-y">
              {paginatedItems.map((item) => (
                item.available ? (
                  <MenuListItem key={item.id} item={item} disabled={!user || isCanteenClosed} />
                ) : (
                  <div key={item.id} className="p-4 flex justify-between items-center opacity-50">
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">₹{item.price}</p>
                    </div>
                    <Badge variant="outline">Unavailable</Badge>
                  </div>
                )
              ))}
          </div>
        ) : (
           <div className="text-center py-16">
            <p className="text-muted-foreground">No items match your search.</p>
          </div>
        )}
      </CardContent>
       {totalPages > 1 && (
        <div className="flex justify-center items-center p-4 gap-4 border-t">
          <Button onClick={handlePrevPage} disabled={currentPage === 1} variant="outline">
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button onClick={handleNextPage} disabled={currentPage === totalPages} variant="outline">
            Next
          </Button>
        </div>
      )}
    </Card>
  );
}
