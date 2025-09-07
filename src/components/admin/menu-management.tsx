"use client";

import { useState, useEffect } from 'react';
import type { MenuItem } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '../ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle, Trash2, Terminal, Search } from 'lucide-react';
import { deleteMenuItem } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import { EditMenuItemDialog } from './edit-menu-item-dialog';
import { Badge } from '../ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Alert, AlertTitle, AlertDescription } from '../ui/alert';
import { Input } from '../ui/input';

const ITEMS_PER_PAGE = 5;

export function MenuManagement() {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
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
            setError(null);
        }, (err) => {
            console.error("Error fetching menu items: ", err);
            setError("Could not fetch menu items. Please make sure the database is set up correctly.");
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
    
    const filteredItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE);
    const paginatedItems = filteredItems.slice(
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
        return <Card><CardHeader><Skeleton className="h-8 w-48" /></CardHeader><CardContent><div className="space-y-2"><Skeleton className="h-12 w-full" /><Skeleton className="h-12 w-full" /></div></CardContent></Card>;
    }
    
    if (error) {
     return (
        <Card>
            <CardHeader>
                 <CardTitle>Menu Items</CardTitle>
                 <CardDescription>Add, edit, or remove items from the menu.</CardDescription>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error Fetching Menu</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </CardContent>
        </Card>
      );
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle>Menu Items</CardTitle>
                        <CardDescription>Add, edit, or remove items from the menu.</CardDescription>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                         <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                placeholder="Search menu..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={handleAdd} size="sm" className="shrink-0">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Item
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                 {menuItems.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No menu items found. Click "Add Item" to get started.</p>
                    </div>
                ) : paginatedItems.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-muted-foreground">No items match your search.</p>
                    </div>
                ) : (
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
                        {paginatedItems.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>
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
            <EditMenuItemDialog
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                item={currentItem}
                onFinished={fetchMenu}
            />
        </Card>
    );
}
