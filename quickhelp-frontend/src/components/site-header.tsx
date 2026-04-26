import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { LifeBuoy, Menu, X } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const links = [
    { to: "/#how", label: "How it works" },
    { to: "/#categories", label: "Categories" },
    { to: "/#safety", label: "Safety" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[image:var(--gradient-accent)] text-white shadow-[var(--shadow-soft)]">
            <LifeBuoy className="h-5 w-5" />
          </span>
          <span className="bg-[image:var(--gradient-accent)] bg-clip-text text-transparent">
            QuickHelp
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.to}
              href={l.to}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">
              Login
            </Button>
          </Link>
          <Link to="/create-request">
            <Button size="sm" className="rounded-full shadow-[var(--shadow-soft)]">
              Get Help
            </Button>
          </Link>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background px-4 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.to}
              href={l.to}
              onClick={() => setOpen(false)}
              className="block text-sm font-medium text-muted-foreground"
            >
              {l.label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <Link to="/login" className="flex-1">
              <Button variant="outline" className="w-full">
                Login
              </Button>
            </Link>
            <Link to="/create-request" className="flex-1">
              <Button className="w-full">Get Help</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
