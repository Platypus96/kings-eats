"use client";

import { useState, useEffect } from 'react';
import type { Order, OrderStatus } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { OrderStatusBadge } from '@/components/shared/order-status-badge';
import { format } from 'date-fns';
import { Skeleton } from '../ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { MoreHorizontal } from 'lucide-react';
import { updateOrderStatus } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';

// Mock data simulation for all orders
const mockAllOrders: Order[] = [
  { id: '3', userId: 'user1', userEmail: 'iit2022001@iiita.ac.in', items: [{ id: '4', name: 'Chole Bhature', price: 70, quantity: 1, imageUrl: '', description: '', available: true }], total: 70, status: 'Pending', createdAt: { toDate: () => new Date('2023-10-28T12:00:00Z') } },
  { id: '2', userId: 'user2', userEmail: 'iit2022002@iiita.ac.in', items: [{ id: '2', name: 'Chicken Biryani', price: 120, quantity: 1, imageUrl: '', description: '', available: true }], total: 120, status: 'Approved', createdAt: { toDate: () => new Date('2023-10-28T11:30:00Z') } },
  { id: '1', userId: 'user3', userEmail: 'iit2022003@iiita.ac.in', items: [{ id: '1', name: 'Veg Thali', price: 80, quantity: 2, imageUrl: '', description: '', available: true }], total: 160, status: 'Completed', createdAt: { toDate: () => new Date('2023-10-27T10:00:00Z') } },
  { id: '4', userId: 'user4', userEmail: 'iit2022004@iiita.ac.in', items: [{ id: '3', name: 'Paneer Butter Masala', price: 100, quantity: 1, imageUrl: '', description: '', available: true }], total: 100, status: 'Declined', createdAt: { toDate: () => new Date('2023-10-26T19:00:00Z') } },
];

async function getAllOrders(): Promise<Order[]> {
    // In a real app, you would fetch all orders from Firestore and listen for snapshots.
    return new Promise(resolve => setTimeout(() => resolve(mockAllOrders), 1000));
}

export function OrderManagement() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    useEffect(() => {
        const fetchOrders = async () => {
            const allOrders = await getAllOrders();
            setOrders(allOrders.sort((a, b) => b.createdAt.toDate().getTime() - a.createdAt.toDate().getTime()));
            setLoading(false);
        };
        fetchOrders();
    }, []);

    const handleStatusUpdate = async (orderId: string, status: OrderStatus) => {
        const originalOrders = [...orders];
        // Optimistically update UI
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));

        const result = await updateOrderStatus(orderId, status);
        if (!result.success) {
            toast({ variant: 'destructive', title: 'Update Failed', description: result.message });
            setOrders(originalOrders); // Revert on failure
        } else {
            toast({ title: 'Success', description: `Order ${orderId} has been ${status.toLowerCase()}.` });
        }
    };
    
    if (loading) {
        return <Card><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent><div className="space-y-2"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div></CardContent></Card>;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>View and manage all incoming orders.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead className="hidden md:table-cell">Items</TableHead>
                            <TableHead className="hidden sm:table-cell text-center">Total</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>
                                    <div className="font-medium">{order.userEmail}</div>
                                    <div className="text-xs text-muted-foreground">{format(order.createdAt.toDate(), 'PPp')}</div>
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</TableCell>
                                <TableCell className="hidden sm:table-cell text-center">₹{order.total}</TableCell>
                                <TableCell className="text-center"><OrderStatusBadge status={order.status} /></TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                <span className="sr-only">Open menu</span>
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Approved')}>Approve</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Declined')}>Decline</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order.id, 'Completed')}>Mark as Completed</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
