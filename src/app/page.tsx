import { MenuDisplay } from "@/components/menu/menu-display";
import Link from "next/link";

export default function Home() {
  return (
    <div className="container py-8">
      <header className="mb-8 flex items-baseline justify-center gap-4">
        <h1 className="text-4xl font-bold tracking-tight text-primary">Today's Menu</h1>
        <Link 
          href="https://drive.google.com/file/d/16kKndY0r9WMyAvgZe-wSH2QV3ujyiOAn/view?usp=sharing" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-muted-foreground hover:text-primary transition-colors underline underline-offset-4"
        >
          Regular Menu
        </Link>
      </header>
      <MenuDisplay />
    </div>
  );
}
