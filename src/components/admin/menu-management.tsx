"use client";

import { useState, useEffect } from 'react';
import type { MenuItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '../ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2 } from 'lucide-react';
import { addMenuItem, deleteMenuItem, updateMenuItem } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { EditMenuItemDialog } from './edit-menu-item-dialog';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function MenuManagement() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
    const { toast } = useToast();

    useEffect(() => {
        const q = query(collection(db, "menu"), orderBy("name"));
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
    
    const fetchMenu = async () => {
        // This function is called by the dialog on success.
        // The onSnapshot listener will automatically update the UI.
    };

    const handleEdit = (item: MenuItem) => {
        setCurrentItem(item);
        setIsDialogOpen(true);
    };

    const handleAdd = () => {
        setCurrentItem(null);
        setIsDialogOpen(true);
    };

    const handleDelete = async (itemId: string) => {
        const result = await deleteMenuItem(itemId);
        if (result.success) {
            toast({ title: 'Success', description: 'Menu item deleted.' });
        } else {
            toast({ variant: 'destructive', title: 'Delete Failed', description: result.message });
        }
    };
    
    if (loading) {
        return <Card><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent><div className="space-y-2"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div></CardContent></Card>;
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Menu Items</CardTitle>
                    <CardDescription>Add, edit, or remove items from the menu.</CardDescription>
                </div>
                <Button onClick={handleAdd} size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Item
                </Button>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Item</TableHead>
                            <TableHead className="text-center">Price</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {menuItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell className="flex items-center gap-4">
                                    <Image src={item.imageUrl} alt={item.name} width={40} height={40} className="rounded-sm object-cover" data-ai-hint={item['data-ai-hint']}/>
                                    <span className="font-medium">{item.name}</span>
                                </TableCell>
                                <TableCell className="text-center">₹{item.price}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={item.available ? "default" : "secondary"}>
                                        {item.available ? 'Available' : 'Unavailable'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}>Edit</Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                <AlertDialogDescription>This will permanently delete "{item.name}" from the menu.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(item.id)} className="bg-destructive hover:bg-destructive/90">Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
            <EditMenuItemDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                item={currentItem}
                onFinished={fetchMenu}
            />
        </Card>
    );
}
