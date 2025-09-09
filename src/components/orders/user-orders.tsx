"use client";

import { useState, useEffect } from 'react';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderStatusBadge } from '@/components/shared/order-status-badge';
import { format } from 'date-fns';
import { Skeleton } from '../ui/skeleton';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Terminal, CheckCircle2, Home } from 'lucide-react';

export function UserOrders({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!userId) {
        setLoading(false);
        return;
    };

    const q = query(
      collection(db, "orders"),
      where("userId", "==", userId),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const userOrders: Order[] = [];
      querySnapshot.forEach((doc) => {
        userOrders.push({ id: doc.id, ...doc.data() } as Order);
      });
      setOrders(userOrders);
      setLoading(false);
      setError(null);
    }, (err) => {
        console.error("Error fetching user orders: ", err);
        setError("Could not fetch your orders. Please contact support if the problem persists.");
        toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch your orders.' });
        setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, toast]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
     return (
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error Fetching Orders</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (orders.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardHeader>
          <CardTitle>No Orders Yet</CardTitle>
          <CardDescription>You haven't placed any orders. Start by adding items from the menu.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Details</TableHead>
              <TableHead className="hidden md:table-cell text-center">Total</TableHead>
              <TableHead className="hidden sm:table-cell text-center">Status</TableHead>
              <TableHead className="text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="font-medium">{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1"><Home className="h-3 w-3" /> {order.hostel}</div>
                  <div className="text-sm text-muted-foreground md:hidden">Total: ₹{order.total.toFixed(2)}</div>
                   <div className="mt-2 sm:hidden">
                    <OrderStatusBadge status={order.status} />
                  </div>
                  {order.status === 'Approved' && order.completionTime && (
                     <div className="flex items-center text-sm text-green-500 mt-2">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        <span>Ready around {format(order.completionTime.toDate(), 'p')}</span>
                     </div>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell text-center">₹{order.total.toFixed(2)}</TableCell>
                <TableCell className="hidden sm:table-cell text-center"><OrderStatusBadge status={order.status} /></TableCell>
                <TableCell className="text-right">{order.createdAt ? format(order.createdAt.toDate(), 'PPp') : ''}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
