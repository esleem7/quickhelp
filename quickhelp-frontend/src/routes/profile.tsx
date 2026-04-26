import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardShell } from "@/components/dashboard-shell";
import { RequestCard } from "@/components/request-card";
import { sampleRequests } from "@/lib/sample-data";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  ShieldCheck,
  Star,
  MapPin,
  Pencil,
  Wrench,
  Truck,
  ShoppingBag,
  BookOpen,
  Clock,
  CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Profile — QuickHelp" },
      {
        name: "description",
        content: "Your QuickHelp profile, skills, trust score and reviews.",
      },
    ],
  }),
  component: ProfilePage,
});

const skills = [
  { label: "Tech support", icon: Wrench },
  { label: "Moving help", icon: Truck },
  { label: "Errands", icon: ShoppingBag },
  { label: "Study help", icon: BookOpen },
];

const availability = ["Available now", "Weekends", "Evenings"];

const reviews = [
  {
    name: "Mehdi A.",
    initials: "MA",
    rating: 5,
    text: "Sarah was on time and super helpful. Highly recommend!",
    time: "2 days ago",
  },
  {
    name: "Ines K.",
    initials: "IK",
    rating: 5,
    text: "Very friendly and patient with my Wi-Fi setup. Fixed in 20 min.",
    time: "1 week ago",
  },
  {
    name: "Hamza R.",
    initials: "HR",
    rating: 4,
    text: "Great communication, would call again.",
    time: "2 weeks ago",
  },
];

function ProfilePage() {
  return (
    <DashboardShell>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Header */}
          <Card className="overflow-hidden rounded-2xl">
            <div className="h-28 bg-[image:var(--gradient-hero)]" />
            <div className="p-6 -mt-14">
              <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-[var(--shadow-card)]">
                  <AvatarFallback className="bg-[image:var(--gradient-accent)] text-white text-2xl font-semibold">
                    SK
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl font-bold">Sarah Khelifi</h1>
                    <ShieldCheck className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" /> La Marsa, Tunis
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-warning text-warning" /> 4.9 · 32 helps
                    </span>
                  </div>
                </div>
                <Button variant="outline" className="rounded-full">
                  <Pencil className="h-4 w-4" /> Edit profile
                </Button>
              </div>

              <Separator className="my-6" />

              <div>
                <h2 className="font-semibold mb-2">About</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Hi! I'm Sarah, a software engineer who loves helping neighbors with
                  tech setups, light moving and errands. I'm friendly, patient and always
                  on time.
                </p>
              </div>
            </div>
          </Card>

          {/* Skills */}
          <Card className="p-6 rounded-2xl">
            <h2 className="font-semibold mb-4">Skills & help categories</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {skills.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-muted/40 hover:bg-primary-soft/50 transition"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[image:var(--gradient-accent)] text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="text-sm font-medium">{s.label}</span>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Availability */}
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-primary" />
              <h2 className="font-semibold">Availability</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {availability.map((a) => (
                <Badge
                  key={a}
                  className="bg-secondary-soft text-secondary-foreground border-secondary/20 border"
                >
                  {a}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Reviews */}
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Reviews</h2>
              <span className="text-sm text-muted-foreground">{reviews.length} recent</span>
            </div>
            <div className="space-y-4">
              {reviews.map((r, i) => (
                <div key={i}>
                  <div className="flex gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-muted text-xs font-semibold">
                        {r.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-sm">{r.name}</p>
                        <span className="text-xs text-muted-foreground">{r.time}</span>
                      </div>
                      <div className="flex gap-0.5 my-1">
                        {Array.from({ length: 5 }).map((_, k) => (
                          <Star
                            key={k}
                            className={
                              k < r.rating
                                ? "h-3.5 w-3.5 fill-warning text-warning"
                                : "h-3.5 w-3.5 text-muted-foreground/30"
                            }
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">{r.text}</p>
                    </div>
                  </div>
                  {i < reviews.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </Card>

          {/* My requests */}
          <div>
            <h2 className="font-semibold mb-3">My requests</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {sampleRequests.slice(0, 2).map((r) => (
                <RequestCard key={r.id} req={r} showActions={false} />
              ))}
            </div>
          </div>
        </div>

        {/* Trust sidebar */}
        <aside className="space-y-6">
          <Card className="p-6 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-secondary" />
              <h3 className="font-semibold">Trust score</h3>
            </div>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold">94</p>
              <p className="text-xs text-muted-foreground">out of 100</p>
            </div>
            <div className="space-y-3 text-sm">
              <TrustRow label="Average rating" value="4.9 / 5" pct={98} />
              <TrustRow label="Response time" value="< 8 min" pct={92} />
              <TrustRow label="Completed requests" value="32" pct={85} />
              <TrustRow label="Positive feedback" value="97%" pct={97} />
            </div>
          </Card>

          <Card className="p-5 rounded-2xl bg-primary-soft border-primary/20">
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle2 className="h-4 w-4 text-secondary" />
              <p className="text-sm font-semibold">Verified neighbor</p>
            </div>
            <p className="text-xs text-muted-foreground">
              ID, phone and email confirmed by QuickHelp.
            </p>
            <Button asChild variant="link" className="px-0 h-auto mt-2 text-sm">
              <Link to="/dashboard">Learn about verification</Link>
            </Button>
          </Card>
        </aside>
      </div>
    </DashboardShell>
  );
}

function TrustRow({ label, value, pct }: { label: string; value: string; pct: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium">{value}</span>
      </div>
      <Progress value={pct} className="h-1.5" />
    </div>
  );
}
