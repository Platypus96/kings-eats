"use client";

import { UserOrders } from "@/components/orders/user-orders";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function OrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">My Orders</h1>
        <p className="text-muted-foreground mt-2">View the status of your past and current orders.</p>
      </header>
      <UserOrders userId={user.uid} />
    </div>
  );
}
