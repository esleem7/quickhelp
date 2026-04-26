import { LifeBuoy } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-10 grid gap-8 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-accent)] text-white">
              <LifeBuoy className="h-4 w-4" />
            </span>
            QuickHelp
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            Your local support network, available in minutes.
          </p>
        </div>
        {[
          { title: "Product", links: ["How it works", "Categories", "Pricing"] },
          { title: "Community", links: ["Helpers", "Stories", "Blog"] },
          { title: "Company", links: ["About", "Safety", "Contact"] },
        ].map((c) => (
          <div key={c.title}>
            <div className="font-semibold text-sm mb-3">{c.title}</div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {c.links.map((l) => (
                <li key={l}>
                  <a href="#" className="hover:text-foreground">
                    {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} QuickHelp. Built with care.
      </div>
    </footer>
  );
}
