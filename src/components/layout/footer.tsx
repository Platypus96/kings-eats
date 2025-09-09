import { Linkedin, Mail } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex items-center justify-center gap-6">
        <Link
          href="https://www.linkedin.com/in/adarsh-kumar-6a403a297/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Developer's LinkedIn Profile"
          className="text-muted-foreground"
        >
          <Linkedin className="h-5 w-5 hover:text-primary transition-colors" />
        </Link>
         <a
          href="mailto:kings.iiita@gmail.com"
          aria-label="Email for suggestions"
          className="text-muted-foreground flex items-center gap-2 hover:text-primary transition-colors"
        >
          <Mail className="h-5 w-5" />
          <span className="text-sm">Suggestions?</span>
        </a>
      </div>
    </footer>
  );
}
