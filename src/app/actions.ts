"use server";

import { db } from "@/lib/firebase";
import type { CartItem, MenuItem, OrderStatus } from "@/lib/types";
import { collection, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from "firebase/firestore";

interface PlaceOrderPayload {
  userId: string;
  userEmail: string;
  items: CartItem[];
  total: number;
}

export async function placeOrder(payload: PlaceOrderPayload) {
  try {
    await addDoc(collection(db, "orders"), {
      ...payload,
      status: "Pending" as OrderStatus,
      createdAt: serverTimestamp(),
    });
    return { success: true, message: "Order placed successfully." };
  } catch (error) {
    console.error("Error placing order:", error);
    return { success: false, message: "Failed to place order." };
  }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, { status });
    return { success: true, message: `Order status updated to ${status}.` };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, message: "Failed to update order status." };
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

export async function addMenuItem(data: Omit<MenuItem, 'id'>) {
    try {
        await addDoc(collection(db, "menu"), data);
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
