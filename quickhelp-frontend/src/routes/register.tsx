import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { LifeBuoy, HandHeart, HeartHandshake, Sparkles } from "lucide-react";
import { useState } from "react";
import { api, setAuth } from "@/lib/api";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Create account — QuickHelp" },
      { name: "description", content: "Join QuickHelp to give and receive local help." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [role, setRole] = useState("both");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.target as HTMLFormElement;
    const full_name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("pwd") as HTMLInputElement).value;
    const confirmPwd = (form.elements.namedItem("cpwd") as HTMLInputElement).value;
    const city = (form.elements.namedItem("city") as HTMLInputElement).value;

    if (password !== confirmPwd) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.register({ full_name, email, password, city, role });
      setAuth(res.user, res.token);
      navigate({ to: "/dashboard" });
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="hidden lg:flex flex-col justify-between p-12 bg-[image:var(--gradient-accent)] text-white relative overflow-hidden">
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <Link to="/" className="flex items-center gap-2 font-bold text-lg relative">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
            <LifeBuoy className="h-5 w-5" />
          </span>
          QuickHelp
        </Link>
        <div className="relative">
          <h2 className="text-4xl font-bold leading-tight">
            Be part of a kinder, faster city.
          </h2>
          <p className="mt-4 text-white/80 max-w-md">
            Whether you need help or want to give it, QuickHelp connects you to neighbors in minutes.
          </p>
        </div>
        <p className="text-xs text-white/70 relative">© QuickHelp · Built on trust</p>
      </div>

      <div className="flex items-center justify-center p-6 md:p-12">
        <Card className="w-full max-w-md p-8 rounded-3xl shadow-[var(--shadow-card)] border-border/60">
          <Link to="/" className="lg:hidden flex items-center gap-2 font-bold mb-6">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[image:var(--gradient-accent)] text-white">
              <LifeBuoy className="h-4 w-4" />
            </span>
            QuickHelp
          </Link>
          <h1 className="text-2xl font-bold mb-1">Create your account</h1>
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
              <Label htmlFor="name">Full name</Label>
              <Input id="name" required className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required className="rounded-xl h-11" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="pwd">Password</Label>
                <Input id="pwd" type="password" required className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpwd">Confirm</Label>
                <Input id="cpwd" type="password" required className="rounded-xl h-11" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="Tunis, Sfax, Sousse…" required className="rounded-xl h-11" />
            </div>
            <div className="space-y-2">
              <Label>I want to</Label>
              <RadioGroup value={role} onValueChange={setRole} className="grid grid-cols-3 gap-2">
                {[
                  { value: "need", label: "Need help", icon: HandHeart },
                  { value: "give", label: "Help others", icon: HeartHandshake },
                  { value: "both", label: "Both", icon: Sparkles },
                ].map((r) => {
                  const Icon = r.icon;
                  const active = role === r.value;
                  return (
                    <label
                      key={r.value}
                      htmlFor={`r-${r.value}`}
                      className={`flex flex-col items-center gap-1 p-3 rounded-xl border cursor-pointer transition ${
                        active
                          ? "border-primary bg-primary-soft text-accent-foreground"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <RadioGroupItem id={`r-${r.value}`} value={r.value} className="sr-only" />
                      <Icon className="h-4 w-4" />
                      <span className="text-xs font-medium">{r.label}</span>
                    </label>
                  );
                })}
              </RadioGroup>
            </div>
            <label className="flex items-start gap-2 text-sm cursor-pointer">
              <Checkbox id="terms" required className="mt-0.5" />
              <span className="text-muted-foreground">
                I agree to the <a href="#" className="text-primary hover:underline">Terms</a> and{" "}
                <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
              </span>
            </label>
            <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl shadow-[var(--shadow-soft)]">
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </form>
          <p className="text-sm text-center text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
