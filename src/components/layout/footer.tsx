import { Github } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
            <span>Developer GitHub (platypus96)</span>
            <Link 
                href="https://github.com/Platypus96" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="platypus96's GitHub Profile"
            >
                <Github className="h-4 w-4 hover:text-primary transition-colors" />
            </Link>
        </div>
      </div>
    </footer>
  );
}
