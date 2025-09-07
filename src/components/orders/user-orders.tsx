"use client";

import { useState, useEffect } from 'react';
import type { Order } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderStatusBadge } from '@/components/shared/order-status-badge';
import { format } from 'date-fns';
import { Skeleton } from '../ui/skeleton';

// Mock data simulation
const mockOrders: Order[] = [
  { id: '1', userId: 'test-user-id', userEmail: 'test@iiita.ac.in', items: [{ id: '1', name: 'Veg Thali', price: 80, quantity: 2, imageUrl: '', description: '', available: true }], total: 160, status: 'Completed', createdAt: { toDate: () => new Date('2023-10-27T10:00:00Z') } },
  { id: '2', userId: 'test-user-id', userEmail: 'test@iiita.ac.in', items: [{ id: '2', name: 'Chicken Biryani', price: 120, quantity: 1, imageUrl: '', description: '', available: true }], total: 120, status: 'Approved', createdAt: { toDate: () => new Date('2023-10-28T11:30:00Z') } },
  { id: '3', userId: 'test-user-id', userEmail: 'test@iiita.ac.in', items: [{ id: '4', name: 'Chole Bhature', price: 70, quantity: 1, imageUrl: '', description: '', available: true }, { id: '8', name: 'Cold Drink', price: 20, quantity: 1, imageUrl: '', description: '', available: true }], total: 90, status: 'Pending', createdAt: { toDate: () => new Date('2023-10-28T12:00:00Z') } },
  { id: '4', userId: 'test-user-id', userEmail: 'test@iiita.ac.in', items: [{ id: '3', name: 'Paneer Butter Masala', price: 100, quantity: 1, imageUrl: '', description: '', available: true }], total: 100, status: 'Declined', createdAt: { toDate: () => new Date('2023-10-26T19:00:00Z') } },
];

async function getUserOrders(userId: string): Promise<Order[]> {
  // In a real app, you would fetch from Firestore where userId matches, and listen for snapshots.
  console.log(`Fetching orders for user: ${userId}`);
  return new Promise(resolve => setTimeout(() => resolve(mockOrders), 1000));
}


export function UserOrders({ userId }: { userId: string }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const userOrders = await getUserOrders(userId);
      setOrders(userOrders.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()));
      setLoading(false);
    };
    fetchOrders();
  }, [userId]);

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
                  <div className="text-sm text-muted-foreground md:hidden">Total: ₹{order.total}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-center">₹{order.total}</TableCell>
                <TableCell className="hidden sm:table-cell text-center"><OrderStatusBadge status={order.status} /></TableCell>
                <TableCell className="text-right">{format(order.createdAt.toDate(), 'PPp')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
