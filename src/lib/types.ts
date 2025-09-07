import type { User as FirebaseUser } from "firebase/auth";

export interface User extends FirebaseUser {
  isAdmin: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  available: boolean;
  'data-ai-hint'?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export type OrderStatus = 'Pending' | 'Approved' | 'Declined' | 'Completed';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: any; // Firestore timestamp
  completionTime?: any; // Firestore timestamp
}
