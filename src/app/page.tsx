import { MenuDisplay } from "@/components/menu/menu-display";

export default function Home() {
  return (
    <div className="container py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Today's Menu</h1>
        <p className="text-muted-foreground mt-2">Delicious meals, ready to be ordered.</p>
      </header>
      <MenuDisplay />
    </div>
  );
}
