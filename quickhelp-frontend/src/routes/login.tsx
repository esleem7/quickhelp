import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { LifeBuoy, ShieldCheck, Star, Users } from "lucide-react";
import { useState } from "react";
import { api, setAuth } from "@/lib/api";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Login — QuickHelp" },
      { name: "description", content: "Sign in to your QuickHelp account." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const res = await api.login({ email, password });
      setAuth(res.user, res.token);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      {/* Left brand panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[image:var(--gradient-accent)] text-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <Link to="/" className="flex items-center gap-2 font-bold text-lg relative">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <LifeBuoy className="h-5 w-5" />
          </span>
          QuickHelp
        </Link>
        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight">
            Welcome back to your local support network.
          </h2>
          <p className="mt-4 text-white/80 max-w-md">
            Pick up where you left off. Your community is right around the corner.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
            {[
              { icon: Users, label: "12k+ helpers" },
              { icon: Star, label: "4.9 avg rating" },
              { icon: ShieldCheck, label: "Verified" },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="p-3 rounded-xl bg-white/10 backdrop-blur text-center text-xs">
                  <Icon className="h-5 w-5 mx-auto mb-1" />
                  {s.label}
                </div>
              );
            })}
          </div>
        </div>
        <p className="text-xs text-white/70 relative">© QuickHelp · Built on trust</p>
      </div>

      {/* Right form */}
      <div className="flex items-center justify-center p-6 md:p-12">
        <Card className="w-full max-w-md p-8 rounded-3xl shadow-[var(--shadow-card)] border-border/60">
          <Link to="/" className="lg:hidden flex items-center gap-2 font-bold mb-6">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-accent)] text-white">
              <LifeBuoy className="h-4 w-4" />
            </span>
            QuickHelp
          </Link>
          <h1 className="text-2xl font-bold mb-1">Sign in</h1>
          <p className="text-sm text-muted-foreground mb-6">
            Join your local support network in seconds.
          </p>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" required className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" required className="rounded-xl h-11" />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <Checkbox id="remember" /> <span>Remember me</span>
              </label>
              <a href="#" className="text-primary hover:underline">Forgot password?</a>
            </div>
            <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl shadow-[var(--shadow-soft)]">
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-6">
            New to QuickHelp?{" "}
            <Link to="/register" className="text-primary font-medium hover:underline">
              Create an account
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
