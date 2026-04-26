import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Search,
  ListChecks,
  MessageSquare,
  CreditCard,
  User,
  Settings,
  LifeBuoy,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const items = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/browse", label: "Browse", icon: Search },
  { to: "/dashboard", label: "My Requests", icon: ListChecks },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/payments", label: "Payments", icon: CreditCard },
  { to: "/profile", label: "Profile", icon: User },
  { to: "/dashboard", label: "Settings", icon: Settings },
];

const mobileItems = items.slice(0, 5).map((i) =>
  i.label === "Payments" ? { ...i, icon: Plus, label: "Post" } : i,
);

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  return (
    <div className="min-h-screen w-full bg-muted/30">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 w-64 flex-col border-r bg-background">
        <div className="h-16 flex items-center px-6 border-b">
          <Link to="/" className="flex items-center gap-2 font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-accent)] text-white">
              <LifeBuoy className="h-4 w-4" />
            </span>
            QuickHelp
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {items.map((item, i) => {
            const Icon = item.icon;
            const active = i === 0 && location.pathname === "/dashboard";
            return (
              <Link
                key={item.label}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
                  active
                    ? "bg-primary-soft text-accent-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t">
          <Link to="/create-request">
            <Button className="w-full rounded-full shadow-[var(--shadow-soft)]">
              <Plus className="h-4 w-4 mr-1" /> New request
            </Button>
          </Link>
        </div>
      </aside>

      <main className="lg:pl-64 pb-20 lg:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-7xl">{children}</div>
      </main>

      {/* Bottom nav mobile */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-30 border-t bg-background/95 backdrop-blur">
        <div className="grid grid-cols-5">
          {mobileItems.map((item, i) => {
            const Icon = item.icon;
            const isPost = item.label === "Post";
            return (
              <Link
                key={i}
                to={isPost ? "/create-request" : item.to}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-2 text-xs",
                  isPost ? "text-primary" : "text-muted-foreground",
                )}
              >
                <span
                  className={cn(
                    "flex items-center justify-center",
                    isPost &&
                      "h-10 w-10 rounded-full bg-[image:var(--gradient-accent)] text-white shadow-[var(--shadow-soft)] -mt-4",
                  )}
                >
                  <Icon className={cn(isPost ? "h-5 w-5" : "h-4 w-4")} />
                </span>
                {!isPost && item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
