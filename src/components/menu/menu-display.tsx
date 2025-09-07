"use client";

import { useState, useEffect } from 'react';
import { MenuCard } from "./menu-card";
import type { MenuItem } from "@/lib/types";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

// Mock data simulation - in a real app, this would be a Firestore call
const mockMenuItems: MenuItem[] = [
  { id: '1', name: 'Veg Thali', price: 80, description: 'A complete meal with rice, roti, dal, and sabzi.', imageUrl: 'https://picsum.photos/400/300?id=1', available: true, 'data-ai-hint': "veg thali" },
  { id: '2', name: 'Chicken Biryani', price: 120, description: 'Flavorful and aromatic long-grain rice with chicken.', imageUrl: 'https://picsum.photos/400/300?id=2', available: true, 'data-ai-hint': "chicken biryani" },
  { id: '3', name: 'Paneer Butter Masala', price: 100, description: 'Creamy and rich paneer dish.', imageUrl: 'https://picsum.photos/400/300?id=3', available: true, 'data-ai-hint': "paneer masala" },
  { id: '4', name: 'Chole Bhature', price: 70, description: 'Spicy chickpeas with fluffy fried bread.', imageUrl: 'https://picsum.photos/400/300?id=4', available: true, 'data-ai-hint': "chole bhature" },
  { id: '5', name: 'Masala Dosa', price: 60, description: 'Crispy rice pancake with potato filling.', imageUrl: 'https://picsum.photos/400/300?id=5', available: false, 'data-ai-hint': "masala dosa" },
  { id: '6', name: 'Samosa (2 pcs)', price: 30, description: 'Fried pastry with a savory filling.', imageUrl: 'https://picsum.photos/400/300?id=6', available: true, 'data-ai-hint': "samosa" },
  { id: '7', name: 'Special Non-Veg Thali', price: 150, description: 'A king-sized meal for the hungry.', imageUrl: 'https://picsum.photos/400/300?id=7', available: true, 'data-ai-hint': "nonveg thali" },
  { id: '8', name: 'Cold Drink', price: 20, description: 'Chilled soft drink to quench your thirst.', imageUrl: 'https://picsum.photos/400/300?id=8', available: true, 'data-ai-hint': "cold drink" },
];


async function getMenuItems(): Promise<MenuItem[]> {
  // In a real app, you would fetch from Firestore here using onSnapshot for real-time updates.
  // For now, we simulate a network delay and return mock data.
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(mockMenuItems);
    }, 1000);
  });
}

export function MenuDisplay() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      const items = await getMenuItems();
      setMenuItems(items);
      setLoading(false);
    };
    fetchMenu();
  }, []);

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
