import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RequestCard } from "@/components/request-card";
import { sampleRequests } from "@/lib/sample-data";
import { api } from "@/lib/api";
import {
  ArrowRight,
  MapPin,
  MessageSquare,
  Star,
  ShieldCheck,
  Truck,
  Laptop,
  ShoppingBag,
  GraduationCap,
  Home,
  FileText,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { useState, useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QuickHelp — Get help nearby, when you need it most" },
      {
        name: "description",
        content:
          "QuickHelp connects people who need urgent everyday help with nearby available helpers. Post a request and get matched in minutes.",
      },
      { property: "og:title", content: "QuickHelp — Local help in minutes" },
      {
        property: "og:description",
        content: "Real-time local assistance from trusted neighbors.",
      },
    ],
  }),
  component: Landing,
});

const categories = [
  { icon: Truck, name: "Moving help", color: "from-blue-500/10 to-blue-500/5" },
  { icon: Laptop, name: "Tech support", color: "from-emerald-500/10 to-emerald-500/5" },
  { icon: ShoppingBag, name: "Errands", color: "from-amber-500/10 to-amber-500/5" },
  { icon: GraduationCap, name: "Study help", color: "from-violet-500/10 to-violet-500/5" },
  { icon: Home, name: "Home tasks", color: "from-rose-500/10 to-rose-500/5" },
  { icon: FileText, name: "Administrative", color: "from-cyan-500/10 to-cyan-500/5" },
];

function Landing() {
  const [liveRequests, setLiveRequests] = useState<any[]>([]);
  const [loadingLive, setLoadingLive] = useState(true);

  useEffect(() => {
    api
      .getRequests()
      .then((data) => setLiveRequests(data.slice(0, 3)))
      .catch(() => {
        // Fallback to sample data if API is unavailable
        setLiveRequests([]);
      })
      .finally(() => setLoadingLive(false));
  }, []);

  // Use API data if available, otherwise fallback to sample
  const displayRequests = liveRequests.length > 0 ? liveRequests : sampleRequests.slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[image:var(--gradient-hero)]">
        <div className="container mx-auto px-4 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge className="mb-5 rounded-full bg-white text-accent-foreground border border-primary/20 hover:bg-white">
              <Sparkles className="h-3 w-3 mr-1" /> Now available in your city
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Get help nearby,{" "}
              <span className="bg-[image:var(--gradient-accent)] bg-clip-text text-transparent">
                when you need it most.
              </span>
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl">
              Post a quick request and connect with available helpers around you in
              minutes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link to="/create-request">
                <Button size="lg" className="rounded-full shadow-[var(--shadow-elegant)] w-full sm:w-auto">
                  Post a request <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/browse">
                <Button size="lg" variant="outline" className="rounded-full bg-white w-full sm:w-auto">
                  Browse requests
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-secondary" /> Verified helpers
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-warning fill-warning" /> 4.9 average
              </div>
            </div>
          </div>

          {/* Illustration card */}
          <div className="relative">
            <div className="absolute -top-4 -left-4 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="absolute -bottom-4 -right-4 h-72 w-72 rounded-full bg-secondary/20 blur-3xl" />
            <Card className="relative p-6 rounded-3xl shadow-[var(--shadow-elegant)] border-border/50">
              <div className="flex items-center justify-between mb-4">
                <Badge className="bg-destructive/10 text-destructive border border-destructive/20 rounded-full">
                  ● Urgent · 0.4 km away
                </Badge>
                <span className="text-xs text-muted-foreground">2 min ago</span>
              </div>
              <h3 className="font-semibold text-lg">Need help carrying boxes upstairs</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Moving in today, 4 boxes from car to 2nd floor. Should take 15 min.
              </p>
              <div className="mt-4 flex items-center gap-3 text-sm">
                <div className="flex h-9 w-9 rounded-full bg-primary-soft items-center justify-center text-accent-foreground font-medium">
                  S
                </div>
                <div>
                  <div className="font-medium">Sarah K.</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Star className="h-3 w-3 fill-warning text-warning" /> 4.9 · 23 helps
                  </div>
                </div>
                <div className="ml-auto font-semibold bg-secondary-soft text-secondary-foreground px-3 py-1 rounded-lg">
                  20 TND
                </div>
              </div>
              <Button className="w-full mt-5 rounded-full">Offer help</Button>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <Badge variant="outline" className="rounded-full mb-3">How it works</Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Help in three simple steps</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: MessageSquare, title: "Post your request", desc: "Tell us what you need in less than 60 seconds." },
            { icon: MapPin, title: "Get matched nearby", desc: "Verified helpers around you respond in minutes." },
            { icon: CheckCircle2, title: "Chat, confirm & rate", desc: "Coordinate, complete the help, leave a review." },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <Card key={i} className="p-7 rounded-2xl border-border/60 text-center hover:shadow-[var(--shadow-card)] transition">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-[image:var(--gradient-accent)] text-white flex items-center justify-center shadow-[var(--shadow-soft)] mb-4">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-sm font-semibold text-primary mb-1">Step {i + 1}</div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Categories */}
      <section id="categories" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="rounded-full mb-3">Categories</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">What can we help with?</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((c) => {
              const Icon = c.icon;
              return (
                <Card
                  key={c.name}
                  className={`p-5 rounded-2xl border-border/60 hover:shadow-[var(--shadow-card)] hover:-translate-y-1 transition cursor-pointer bg-gradient-to-br ${c.color}`}
                >
                  <div className="h-11 w-11 rounded-xl bg-white shadow-[var(--shadow-soft)] flex items-center justify-center mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="font-medium text-sm">{c.name}</div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Live nearby preview */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <Badge variant="outline" className="rounded-full mb-3">Live now</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Nearby help requests</h2>
            <p className="text-muted-foreground mt-2">A live look at what your community needs right now.</p>
          </div>
          <Link to="/browse">
            <Button variant="outline" className="rounded-full">View all <ArrowRight className="ml-1 h-4 w-4" /></Button>
          </Link>
        </div>
        {loadingLive ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {displayRequests.map((r: any) => (
              <RequestCard key={r.id} req={r} />
            ))}
          </div>
        )}
      </section>

      {/* Trust */}
      <section id="safety" className="py-20 bg-[image:var(--gradient-hero)]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Badge variant="outline" className="rounded-full mb-3 bg-white">Trust & safety</Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Built on trust, by design</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: ShieldCheck, title: "Verified profiles", desc: "ID and phone verification for every helper." },
              { icon: Star, title: "Ratings & feedback", desc: "Transparent reviews after every help." },
              { icon: MessageSquare, title: "Secure communication", desc: "In-app chat keeps your contact info private." },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <Card key={i} className="p-7 rounded-2xl border-border/60 bg-white/80 backdrop-blur">
                  <div className="h-12 w-12 rounded-xl bg-secondary-soft text-secondary-foreground flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 container mx-auto px-4">
        <Card className="p-10 md:p-16 rounded-3xl text-center bg-[image:var(--gradient-accent)] text-white shadow-[var(--shadow-elegant)] border-0">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Need help today?</h2>
          <p className="text-white/90 max-w-xl mx-auto mb-8">
            Join your local support network in seconds. Your first request is one tap away.
          </p>
          <Link to="/create-request">
            <Button size="lg" variant="secondary" className="rounded-full bg-white text-primary hover:bg-white/90">
              Create your first request <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </Card>
      </section>

      <SiteFooter />
    </div>
  );
}
