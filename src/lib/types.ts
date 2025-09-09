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

export type OrderStatus = 'Pending' | 'Approved' | 'Declined' | 'Out for Delivery' | 'Completed';

export interface Notification {
  id: string;
  orderId: string;
  message: string;
  read: boolean;
  createdAt: any; // Firestore timestamp
}

export interface CanteenStatus {
    status: 'taking_orders' | 'not_taking_orders';
}


export interface Order {
  id:string;
  userId: string;
  userEmail: string;
  phone: string;
  hostel: string;
  instructions?: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: any; // Firestore timestamp
  completionTime?: any; // Firestore timestamp
}
