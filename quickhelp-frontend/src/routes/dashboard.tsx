import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RequestCard } from "@/components/request-card";
import {
  MapPin,
  Plus,
  ListChecks,
  CheckCircle2,
  Star,
  Activity,
  Sparkles,
  ArrowRight,
  Search,
  MessageSquare,
  User,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { api, getStoredUser } from "@/lib/api";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — QuickHelp" },
      { name: "description", content: "Manage your help requests and activity." },
    ],
  }),
  component: Dashboard,
});

const statusStyles: Record<string, string> = {
  open: "bg-muted text-muted-foreground",
  in_progress: "bg-warning/15 text-warning-foreground",
  completed: "bg-secondary-soft text-secondary-foreground",
  cancelled: "bg-destructive/10 text-destructive",
};

const statusLabels: Record<string, string> = {
  open: "Open",
  in_progress: "In progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

function Dashboard() {
  const user = getStoredUser();
  const userName = user?.full_name?.split(" ")[0] || "there";
  const userCity = user?.city || "your area";

  const [allRequests, setAllRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    api
      .getRequests()
      .then((data) => setAllRequests(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  // Split requests
  const myRequests = user?.id
    ? allRequests.filter((r: any) => r.requester_id === user.id)
    : [];
  const activeMyRequests = myRequests.filter(
    (r: any) => r.status === "open" || r.status === "in_progress",
  );
  const nearbyRequests = user?.id
    ? allRequests.filter((r: any) => r.requester_id !== user.id).slice(0, 4)
    : allRequests.slice(0, 4);

  const completedCount = myRequests.filter((r: any) => r.status === "completed").length;
  const activeCount = activeMyRequests.length;

  const stats = [
    { label: "Active requests", value: activeCount, icon: Activity, color: "text-primary bg-primary-soft" },
    { label: "Total posted", value: myRequests.length, icon: ListChecks, color: "text-accent-foreground bg-primary-soft" },
    { label: "Completed", value: completedCount, icon: CheckCircle2, color: "text-secondary-foreground bg-secondary-soft" },
    { label: "Avg. rating", value: user?.rating_average ? Number(user.rating_average).toFixed(1) : "—", icon: Star, color: "text-warning-foreground bg-warning/20" },
  ];

  return (
    <DashboardShell>
      {/* Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Good morning, {userName} 👋</h1>
          <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
            <MapPin className="h-3.5 w-3.5" /> {userCity}
          </div>
        </div>
        <Link to="/create-request">
          <Button className="rounded-full shadow-[var(--shadow-soft)]">
            <Plus className="h-4 w-4 mr-1" /> Post a new request
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="p-5 rounded-2xl border-border/60">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
            </Card>
          );
        })}
      </div>

      {/* AI Suggestion */}
      <Card className="p-6 rounded-2xl border-border/60 mb-6 bg-[image:var(--gradient-hero)] relative overflow-hidden">
        <div className="flex items-start gap-4">
          <div className="h-11 w-11 rounded-xl bg-[image:var(--gradient-accent)] text-white flex items-center justify-center flex-shrink-0 shadow-[var(--shadow-soft)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <Badge variant="outline" className="mb-2 rounded-full bg-white">AI recommendation</Badge>
            <h3 className="font-semibold mb-1">
              {nearbyRequests.length > 0
                ? `${nearbyRequests.length} help requests nearby`
                : "No nearby requests right now"}
            </h3>
            <p className="text-sm text-muted-foreground">
              {nearbyRequests.length > 0
                ? "Check out requests from people in your area who need help."
                : "Check back later — new requests appear regularly."}
            </p>
          </div>
          <Link to="/browse">
            <Button variant="outline" size="sm" className="rounded-full bg-white hidden sm:inline-flex">
              View all <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </div>
      </Card>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2 space-y-6">
          {/* My active requests */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg">My active requests</h2>
              <Link to="/browse" className="text-sm text-primary hover:underline">View all</Link>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : activeMyRequests.length === 0 ? (
              <Card className="p-6 rounded-2xl text-center">
                <p className="text-sm text-muted-foreground">
                  You have no active requests.{" "}
                  <Link to="/create-request" className="text-primary hover:underline">Post one now</Link>
                </p>
              </Card>
            ) : (
              <div className="space-y-3">
                {activeMyRequests.map((r: any) => (
                  <Link key={r.id} to="/requests/$id" params={{ id: r.id }}>
                    <Card className="p-4 rounded-2xl border-border/60 flex flex-col sm:flex-row sm:items-center gap-3 hover:shadow-[var(--shadow-card)] transition-shadow cursor-pointer">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">{r.category}</Badge>
                          <Badge className={`text-xs ${statusStyles[r.status] || ""}`}>
                            {statusLabels[r.status] || r.status}
                          </Badge>
                        </div>
                        <div className="font-medium">{r.title}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                          <MapPin className="h-3 w-3" /> {r.city || "—"} · {r.urgency}
                        </div>
                      </div>
                      <Button variant="outline" size="sm" className="rounded-full">Open</Button>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Nearby */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold text-lg">Nearby requests</h2>
              <Link to="/browse" className="text-sm text-primary hover:underline">Browse all</Link>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : nearbyRequests.length === 0 ? (
              <Card className="p-6 rounded-2xl text-center">
                <p className="text-sm text-muted-foreground">No nearby requests found.</p>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {nearbyRequests.slice(0, 2).map((r: any) => (
                  <RequestCard key={r.id} req={r} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar column */}
        <div className="space-y-6">
          {/* Quick actions */}
          <Card className="p-5 rounded-2xl border-border/60">
            <h3 className="font-semibold mb-3">Quick actions</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { icon: Plus, label: "Post", to: "/create-request" },
                { icon: Search, label: "Browse", to: "/browse" },
                { icon: MessageSquare, label: "Messages", to: "/messages" },
                { icon: User, label: "Profile", to: "/profile" },
              ].map((a) => {
                const Icon = a.icon;
                return (
                  <Link key={a.label} to={a.to}>
                    <Button variant="outline" className="w-full rounded-xl h-auto py-3 flex-col gap-1">
                      <Icon className="h-4 w-4" />
                      <span className="text-xs">{a.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </Card>

          {/* Recent messages */}
          <Card className="p-5 rounded-2xl border-border/60">
            <h3 className="font-semibold mb-3">Recent messages</h3>
            <div className="space-y-3">
              {[
                { from: "Mehdi B.", text: "On my way, ETA 10 min", ago: "2 min" },
                { from: "Ines T.", text: "Done! Driver installed.", ago: "1 h" },
                { from: "Karim L.", text: "Can we move to 5pm?", ago: "3 h" },
              ].map((m, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary-soft text-accent-foreground flex items-center justify-center text-sm font-medium">
                    {m.from[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">{m.from}</span>
                      <span className="text-muted-foreground">{m.ago}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{m.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent ratings */}
          <Card className="p-5 rounded-2xl border-border/60">
            <h3 className="font-semibold mb-3">Recent ratings</h3>
            <div className="space-y-3">
              {[
                { name: "Karim L.", stars: 5, note: "Super helpful and fast!" },
                { name: "Sami D.", stars: 5, note: "Friendly and on time." },
                { name: "Lina M.", stars: 4, note: "Good experience overall." },
              ].map((r, i) => (
                <div key={i} className="text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{r.name}</span>
                    <span className="flex">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <Star
                          key={k}
                          className={`h-3 w-3 ${k < r.stars ? "fill-warning text-warning" : "text-muted"}`}
                        />
                      ))}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">"{r.note}"</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardShell>
  );
}
