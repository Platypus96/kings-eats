import { Linkedin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-center text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
            <span>Developed by Adarsh Kumar</span>
            <Link 
                href="https://www.linkedin.com/in/adarsh-kumar-6a403a297/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="Adarsh Kumar's LinkedIn Profile"
            >
                <Linkedin className="h-4 w-4 hover:text-primary transition-colors" />
            </Link>
        </div>
      </div>
    </footer>
  );
}
