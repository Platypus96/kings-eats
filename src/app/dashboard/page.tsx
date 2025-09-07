"use client";

import { AdminDashboardTabs } from "@/components/admin/admin-dashboard-tabs";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (!user.isAdmin) {
        router.push("/");
      }
    }
  }, [user, loading, router]);

  if (loading || !user || !user.isAdmin) {
    return (
       <div className="flex h-screen w-full items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-2">Manage orders and update the menu.</p>
      </header>
      <AdminDashboardTabs />
    </div>
  );
}
