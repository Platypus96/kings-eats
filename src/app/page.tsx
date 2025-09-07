import { MenuDisplay } from "@/components/menu/menu-display";

export default function Home() {
  return (
    <div className="container py-8">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Today's Menu</h1>
      </header>
      <MenuDisplay />
    </div>
  );
}
