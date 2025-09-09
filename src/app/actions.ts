"use server";

import { db } from "@/lib/firebase";
import type { CanteenStatus, CartItem, MenuItem, OrderStatus } from "@/lib/types";
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, getDocs, query, where, writeBatch, documentId } from "firebase/firestore";

interface PlaceOrderPayload {
  userId: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  phone: string;
  hostel: string;
  instructions?: string;
}

export async function placeOrder(payload: PlaceOrderPayload) {
  try {
    const orderDocRef = await addDoc(collection(db, "orders"), {
      ...payload,
      status: "Pending" as OrderStatus,
      createdAt: serverTimestamp(),
      completionTime: null,
    });
    return { success: true, message: "Order placed successfully.", orderId: orderDocRef.id };
  } catch (error) {
    console.error("Error placing order:", error);
    return { success: false, message: "Failed to place order." };
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus, completionTime: Date | null = null, userId: string, message: string) {
  try {
    const orderRef = doc(db, "orders", orderId);
    const dataToUpdate: { status: OrderStatus; completionTime?: Date | null } = { status };
    if (status === 'Approved') {
        dataToUpdate.completionTime = completionTime;
    }
    await updateDoc(orderRef, dataToUpdate);
    
    // Create a notification for the user
    if (userId && message) {
        const userNotificationsRef = collection(db, `users/${userId}/notifications`);
        await addDoc(userNotificationsRef, {
            orderId: orderId,
            message: message,
            read: false,
            createdAt: serverTimestamp(),
        });
    }

    return { success: true, message: `Order status updated to ${status}.` };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, message: "Failed to update order status." };
  }
}

export async function markNotificationAsRead(userId: string, notificationId: string) {
    try {
        const notificationRef = doc(db, `users/${userId}/notifications`, notificationId);
        await updateDoc(notificationRef, { read: true });
        return { success: true };
    } catch (error) {
        console.error("Error marking notification as read:", error);
        return { success: false };
    }
}


export async function updateMenuItem(itemId: string, data: Partial<MenuItem>) {
    try {
        const itemRef = doc(db, "menu", itemId);
        await updateDoc(itemRef, data);
        return { success: true, message: "Menu item updated." };
    } catch (error) {
        console.error("Error updating menu item:", error);
        return { success: false, message: "Failed to update menu item." };
    }
}

export async function addMenuItem(data: Omit<MenuItem, 'id' | 'imageUrl' | 'description'>) {
    try {
        const dataToSave = {
            ...data,
            description: "", // Default empty description
            imageUrl: `https://picsum.photos/seed/${Date.now()}/400/300`,
        };
        await addDoc(collection(db, "menu"), dataToSave);
        return { success: true, message: "Menu item added." };
    } catch (error) {
        console.error("Error adding menu item:", error);
        return { success: false, message: "Failed to add menu item." };
    }
}

export async function deleteMenuItem(itemId: string) {
    try {
        await deleteDoc(doc(db, "menu", itemId));
        return { success: true, message: "Menu item deleted." };
    } catch (error) {
        console.error("Error deleting menu item:", error);
        return { success: false, message: "Failed to delete menu item." };
    }
}


export async function updateCanteenStatus(status: CanteenStatus['status']) {
    try {
        const settingsRef = doc(db, "settings", "canteen");
        await updateDoc(settingsRef, { status: status });
        return { success: true, message: "Canteen status updated." };
    } catch (error) {
        console.error("Error updating canteen status:", error);
        return { success: false, message: "Failed to update status." };
    }
}
