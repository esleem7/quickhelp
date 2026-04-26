import { createFileRoute } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { RequestCard } from "@/components/request-card";
import { Search, SlidersHorizontal, MapPin, List, Map as MapIcon, Sparkles, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Route = createFileRoute("/browse")({
  head: () => ({
    meta: [
      { title: "Browse help requests — QuickHelp" },
      { name: "description", content: "Discover nearby assistance requests you can help with." },
    ],
  }),
  component: Browse,
});

const categories = ["All", "Moving help", "Tech support", "Errands", "Study help", "Home tasks", "Administrative help"];
const urgencies = ["Any", "Urgent", "Today", "This week"];

function Filters({
  cat,
  setCat,
  urg,
  setUrg,
}: {
  cat: string;
  setCat: (v: string) => void;
  urg: string;
  setUrg: (v: string) => void;
}) {
  const [distance, setDistance] = useState([10]);
  const [reward, setReward] = useState([20]);

  return (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">Category</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition",
                cat === c
                  ? "border-primary bg-primary-soft text-accent-foreground"
                  : "border-border hover:bg-muted",
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div>
        <Label className="mb-2 block">Urgency</Label>
        <div className="flex flex-wrap gap-2">
          {urgencies.map((u) => (
            <button
              key={u}
              onClick={() => setUrg(u)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition",
                urg === u
                  ? "border-primary bg-primary-soft text-accent-foreground"
                  : "border-border hover:bg-muted",
              )}
            >
              {u}
            </button>
          ))}
        </div>
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <Label>Distance</Label>
          <span className="text-xs text-muted-foreground">{distance[0]} km</span>
        </div>
        <Slider value={distance} onValueChange={setDistance} max={50} step={1} />
      </div>
      <div>
        <div className="flex justify-between mb-2">
          <Label>Min reward</Label>
          <span className="text-xs text-muted-foreground">{reward[0]} TND</span>
        </div>
        <Slider value={reward} onValueChange={setReward} max={100} step={5} />
      </div>
      <div className="space-y-2">
        <Label>Other</Label>
        {[
          { id: "remote", label: "Remote OK" },
          { id: "rating", label: "Verified rating ≥ 4.5" },
          { id: "open", label: "Status: open" },
        ].map((o) => (
          <label key={o.id} className="flex items-center gap-2 text-sm cursor-pointer p-2 rounded-lg hover:bg-muted">
            <input type="checkbox" className="rounded" /> {o.label}
          </label>
        ))}
      </div>
    </div>
  );
}

function Browse() {
  const [view, setView] = useState<"list" | "map">("list");
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cat, setCat] = useState("All");
  const [urg, setUrg] = useState("Any");

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params: Record<string, string> = {};
    if (cat !== "All") params.category = cat;
    if (urg !== "Any") params.urgency = urg;

    api
      .getRequests(params)
      .then((data) => setRequests(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [cat, urg]);

  return (
    <DashboardShell>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Help requests near you</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Browse local people who could use your help right now.
        </p>
      </div>

      {/* Search bar */}
      <Card className="p-3 rounded-2xl border-border/60 mb-4 flex flex-col md:flex-row gap-2">
        <div className="flex-1 flex items-center gap-2 px-3 rounded-xl bg-muted/40">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by keyword, e.g. 'wifi', 'sofa'…"
            className="border-0 shadow-none focus-visible:ring-0 bg-transparent h-11"
          />
        </div>
        <div className="flex items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="rounded-xl lg:hidden">
                <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>Filters</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <Filters cat={cat} setCat={setCat} urg={urg} setUrg={setUrg} />
              </div>
            </SheetContent>
          </Sheet>
          <div className="flex rounded-xl border bg-muted/40 p-1">
            <button
              onClick={() => setView("list")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition",
                view === "list" ? "bg-background shadow-sm" : "text-muted-foreground",
              )}
            >
              <List className="h-3.5 w-3.5" /> List
            </button>
            <button
              onClick={() => setView("map")}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition",
                view === "map" ? "bg-background shadow-sm" : "text-muted-foreground",
              )}
            >
              <MapIcon className="h-3.5 w-3.5" /> Map
            </button>
          </div>
        </div>
      </Card>

      {/* Recommended */}
      {requests.length > 1 && (
        <Card className="p-5 rounded-2xl border-border/60 bg-[image:var(--gradient-hero)] mb-6">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-[image:var(--gradient-accent)] text-white flex items-center justify-center flex-shrink-0">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <Badge variant="outline" className="mb-1 rounded-full bg-white">Recommended for you</Badge>
              <p className="text-sm">
                <span className="font-semibold">New requests available</span> — check out the latest help requests near you.
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                "{requests[0]?.title}" · {requests[0]?.city || "Nearby"}
              </p>
            </div>
            <Button size="sm" className="rounded-full hidden sm:inline-flex">View</Button>
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        {/* Filters sidebar desktop */}
        <aside className="hidden lg:block">
          <Card className="p-5 rounded-2xl border-border/60 sticky top-6">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </h3>
            <Filters cat={cat} setCat={setCat} urg={urg} setUrg={setUrg} />
          </Card>
        </aside>

        {/* Results */}
        <div>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <Card className="p-8 rounded-2xl text-center">
              <p className="text-destructive font-medium mb-2">Failed to load requests</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </Card>
          ) : requests.length === 0 ? (
            <Card className="p-8 rounded-2xl text-center">
              <p className="font-medium mb-1">No requests found</p>
              <p className="text-sm text-muted-foreground">Try changing the filters or check back later.</p>
            </Card>
          ) : view === "list" ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {requests.map((r: any) => (
                <RequestCard key={r.id} req={r} />
              ))}
            </div>
          ) : (
            <div className="grid lg:grid-cols-[1fr_360px] gap-4">
              <Card className="rounded-2xl overflow-hidden border-border/60 min-h-[480px] relative bg-[image:var(--gradient-hero)]">
                <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_30%_40%,white,transparent_60%),radial-gradient(circle_at_70%_60%,white,transparent_50%)]" />
                {/* Pins */}
                {requests.slice(0, 5).map((r: any, i: number) => (
                  <div
                    key={r.id}
                    className="absolute"
                    style={{ top: `${20 + i * 12}%`, left: `${15 + i * 15}%` }}
                  >
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-[image:var(--gradient-accent)] text-white flex items-center justify-center shadow-[var(--shadow-elegant)] ring-4 ring-white">
                        <MapPin className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                ))}
                <div className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-white text-xs font-medium shadow-md">
                  Map preview
                </div>
              </Card>
              <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {requests.slice(0, 4).map((r: any) => (
                  <RequestCard key={r.id} req={r} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
