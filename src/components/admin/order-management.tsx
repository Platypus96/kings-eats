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
import { MoreHorizontal, Terminal, Mail, Phone, Info, Home } from 'lucide-react';
import { updateOrderStatus } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { ApproveOrderDialog } from './approve-order-dialog';

export function OrderManagement() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const allOrders: Order[] = [];
            querySnapshot.forEach((doc) => {
                allOrders.push({ id: doc.id, ...doc.data() } as Order);
            });
            setOrders(allOrders);
            setLoading(false);
            setError(null);
        }, (err) => {
            console.error("Error fetching orders: ", err);
            setError("Could not fetch orders. Please make sure the database is set up correctly.");
            toast({ variant: 'destructive', title: 'Error', description: 'Could not fetch orders.' });
            setLoading(false);
        });

        return () => unsubscribe();
    }, [toast]);

    const handleStatusUpdate = async (order: Order, status: OrderStatus, completionTime: Date | null = null) => {
        
        let message = '';
        if (status === 'Approved' && completionTime) {
            message = `Your order has been approved and will be ready around ${format(completionTime, 'p')}.`;
        } else if (status === 'Declined') {
            message = `Your order has been declined. Please contact the canteen for more information.`;
        } else if (status === 'Completed') {
            message = `Your order is now marked as completed. Thank you!`;
        }

        const result = await updateOrderStatus(order.id, status, completionTime, order.userId, message);
        if (!result.success) {
            toast({ variant: 'destructive', title: 'Update Failed', description: result.message });
        } else {
            toast({ title: 'Success', description: `Order status updated.` });
        }
        setIsApproveDialogOpen(false);
    };

    const openApproveDialog = (order: Order) => {
        setSelectedOrder(order);
        setIsApproveDialogOpen(true);
    }
    
    if (loading) {
        return <Card><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent><div className="space-y-2"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div></CardContent></Card>;
    }

    if (error) {
     return (
        <Card>
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>View and manage all incoming orders.</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error Fetching Orders</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </CardContent>
        </Card>
      );
    }

    return (
        <>
        <Card>
            <CardHeader>
                <CardTitle>All Orders</CardTitle>
                <CardDescription>View and manage all incoming orders.</CardDescription>
            </CardHeader>
            <CardContent>
                 {orders.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No orders have been placed yet.</p>
                    </div>
                ) : (
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
                                    <div className="font-medium flex items-center gap-2"><Mail className="h-3 w-3 text-muted-foreground" /> {order.userEmail}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1"><Phone className="h-3 w-3" /> {order.phone}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1"><Home className="h-3 w-3" /> {order.hostel}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{order.createdAt ? format(order.createdAt.toDate(), 'PPp') : ''}</div>
                                    {order.instructions && (
                                        <div className="text-xs text-blue-400 mt-2 p-2 bg-blue-500/10 rounded-md flex items-start gap-2">
                                            <Info className="h-3 w-3 mt-0.5 shrink-0" />
                                            <span>{order.instructions}</span>
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell className="hidden md:table-cell">{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</TableCell>
                                <TableCell className="hidden sm:table-cell text-center">₹{order.total.toFixed(2)}</TableCell>
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
                                            <DropdownMenuItem onClick={() => openApproveDialog(order)} disabled={order.status !== 'Pending'}>Approve</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order, 'Declined')} disabled={order.status !== 'Pending'}>Decline</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleStatusUpdate(order, 'Completed')} disabled={order.status === 'Completed' || order.status === 'Declined'}>Mark as Completed</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                )}
            </CardContent>
        </Card>
        {selectedOrder && (
            <ApproveOrderDialog 
                isOpen={isApproveDialogOpen}
                setIsOpen={setIsApproveDialogOpen}
                order={selectedOrder}
                onConfirm={(orderId, status, completionTime) => handleStatusUpdate(selectedOrder, status, completionTime)}
            />
        )}
      </>
    );
}
