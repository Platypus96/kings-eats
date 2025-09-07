import { MenuDisplay } from "@/components/menu/menu-display";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

function MenuSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden">
          <Skeleton className="h-[200px] w-full" />
          <div className="p-6 space-y-4">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Home() {
  return (
    <div className="container py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Today's Menu</h1>
        <p className="text-muted-foreground mt-2">Delicious meals, ready to be ordered.</p>
      </header>
      <Suspense fallback={<MenuSkeleton />}>
        <MenuDisplay />
      </Suspense>
    </div>
  );
}
